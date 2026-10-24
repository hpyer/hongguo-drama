const assert = require('node:assert/strict');
const { fitWindowBounds, getWindowScale } = require('../src/native/window-layout');
const screen = { x: 0, y: 25, width: 1440, height: 850 };
const current = { x: 100, y: 100, width: 1100, height: 750 };
const portrait = fitWindowBounds('portrait', current, screen);
assert(portrait.height > portrait.width);
assert.equal(portrait.width, 620);
assert(portrait.y >= screen.y && portrait.y + portrait.height <= 875);
assert.deepEqual(fitWindowBounds('landscape', current, screen, current), current);
const secondary = { x: -1024, y: 0, width: 1024, height: 700 };
const moved = fitWindowBounds('landscape', portrait, secondary, current);
assert(moved.x >= -1024 && moved.x + moved.width <= 0);
assert(moved.height <= 700);
const small = fitWindowBounds('portrait', current, { x: 0, y: 0, width: 800, height: 600 });
assert(small.width < small.height && small.height <= 600);
assert.throws(() => fitWindowBounds('invalid', current, screen), /Invalid/);
assert.equal(typeof getWindowScale, 'function', '横屏需统一缩放以保持逻辑布局宽度');
for (const width of [900, 1100, 1200, 1470, 1920]) {
  const scale = getWindowScale('landscape', width);
  assert(Math.abs(width / scale - 1200) < 0.001, '窗口缩放不能改变页面行列');
  assert.equal(getWindowScale('portrait', width), 1, '竖屏保持原样');
  assert.equal(getWindowScale('landscape', width, true), 1, '隐身小窗保持原样');
}
assert.equal(getWindowScale('landscape', 0), 1);
console.log('PASS window layout: portrait, round trip, moved display, small display, invalid mode');
console.log('PASS proportional landscape scaling: narrow, normal, wide; portrait and stealth unchanged');
