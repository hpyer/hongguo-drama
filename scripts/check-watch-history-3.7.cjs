// Focused 3.7 checks: family grouping, detection scopes, single-row refresh and split errors.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { EventEmitter } = require('node:events');
const { createRequire } = require('node:module');

const source = path.resolve(__dirname, '../main.js');
const req = createRequire(source);
const baseTitle = '聚宝仙盆之杂灵根才是真BOSS';

function fixture({ failId = '', now = Date.now() } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hongguo-history-37-'));
  const handlers = {}, queries = [], fetches = [];
  const seriesList = [1, 2, 3].map(season => ({
    series_id: `100000${season}`,
    series_title: `${baseTitle}${season === 1 ? '' : `第${['', '一', '二', '三'][season]}季`}`,
    total: 10,
    episodes: Array.from({ length: 10 }, (_, index) => ({ vid_index: index + 1, vid: `${season}-${index + 1}` })),
  }));
  const playback = Object.fromEntries(seriesList.map((item, index) => [item.series_id, {
    watched: true, vid_index: 1, currentTime: 5, updatedAt: now - index,
    knownTotal: 10, acknowledgedTotal: 10, completedEpisode: index === 0 ? 10 : 0,
    lastCheckedAt: now - 7 * 60 * 60 * 1000, lastSequelCheckAt: 1,
  }]));
  const app = new EventEmitter();
  Object.assign(app, { getVersion: () => '3.7.0', getPath: () => dir, commandLine: { appendSwitch() {} },
    requestSingleInstanceLock: () => true, whenReady: () => ({ then() {} }) });
  const electron = { app, ipcMain: { handle: (name, fn) => { handlers[name] = fn; } },
    protocol: { registerSchemesAsPrivileged() {} } };
  const store = {
    getSettings: () => ({ watch_updates_enabled: true, watch_sequels_enabled: true }),
    getPlayback: () => structuredClone(playback),
    savePlayback: next => { Object.keys(playback).forEach(key => delete playback[key]); Object.assign(playback, structuredClone(next)); },
    saveSeries() {},
  };
  const hongguo = {
    fetchEpisodeList: async id => {
      fetches.push(String(id));
      if (String(id) === failId) throw new Error('分集接口超时');
      return structuredClone(seriesList.find(item => item.series_id === String(id)));
    },
  };
  const hongguoSearch = {
    searchHongguo: async keyword => {
      queries.push(String(keyword));
      const results = String(keyword).toLowerCase() === baseTitle.toLowerCase() ? seriesList : [];
      return { results, total: results.length, page: 1, totalPages: 1, hasMore: false };
    },
  };
  const overrides = {
    electron, './src/store': store, './src/native/hongguo': hongguo,
    './src/native/hongguo-search': hongguoSearch,
    './src/native/xifan': { search: async () => ({ success: true, results: [] }) },
    './src/native/hema': { search: async () => ({ success: true, results: [] }) },
  };
  const context = vm.createContext({
    require: name => overrides[name] || req(name), __dirname: path.dirname(source), process,
    console: { log() {}, warn() {}, error() {} }, Buffer, URL, Response, Request, Headers,
    AbortController, setTimeout, clearTimeout,
  });
  vm.runInContext(fs.readFileSync(source, 'utf8'), context, { filename: source });
  require('./fixtures/trusted-ipc.cjs')(context, handlers);
  context.fixture = seriesList;
  vm.runInContext('seriesRegistry = fixture', context);
  return {
    playback, queries, fetches, handlers,
    refresh: options => handlers['refresh-watch-history']({}, options),
    autoRefresh: () => vm.runInContext('refreshWatchHistory()', context),
    checkOne: id => handlers['check-watch-history-item']({}, id),
    cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}

test('3.7 batch checks every season but searches the family sequel once', async () => {
  const h = fixture();
  try {
    const result = await h.refresh({ scope: 'all' });
    assert.equal(result.checked, 3);
    assert.deepEqual(h.fetches.sort(), ['1000001', '1000002', '1000003']);
    assert.equal(h.queries.filter(keyword => keyword.toLowerCase() === baseTitle.toLowerCase()).length, 1,
      'the same family must not repeat the base search for every season');
    assert.equal(h.playback['1000001'].sequels.length, 2, 'low seasons receive matching higher seasons');
    assert.equal(h.playback['1000002'].sequels.length, 1);
    assert.equal(h.playback['1000003'].sequels.length, 0);
  } finally { h.cleanup(); }
});

test('3.7 latest scope and single-row check touch only the requested row', async () => {
  const latest = fixture();
  try {
    assert.equal((await latest.refresh({ scope: 'latest' })).checked, 1);
    assert.deepEqual(latest.fetches, ['1000003']);
  } finally { latest.cleanup(); }

  const single = fixture();
  try {
    const result = await single.checkOne('1000001');
    assert.equal(result.success, true);
    assert.deepEqual(single.fetches, ['1000001']);
    assert.equal(single.queries.filter(keyword => keyword.toLowerCase() === baseTitle.toLowerCase()).length, 1,
      'single-row check still uses the latest family season for the shared sequel search');
    assert.equal(single.playback['1000001'].sequels.length, 2);
  } finally { single.cleanup(); }
});

test('3.7 completed low seasons skip automatic 6-hour checks but remain manually checkable', async () => {
  const h = fixture();
  try {
    assert.equal((await h.autoRefresh()).checked, 2);
    assert.deepEqual(h.fetches.sort(), ['1000002', '1000003']);
    assert.equal((await h.checkOne('1000001')).success, true);
    assert.ok(h.fetches.includes('1000001'));
  } finally { h.cleanup(); }
});

test('3.7 episode failures remain separate from sequel results', async () => {
  const h = fixture({ failId: '1000002' });
  try {
    const result = await h.refresh({ scope: 'all' });
    assert.equal(result.checked, 2);
    assert.equal(result.failed, 1);
    assert.match(h.playback['1000002'].lastEpisodeCheckError, /超时/);
    assert.equal(h.playback['1000002'].lastSequelCheckError, '');
    assert.equal(h.playback['1000001'].lastEpisodeCheckError, '');
  } finally { h.cleanup(); }
});
