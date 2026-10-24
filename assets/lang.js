// Selector de idioma de las páginas legales (español / inglés).
// El título de cada idioma va en los atributos data-title-es y data-title-en de <html>.
(function () {
  var supported = ["es", "en"];
  var root = document.documentElement;

  function readStored() {
    try { return localStorage.getItem("oeaon-lang"); } catch (e) { return null; }
  }

  function store(lang) {
    try { localStorage.setItem("oeaon-lang", lang); } catch (e) {}
  }

  function initialLang() {
    var param = new URLSearchParams(location.search).get("lang");
    if (supported.indexOf(param) !== -1) return param;
    var stored = readStored();
    if (supported.indexOf(stored) !== -1) return stored;
    return (navigator.language || "es").toLowerCase().indexOf("es") === 0 ? "es" : "en";
  }

  function apply(lang) {
    root.lang = lang;
    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang") !== lang;
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-set-lang") === lang));
    });
    document.querySelectorAll("[data-" + lang + "]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-set-lang");
      store(lang);
      apply(lang);
    });
  });

  apply(initialLang());
})();
