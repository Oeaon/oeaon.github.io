// Entradas al hacer scroll, escalera de rangos, calculadora de rango y filtro de apps.
(function () {
  document.documentElement.classList.add("js");

  var rising = document.querySelectorAll("[data-rise]");
  if ("IntersectionObserver" in window) {
    var riser = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          riser.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    rising.forEach(function (el) { riser.observe(el); });
  } else {
    rising.forEach(function (el) { el.classList.add("in"); });
  }

  // Escalera: la medalla fija cambia según el rango que está en el centro.
  var steps = document.querySelectorAll(".ladder-list li");
  var medals = document.querySelectorAll(".ladder-medal img");
  if (steps.length && "IntersectionObserver" in window) {
    var show = function (index) {
      steps.forEach(function (s, i) { s.classList.toggle("on", i === index); });
      medals.forEach(function (m, i) { m.classList.toggle("on", i === index); });
    };
    show(0);
    var stepper = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) show(Array.prototype.indexOf.call(steps, entry.target));
      });
    }, { rootMargin: "-48% 0px -48% 0px" });
    steps.forEach(function (s) { stepper.observe(s); });
  }

  // Calculadora: los mismos umbrales y objetos que la app.
  var input = document.getElementById("kg");
  if (input) {
    var RANKS = [
      ["Hormiga", 0, "rank_01_ant"], ["Escarabajo", 10000, "rank_02_beetle"],
      ["Águila", 50000, "rank_03_eagle"], ["Anaconda", 150000, "rank_04_snake"],
      ["Cocodrilo", 400000, "rank_05_crocodile"], ["Tigre", 1000000, "rank_06_tiger"],
      ["Toro", 2000000, "rank_07_bull"], ["Oso grizzly", 4000000, "rank_08_bear"],
      ["Gorila", 7000000, "rank_09_gorilla"], ["Elefante", 10000000, "rank_10_elephant"]
    ];
    var OBJECTS = [
      [70, "una lavadora", "lavadoras"], [200, "una moto", "motos"],
      [450, "un piano de cola", "pianos de cola"], [1500, "un coche", "coches"],
      [4000, "un tractor", "tractores"], [9000, "un caza de combate", "cazas de combate"],
      [12000, "un autobús", "autobuses"], [41000, "un avión comercial", "aviones comerciales"],
      [62000, "un tanque", "tanques"], [150000, "una ballena azul", "ballenas azules"],
      [180000, "un Jumbo 747", "Jumbos 747"], [549000, "un cohete Falcon 9", "cohetes Falcon 9"]
    ];
    var scale = 1;
    var format = new Intl.NumberFormat("es-ES");
    var nameEl = document.getElementById("rank-name");
    var nextEl = document.getElementById("rank-next");
    var heavyEl = document.getElementById("rank-heavy");
    var medal = document.getElementById("rank-medal");

    var heavy = function (kg) {
      var best = null;
      OBJECTS.forEach(function (o) { if (kg >= o[0]) best = o; });
      if (!best) return "Aún no llega a una lavadora, pero todo empieza con la primera serie.";
      var count = Math.floor(kg / best[0]);
      return "Has movido lo mismo que " + (count === 1 ? best[1] : format.format(count) + " " + best[2]) + ".";
    };

    var update = function () {
      var kg = parseInt(input.value.replace(/\D/g, ""), 10) || 0;
      if (kg > 999999999) kg = 999999999;
      var index = 0;
      RANKS.forEach(function (r, i) { if (kg >= r[1] * scale) index = i; });
      var rank = RANKS[index];
      var next = RANKS[index + 1];
      nameEl.textContent = rank[0];
      nextEl.textContent = next
        ? "Te faltan " + format.format(Math.ceil(next[1] * scale - kg)) + " kg para " + next[0] + "."
        : "Has llegado a lo más alto de la escalera.";
      heavyEl.textContent = heavy(kg);
      var src = "/assets/mtp/" + rank[2] + ".png";
      if (medal.getAttribute("src") !== src) {
        medal.setAttribute("src", src);
        medal.alt = "Medalla de " + rank[0];
        medal.classList.add("bump");
        setTimeout(function () { medal.classList.remove("bump"); }, 140);
      }
      // El punto es más estrecho que una cifra: así «kg» queda pegado al número.
      var digits = input.value.replace(/\D/g, "").length;
      var dots = input.value.length - digits;
      input.style.width = Math.max(digits + dots * 0.45, 2) + "ch";
    };

    input.addEventListener("input", function () {
      var digits = input.value.replace(/\D/g, "").slice(0, 9);
      input.value = digits ? format.format(parseInt(digits, 10)) : "";
      update();
    });
    document.querySelectorAll("[data-kg]").forEach(function (button) {
      button.addEventListener("click", function () {
        input.value = format.format(parseInt(button.getAttribute("data-kg"), 10));
        update();
      });
    });
    document.querySelectorAll("[data-scale]").forEach(function (button) {
      button.addEventListener("click", function () {
        scale = parseFloat(button.getAttribute("data-scale"));
        document.querySelectorAll("[data-scale]").forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === button));
        });
        update();
      });
    });
    update();
  }

  // Portada: filtro de apps por lo que quieres resolver.
  var filters = document.querySelectorAll("[data-need-filter]");
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var need = button.getAttribute("data-need-filter");
      filters.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === button));
      });
      document.querySelectorAll("[data-need]").forEach(function (app) {
        app.hidden = need !== "todo" && app.getAttribute("data-need") !== need;
        if (!app.hidden) {
          app.classList.add("in");
          app.querySelectorAll("[data-rise]").forEach(function (part) { part.classList.add("in"); });
        }
      });
    });
  });
})();
