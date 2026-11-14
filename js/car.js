(() => {
  const { CARS, money, iso, fmtDate, overlaps, isBooked, freeUntil, waLink } = window.AB;
  const $ = (s) => document.querySelector(s);

  const id = +new URLSearchParams(location.search).get("id");
  const car = CARS.find(c => c.id === id) || CARS[0];
  const today = "2026-11-14";
  const state = { type: "self", from: "2026-11-16", to: "2026-11-19" };

  document.title = `${car.name} | Al Buraak`;
  $("#crumb").textContent = car.name;

  const MONTHS = [[2026, 10, "November 2026"], [2026, 11, "December 2026"]];

  function calendarHtml() {
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => `<div class="wd">${d}</div>`).join("");
    return MONTHS.map(([y, m, label]) => {
      const first = new Date(y, m, 1).getDay();
      const days = new Date(y, m + 1, 0).getDate();
      let cells = "";
      for (let i = 0; i < first; i++) cells += `<div class="day blank"></div>`;
      for (let d = 1; d <= days; d++) {
        const key = iso(new Date(y, m, d));
        const cls = key < today ? "past" : isBooked(car, key) ? "booked" : "free";
        const inRange = key >= state.from && key <= state.to ? " picked" : "";
        cells += `<div class="day ${cls}${inRange}" title="${fmtDate(key)}">${d}</div>`;
      }
      return `<div class="month"><h4>${label}</h4><div class="grid-cal">${wd}${cells}</div></div>`;
    }).join("");
  }

  function render() {
    const busy = overlaps(car, state.from, state.to);
    const self = state.type === "self";
    const price = self ? car.self : car.driver;
    const total = price * ((new Date(state.to) - new Date(state.from)) / 86400000 + 1);

    $("#page").innerHTML = `
      
      <section class="car-hero">
        <div class="car-stage"><span class="emoji-lg" aria-hidden="true">${car.icon}</span></div>
        <div class="car-main">
          <p class="kicker">${car.cat} · Lahore</p>
          <h1>${car.name}</h1>
          <p class="lead">${car.desc}</p>
          <ul class="specs">
            <li>Seats<b>${car.seats}</b></li>
            <li>Luggage<b>${car.bags} bags</b></li>
            <li>Transmission<b>${car.trans}</b></li>
            <li>Fuel<b>${car.fuel}</b></li>
          </ul>
        </div>
      </section>

      <section class="car-grid">
        <div class="panel">
          <h2>Choose rental type</h2>
          <div class="seg" role="group" aria-label="Rental type">
            <button class="seg-btn ${self ? "on" : ""}" data-type="self" aria-pressed="${self}">Self drive<small>${money(car.self)} / day</small></button>
            <button class="seg-btn ${!self ? "on" : ""}" data-type="driver" aria-pressed="${!self}">With driver<small>${money(car.driver)} / day</small></button>
          </div>
          <ul class="opt-list">
            ${self
              ? "<li>You drive. Driving license and CNIC required.</li><li>Refundable security deposit at handover.</li>"
              : "<li>Driver included in the quote.</li><li>Driver's food and rest time covered in the total.</li>"}
          </ul>

          <h2>Pick your dates</h2>
          <div class="dates-row">
            <label>From<input type="date" id="from" value="${state.from}"></label>
            <label>To<input type="date" id="to" value="${state.to}"></label>
          </div>
          <div class="avail-box ${busy ? "busy" : "ok"}">
            ${busy
              ? "This car is booked on some of these dates. Pick other dates or message us."
              : `Available on your dates. Free until ${freeUntil(car, state.from)}.`}
          </div>
          <p class="total">Estimated total: <b>${money(total)}</b> for ${(total / price)} day(s). Final quote is confirmed on WhatsApp.</p>
          <a class="btn btn-red btn-block" href="${waLink(car, state.type, state.from, state.to)}" target="_blank" rel="noopener">
            Book now on WhatsApp (${self ? "self drive" : "with driver"})
          </a>
          <p class="fine">No login needed. We confirm details with you on WhatsApp.</p>
        </div>

        <div class="panel">
          <h2>Availability calendar</h2>
          <div class="legend">
            <span><i class="sw free"></i>Free</span>
            <span><i class="sw booked"></i>Booked</span>
            <span><i class="sw picked"></i>Your dates</span>
          </div>
          <div class="calendars">${calendarHtml()}</div>
          <p class="fine">Booked days update as new bookings are confirmed.</p>
        </div>
      </section>

      <p class="back-row"><a class="btn btn-ghost" href="index.html#fleet">← Back to all cars</a></p>`;

    bind();
  }

  function bind() {
    document.querySelectorAll(".seg-btn").forEach(b => b.addEventListener("click", () => {
      state.type = b.dataset.type; render();
    }));
    const from = document.getElementById("from"), to = document.getElementById("to");
    const change = () => {
      if (from.value && to.value && to.value >= from.value) { state.from = from.value; state.to = to.value; render(); }
    };
    from.addEventListener("change", change);
    to.addEventListener("change", change);
  }

  render();
})();
