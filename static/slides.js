// Slide viewer. Without JS every slide is shown stacked; with JS one slide (and its explanation) shows at a time.
// Keys: left/right, PageUp/PageDown, Home/End. Buttons and touch swipe too. The URL hash #s{i} tracks the slide.
(function () {
  var units = document.querySelectorAll("[data-unit]");
  if (!units.length) return;
  document.body.classList.add("js-slides");
  var pos = document.getElementById("pos");
  var cur = -1;
  function index(hash) {
    var m = /^#s(\d+)$/.exec(hash);
    var n = m ? parseInt(m[1], 10) - 1 : 0;
    return Math.max(0, Math.min(units.length - 1, n));
  }
  function show(i, push) {
    i = Math.max(0, Math.min(units.length - 1, i));
    if (i !== cur) {
      units.forEach(function (u, k) { u.classList.toggle("active", k === i); });
      cur = i;
    }
    if (pos) pos.textContent = (i + 1) + " / " + units.length;
    var h = "#s" + (i + 1);
    if (push && location.hash !== h) location.hash = h;
  }
  function go(d) { show(cur + d, true); }
  window.addEventListener("hashchange", function () { show(index(location.hash), false); });
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown") go(1);
    else if (k === "ArrowLeft" || k === "PageUp") go(-1);
    else if (k === "Home") show(0, true);
    else if (k === "End") show(units.length - 1, true);
    else return;
    e.preventDefault();
  });
  var prev = document.getElementById("prev"), next = document.getElementById("next");
  if (prev) prev.addEventListener("click", function () { go(-1); });
  if (next) next.addEventListener("click", function () { go(1); });
  var x0 = null, y0 = null, v = document.getElementById("viewer");
  // A drag that starts inside a horizontal scroller (e.g. a wide table) scrolls it; it is not a slide swipe.
  function scrollsX(el) {
    for (; el && el !== v; el = el.parentElement) {
      if (el.nodeType === 1 && (el.classList.contains("table-wrap") || el.scrollWidth > el.clientWidth)) return true;
    }
    return false;
  }
  v.addEventListener("touchstart", function (e) {
    if (scrollsX(e.target)) { x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  v.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 2 * Math.abs(dy)) go(dx < 0 ? 1 : -1);
  }, { passive: true });
  show(index(location.hash), false);
})();
