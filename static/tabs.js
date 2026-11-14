// Week page tabs. Without JS every section stays visible; with JS one section shows at a time,
// kept in sync with the URL hash (#lectures, #practical, #lab, #reading).
(function () {
  var tabs = document.querySelectorAll(".tabs a");
  var sections = document.querySelectorAll("section.tab");
  if (!tabs.length || !sections.length) return;
  document.body.classList.add("js-tabs");
  function show(id) {
    var found = false;
    sections.forEach(function (s) { if (s.id === id) found = true; });
    if (!found) id = sections[0].id;
    sections.forEach(function (s) { s.classList.toggle("active", s.id === id); });
    tabs.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
  }
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); window.scrollTo(0, 0); });
  show(location.hash.slice(1));
})();
