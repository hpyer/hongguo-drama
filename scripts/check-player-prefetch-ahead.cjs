const assert = require('node:assert/strict');
const { mount } = require('./check-player-resume.cjs');

const openEpisode = async (options = {}) => {
  const ui = mount({
    ...options,
    props: { setEpisodesOpen() {}, target: { seriesId: 'A', vidIndex: 1, ts: 1 }, ...(options.props || {}) },
  });
  await ui.flush();
  ui.metadata();
  await ui.flush();
  return ui;
};
const prefetches = ui => ui.prepares.filter(item => item.prefetch === true);
const tick = (ui, time) => {
  ui.media.currentTime = time;
  ui.find(node => node.type === 'video').props.onTimeUpdate?.({ currentTarget: ui.media });
};

(async () => {
  let failures = 0;
  const test = async (name, fn) => {
    try { await fn(); console.log('PASS ' + name); }
    catch (error) { failures++; console.error('FAIL ' + name + ': ' + (error.stack || error.message)); }
  };

  await test('playback prefetches at most the next two online episodes', async () => {
    const ui = await openEpisode({ episodeCount: 6 });
    try {
      assert.deepEqual(prefetches(ui).map(item => item.vidIndex), [2, 3]);
      tick(ui, 1); tick(ui, 2); await ui.flush();
      assert.deepEqual(prefetches(ui).map(item => item.vidIndex), [2, 3], 'timeupdate must not enqueue a third episode');
    } finally { ui.unmount(); }
  });

  await test('locked and local episodes are skipped without shrinking the two-ahead window', async () => {
    const ui = await openEpisode({ episodeCount: 5, lockedIndexes: [2, 4] });
    try {
      assert.deepEqual(prefetches(ui).map(item => item.vidIndex), [3, 5]);
    } finally { ui.unmount(); }
  });

  await test('switching to the next episode consumes its preparation and keeps the following one', async () => {
    const ui = await openEpisode({ episodeCount: 4 });
    try {
      const following = prefetches(ui).find(item => item.vidIndex === 3);
      assert.ok(following, 'episode three must already be preparing');
      ui.episode(2);
      await ui.flush();
      ui.metadata();
      await ui.flush();
      assert.equal(ui.releases.some(item => item.requestId === following.requestId), false,
        'the next-next prefetch must survive the handoff');
      assert.equal(prefetches(ui).filter(item => item.vidIndex === 3).length, 1,
        'the retained episode three preparation must not be duplicated');
      assert.ok(prefetches(ui).some(item => item.vidIndex === 4),
        'after switching, the queue must refill with the new next-next episode');
    } finally { ui.unmount(); }
  });

  await test('one failed target retries after cooldown without duplicating the other target', async () => {
    let now = Date.now();
    let targetTwoAttempts = 0;
    const ui = await openEpisode({
      episodeCount: 4,
      now: () => now,
      prepare: async payload => {
        if (payload.prefetch === true && payload.vidIndex === 2) {
          targetTwoAttempts += 1;
          return { success: false, error: 'network' };
        }
        return { success: true, url: `hongguo-stream://${payload.vidIndex}` };
      },
    });
    try {
      assert.equal(targetTwoAttempts, 1);
      assert.equal(prefetches(ui).filter(item => item.vidIndex === 3).length, 1);
      tick(ui, 1); await ui.flush();
      assert.equal(targetTwoAttempts, 1, 'retry must wait for the cooldown');
      now += 16000;
      tick(ui, 2); await ui.flush();
      assert.equal(targetTwoAttempts, 2, 'failed target must retry after the cooldown');
      assert.equal(prefetches(ui).filter(item => item.vidIndex === 3).length, 1,
        'successful next-next target must not be retried');
    } finally { ui.unmount(); }
  });

  await test('disabling cache releases every queued prefetch request', async () => {
    const ui = mount({
      props: { setEpisodesOpen() {}, target: { seriesId: 'A', vidIndex: 1, ts: 1 } },
      episodeCount: 4,
      prepare: async payload => payload.prefetch === true
        ? new Promise(() => {})
        : { success: true, url: 'hongguo-stream://first' },
    });
    try {
      await ui.flush(); ui.metadata(); await ui.flush();
      const toggle = ui.button('缓存后续 2 集');
      toggle.props.onClick();
      await ui.flush();
      await ui.flush();
      const queued = prefetches(ui).filter(item => item.vidIndex === 2 || item.vidIndex === 3);
      assert.equal(queued.length, 2);
      for (const request of queued) {
        assert.ok(ui.releases.some(item => item.requestId === request.requestId),
          'queued request ' + request.vidIndex + ' must be released when cache is disabled');
      }
    } finally { ui.unmount(); }
  });

  if (failures) process.exitCode = 1;
})();
