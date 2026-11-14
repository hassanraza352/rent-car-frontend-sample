// Shared data and helpers. Replace the sample cars and booked dates with real ones.
window.AB = (() => {
  const WA = "923000000000"; // real WhatsApp number, digits only

  const CARS = [
    { id: 1, name: "Toyota Corolla", cat: "Sedan", icon: "🚗", seats: 5, bags: 2, trans: "Automatic", fuel: "Petrol", self: 5000, driver: 7500,
      desc: "A comfortable economy sedan for city drives, office trips and short family outings.",
      booked: [["2026-11-12", "2026-11-15"], ["2026-11-22", "2026-11-25"]] },
    { id: 2, name: "Honda Civic", cat: "Sedan", icon: "🚙", seats: 5, bags: 2, trans: "Automatic", fuel: "Petrol", self: 7000, driver: 9500,
      desc: "A premium sedan with a smooth ride, good cabin space and a quiet engine for longer trips.",
      booked: [["2026-11-14", "2026-11-18"]] },
    { id: 3, name: "Kia Sportage", cat: "SUV", icon: "🚙", seats: 5, bags: 3, trans: "Automatic", fuel: "Petrol", self: 9000, driver: 11500,
      desc: "A compact SUV with high seating, extra luggage room and a confident feel on rough roads.",
      booked: [["2026-11-17", "2026-11-21"]] },
    { id: 4, name: "Toyota Fortuner", cat: "SUV", icon: "🛻", seats: 7, bags: 4, trans: "Automatic", fuel: "Diesel", self: 12000, driver: 14500,
      desc: "A seven seat SUV for family trips, events and outstation travel with a lot of luggage.",
      booked: [] }
  ];

  const money = (n) => "PKR " + n.toLocaleString("en-PK");
  const iso = (d) => d.toISOString().slice(0, 10);
  const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const dayBefore = (d) => { const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() - 1); return iso(x); };

  // Is any booking inside [from, to]?
  const overlaps = (car, from, to) => car.booked.some(([s, e]) => s <= to && e >= from);
  // Is a single day booked?
  const isBooked = (car, day) => car.booked.some(([s, e]) => day >= s && day <= e);

  function freeUntil(car, from) {
    const next = car.booked.map(b => b[0]).filter(s => s > from).sort()[0];
    return next ? fmtDate(dayBefore(next)) : "end of November";
  }

  function waLink(car, type, from, to) {
    const kind = type === "self" ? "self drive" : "with driver";
    const dates = from && to ? ` from ${fmtDate(from)} to ${fmtDate(to)}` : "";
    const msg = `Assalamualaikum, I want to book the ${car.name} (${kind}) in Lahore${dates}. Please confirm the quote.`;
    return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }

  return { CARS, WA, money, iso, fmtDate, overlaps, isBooked, freeUntil, waLink };
})();
