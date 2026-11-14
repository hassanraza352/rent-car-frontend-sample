(() => {
  const { CARS, money, overlaps, freeUntil, waLink } = window.AB;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const state = { filter: "all", from: "2026-11-16", to: "2026-11-19" };

  function renderCars() {
    const list = CARS.filter(c => state.filter === "all" || c.cat === state.filter);
    $("#cars").innerHTML = list.map(c => {
      const busy = overlaps(c, state.from, state.to);
      const status = busy ? "Booked on your dates" : `Available · free until ${freeUntil(c, state.from)}`;
      return `
        <a class="car reveal in" href="car.html?id=${c.id}">
          <div class="car-img">
            <span class="emoji" aria-hidden="true">${c.icon}</span>
            <span class="tag-avail ${busy ? "busy" : ""}">${busy ? "Booked" : "Available"}</span>
          </div>
          <div class="car-body">
            <div class="car-top">
              <div><h3>${c.name}</h3><small>${c.cat} · ${c.fuel}</small></div>
              <div class="car-price">${money(c.self)}<small>self drive / day</small></div>
            </div>
            <div class="specs-mini"><span>${c.seats} seats</span><span>${c.bags} bags</span><span>${c.trans}</span></div>
            <p class="status ${busy ? "busy" : ""}">${status}</p>
            <span class="view">View details →</span>
          </div>
        </a>`;
    }).join("") || `<p class="empty">No cars in this category right now.</p>`;
  }

  function renderSelectors() {
    $$(".car-select").forEach(sel => {
      if (!sel.options.length) sel.innerHTML = CARS.map(c => `<option value="${c.id}">${c.name} (${c.cat})</option>`).join("");
    });
    $$(".book-btn").forEach(btn => {
      const car = CARS.find(c => c.id === +$(`.car-select[data-type="${btn.dataset.type}"]`).value);
      btn.href = waLink(car, btn.dataset.type, state.from, state.to);
    });
  }

  function renderRates() {
    $("#rateRows").innerHTML = CARS.map(c => `
      <tr><td><b>${c.name}</b></td><td>${c.cat}</td><td>${money(c.self)}</td><td>${money(c.driver)}</td></tr>`).join("");
  }

  $$(".car-select").forEach(s => s.addEventListener("change", renderSelectors));

  $$(".chip").forEach(chip => chip.addEventListener("click", () => {
    state.filter = chip.dataset.filter;
    $$(".chip").forEach(c => c.classList.toggle("on", c === chip));
    renderCars();
  }));

  const syncDates = () => {
    const from = $("#fromDate").value, to = $("#toDate").value;
    if (from && to && to >= from) { state.from = from; state.to = to; }
    renderCars(); renderSelectors();
  };
  $("#fromDate").addEventListener("change", syncDates);
  $("#toDate").addEventListener("change", syncDates);

  // Mobile menu
  const burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
  });
  $$("#menu a").forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
  }));

  // Nav shadow
  const nav = $("#nav");
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".reveal:not(.in)").forEach(el => io.observe(el));

  // Loader
  const loader = $("#loader");
  const started = Date.now();
  const hide = () => setTimeout(() => loader.classList.add("done"), Math.max(0, 1600 - (Date.now() - started)));
  if (document.readyState === "complete") hide(); else window.addEventListener("load", hide);
  setTimeout(() => loader.classList.add("done"), 4000);

  renderRates(); renderSelectors(); renderCars();
})();
