// In-memory App -> real play-series IPC -> Player contract; no network or user files.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { transformSync } = require('esbuild');
const { mount: mountPlayer } = require('./check-player-resume.cjs');
const appSource = transformSync(fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf8'), { loader: 'jsx', format: 'cjs' }).code;
const mainSource = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8');
const playHandler = mainSource.slice(mainSource.indexOf("ipcMain.handle('play-series'"), mainSource.indexOf('// ===== 在线播放 ====='));
assert.ok(playHandler.startsWith("ipcMain.handle('play-series'"), 'real playback IPC must be found');

function fixture({ exists = true, dismissed = false, saveError = '', resolveError = '', playError = '' } = {}) {
  const registry = exists ? [{ series_id: 'A', dismissed, forgotten: dismissed }] : [];
  const requests = [], resolutions = [], slots = [], effects = [];
  let cursor = 0, tree, navigate, handler;
  const component = name => ({ __esModule: true, default: name });
  const react = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) }),
    useState: initial => { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
    useRef: initial => { const i = cursor++; return slots[i] ||= { current: initial }; },
    useCallback: fn => { cursor++; return fn; },
    useEffect: (fn, deps) => { const i = cursor++; if (!slots[i] || deps.some((v, j) => !Object.is(v, slots[i][j]))) { slots[i] = deps; effects.push(fn); } },
  };
  react.useLayoutEffect = react.useEffect;
  vm.runInNewContext(playHandler, {
    ipcMain: { handle: (_, fn) => { handler = fn; } }, seriesRegistry: registry,
    saveSeriesRegistry: () => { if (saveError) throw new Error(saveError); },
    sendToRenderer: (_, payload) => navigate(payload),
  });
  const api = {
    getAppInfo: async () => ({ preview: true }),
    onNavigate: fn => { navigate = fn; return () => {}; },
    playSeries: async payload => {
      requests.push({ ...payload });
      if (playError) return { success: false, error: playError };
      return handler({}, payload);
    },
    searchResolve: async id => {
      resolutions.push(id);
      if (resolveError) return { success: false, error: resolveError };
      if (!registry.some(item => item.series_id === id)) registry.push({ series_id: id });
      return { success: true, data: { series_id: id } };
    },
  };
  const module = { exports: {} };
  vm.runInNewContext(appSource, { module, exports: module.exports, window: { electronAPI: api }, navigator: {},
    require: name => name === 'react' ? react : name === './theme' ? { initializeTheme() {} }
      : name === './components/useStealthWindow' ? { __esModule: true, default: () => ({}) } : component(name),
  });
  const render = () => { cursor = 0; tree = module.exports.default(); effects.splice(0).forEach(fn => fn()); };
  const find = predicate => {
    const visit = node => { if (!node || typeof node !== 'object') return; if (predicate(node)) return node; return node.children?.map(visit).find(Boolean); };
    return visit(tree);
  };
  const flush = async () => { for (let i = 0; i < 8; i++) { await Promise.resolve(); render(); } };
  render();
  find(node => node.type === 'button' && node.children.some(child => child?.children?.includes('收藏与上新'))).props.onClick();
  render();
  return { registry, requests, resolutions, find, flush,
    play: async () => { await find(node => node.type === './components/ReleaseCalendar').props.onPlay({ seriesId: 'A' }); await flush(); },
    target: () => find(node => node.type === './components/Player')?.props.target,
    error: () => find(node => node.props.role === 'alert')?.children[0]?.children[0],
  };
}

for (const dismissed of [false, true]) for (const saved of [null, { vid_index: 2, currentTime: 37 }]) {
  test(`offline calendar playback: dismissed=${dismissed}, saved=${!!saved}`, async () => {
    const app = fixture({ dismissed, resolveError: 'offline' });
    await app.play();
    assert.equal(app.resolutions.length, 0, 'existing local archive must not require online resolution');
    assert.equal(app.error(), undefined);
    assert.equal(app.registry[0].dismissed, false);
    assert.equal(app.requests.length, 1);
    assert.equal(app.requests[0].resume, true);
    assert.equal(app.target()?.seriesId, 'A');
    const player = mountPlayer({ local: true, saved, lockedIndexes: saved ? [] : [1], props: { target: app.target() } });
    try {
      await player.flush(); player.metadata();
      assert.equal(player.find(node => node.type === 'video').props.src, 'file:///mock-2.mp4');
      assert.equal(player.media.paused, false, 'play must start media, not merely open the library');
      assert.equal(player.media.currentTime, saved?.currentTime || 0);
      assert.equal(player.prepares.length, 0, 'local video must not request an online source');
    } finally { player.unmount(); }
  });
}

test('only a missing archive resolves online, then sends a real play command', async () => {
  const app = fixture({ exists: false }); await app.play();
  assert.deepEqual(app.resolutions, ['A']);
  assert.equal(app.requests.length, 2);
  assert.ok(app.requests.every(request => request.seriesId === 'A' && request.resume === true));
  assert.equal(app.target()?.seriesId, 'A'); assert.equal(app.error(), undefined);
});

test('failed online resolution keeps calendar visible and reports the source error', async () => {
  const app = fixture({ exists: false, resolveError: 'offline' }); await app.play();
  assert.equal(app.requests.length, 1); assert.equal(app.target(), undefined);
  assert.equal(app.error(), 'offline');
});

test('failed archive restoration stays local and retains its dismissed state', async () => {
  const app = fixture({ dismissed: true, saveError: '磁盘已满' }); await app.play();
  assert.equal(app.resolutions.length, 0); assert.equal(app.target(), undefined);
  assert.equal(app.error(), '磁盘已满'); assert.equal(app.registry[0].dismissed, true);
  assert.equal(app.registry[0].forgotten, true);
});

test('blocked playback does not turn into online resolution', async () => {
  const app = fixture({ playError: '正在退出' }); await app.play();
  assert.equal(app.resolutions.length, 0); assert.equal(app.target(), undefined);
  assert.equal(app.error(), '正在退出');
});
