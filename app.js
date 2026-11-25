"use strict";

/* ------------------------------------------------------------------ *
 *  Leben Realistisch – plant nur so viel, wie du wirklich schaffst.
 *  Alle Daten bleiben lokal im Browser (localStorage).
 * ------------------------------------------------------------------ */

const STORAGE_KEY = "leben-realistisch-v1";

// Zeitblöcke einer Woche. unit "day" = Stunden pro Tag (x7), "week" = pro Woche.
const TIME_FIELDS = [
  { key: "sleep",    label: "Schlaf",                                 unit: "day",  def: 8,
    note: "Durchschnitt mit Ausschlafen am Wochenende. Nicht kürzen." },
  { key: "job2",     label: "KI-Job / Standortleiter (Hauptjob)",     unit: "week", def: 40 },
  { key: "job1",     label: "Elektrojob (on the side)",               unit: "week", def: 7,
    note: "ca. 1 h pro Tag" },
  { key: "commute",  label: "Pendeln / Fahrten",                      unit: "week", def: 7 },
  { key: "security", label: "Security koordinieren (Bruder & Onkel)", unit: "week", def: 1 },
  { key: "chores",   label: "Essen, Haushalt, Körperpflege",          unit: "day",  def: 2 },
  { key: "fixed",    label: "Feste Termine",                          unit: "week", def: 9,
    note: "inkl. Sonntag 12–18 Uhr bei den Eltern" },
  { key: "rest",     label: "Erholung, Freunde, Handy",               unit: "day",  def: 2,
    note: "inkl. Sonntagabend in Köln. Kein Luxus." },
];
const TIME_VERSION = 2; // bei Änderung der Standardwerte hochzählen

/* --------------------- Lese-Sprint (20 Tage) -------------------- */

const SPRINT_DEFAULT = {
  deadline: "2026-12-15",
  books: [
    { title: "Buch 1", pages: 300, read: 0 },
    { title: "Buch 2", pages: 300, read: 0 },
  ],
};

/* ------------------------ Trainingsplan ------------------------- */

const TRAINING = {
  days: [
    { day: "Di (nach der Arbeit)", name: "A · Obere Brust & Schultern", ex: [
      ["Schrägbankdrücken Kurzhantel 30°", "4 × 6–10"],
      ["Fliegende Kabel, von unten nach oben (obere Brust)", "3 × 12–15"],
      ["Dips, Oberkörper vorgelehnt (untere Brust, Frame)", "3 × 8–12"],
      ["Seitheben am Kabel", "4 × 12–20"],
      ["Trizeps über Kopf am Kabel", "3 × 10–15"],
      ["Hängendes Beinheben", "3 × 10–15"],
    ]},
    { day: "Do (nach der Arbeit)", name: "B · Rücken-Breite & Arme", ex: [
      ["Klimmzüge oder Latzug breit", "4 × 6–12"],
      ["Rudern brustgestützt (wenig Nacken)", "3 × 8–12"],
      ["Lat-Pullover am Kabel", "3 × 12–15"],
      ["Reverse Flys (hintere Schulter)", "3 × 15–20"],
      ["Schrägbank-Curls Kurzhantel", "3 × 8–12"],
      ["Hammer-Curls", "3 × 10–12"],
      ["Cable Crunch", "3 × 10–15"],
    ]},
    { day: "Sa (nach dem Ausschlafen)", name: "C · Schultern & Brust", ex: [
      ["Schulterdrücken Kurzhantel", "3 × 6–10"],
      ["Schrägbankdrücken Multipresse", "3 × 6–10"],
      ["Seitheben Kurzhantel", "4 × 12–20"],
      ["Fliegende Maschine (Brust-Mitte, voll zusammendrücken)", "3 × 12–15"],
      ["Trizepsdrücken am Kabel", "3 × 10–15"],
      ["Bizeps-Curls am Kabel", "3 × 10–15"],
    ]},
    { day: "So (vor 12 Uhr)", name: "D · Lat, Arme, Bauch + kurz Beine", ex: [
      ["Latzug eng / Untergriff", "3 × 8–12"],
      ["Kabelrudern einarmig", "3 × 10–12"],
      ["Seitheben (3. Mal: Kanonenkugel-Schultern)", "3 × 15–20"],
      ["Supersatz Bizeps- und Trizeps-Kabel", "3 × 12"],
      ["Beinpresse, nur für Gesundheit und Knie", "2 × 12–15"],
      ["Ab-Wheel / Plank", "3 Sätze"],
    ]},
  ],
  nutrition: [
    "<strong>Start:</strong> 1,80 m · 90 kg · ca. 22 % Körperfett, also ca. 70 kg fettfreie Masse",
    "<strong>Ziel:</strong> ca. 80 kg bei ca. 12 % (Sixpack sichtbar), danach Richtung 10 % für Adern und Härte",
    "<strong>Tempo:</strong> 0,5–0,75 kg pro Woche, also ca. 4–5 Monate bis etwa Mai 2027",
    "<strong>Kalorien:</strong> ca. 2.300 kcal pro Tag. Wenn 2 Wochen lang nichts runtergeht, 150 kcal weniger",
    "<strong>Protein:</strong> 160–180 g pro Tag, damit die Muskeln bleiben, während das Fett geht",
    "<strong>Schritte:</strong> 8.000–10.000 pro Tag. Der billigste Fettverbrenner, kostet kaum Extra-Zeit",
    "<strong>Ehrlich:</strong> Gezielt an Beinen, Po oder Unterbauch abnehmen geht nicht. Das Fett dort geht als Letztes, aber es geht, wenn das Gesamt-Körperfett sinkt",
  ],
};

/* ------------------------- Plan 2027 --------------------------- */

const PLAN = {
  pillars: [
    {
      id: "geld", title: "1 · Geld & Baulia UG",
      goal: "6.600 € netto fest. Nebenbei nur Deals, die Plus machen.",
      quarters: [
        ["Q1", ["KI-Job startet (Feb): reinkommen, liefern, Provision verstehen",
                "6.600 € netto laufen stabil, fester Monatsbetrag aufs Kapitalkonto",
                "Security: Bruder & Onkel arbeiten, fester Anteil geht in den Kapital-Stack",
                "Baulia UG mit Bruder sauber aufgesetzt (Konto, Aufgabenteilung, Regeln)"]],
        ["Q2", ["Ersten Immo-Deal mit Sweat Equity abschließen (Vermittlung / Tippgeber / Grundstück)",
                "Deal-Checkliste: Wie viel Plus? Was ist das Worst Case?"]],
        ["Q3", ["Zweiter Deal",
                "Ablauf dokumentieren: Woher kommen Deals, was hat Geld gebracht?"]],
        ["Q4", ["Jahresbilanz: Kapital-Stack, Gewinne, was reinvestiert wurde",
                "Entscheidung: Baulia AI 2028 starten, ja oder nein?"]],
      ],
    },
    {
      id: "redner", title: "2 · Redner: Islam, Rhetorik, Verkauf",
      goal: "Ein Skill, viele Bühnen: Jede Schulung, jedes Verkaufsgespräch und jedes Gespräch über den Islam ist Training.",
      quarters: [
        ["Q1", ["Täglich nach Fajr 25 Min. Islam-Wissen mit Notizen",
                "Jede Woche 1 Schulung oder Rede mit dem Handy aufnehmen und anschauen"]],
        ["Q2", ["Rhetorik-Grundlagen: Stimme, Pausen, Storytelling (1 Buch oder Kurs)",
                "Erste kleine Gesprächsrunde über den Islam"]],
        ["Q3", ["Erster eigener Vortrag vor Publikum",
                "Verkauf: eigenes Gesprächsskript für Schulungen und Immo-Deals"]],
        ["Q4", ["1 Vortrag pro Monat",
                "Schulungen laufen sicher, ruhig und charismatisch"]],
      ],
    },
    {
      id: "koerper", title: "3 · Körper & Ausstrahlung",
      goal: "90 kg / ca. 22 % → ca. 80 kg / ca. 12 %. Obere Brust, runde Schultern, breiter Lat, Arme, Sixpack. Beine nur gesund halten.",
      quarters: [
        ["Q1", ["4er-Split steht: Di, Do, Sa, So (Trainingsplan unten)",
                "ca. 2.300 kcal, 160–180 g Protein, 8.000–10.000 Schritte pro Tag",
                "Startfoto, Gewicht und Bauchumfang festhalten, dann alle 2 Wochen messen",
                "Ende März: ca. 84 kg"]],
        ["Q2", ["ca. 80 kg bei ca. 12 %, Sixpack sichtbar",
                "Hautpflege, Haare/Bart, Haltung und Style als feste Routine"]],
        ["Q3", ["Rekomposition: Kalorien auf Erhaltung, Schultern, obere Brust und Lat weiter aufbauen"]],
        ["Q4", ["10–12 % halten, Adern und Härte sichtbar, Energie und Blutwerte gut"]],
      ],
    },
  ],
  goals: [
    { name: "Körper: 4× Training (Ästhetik-Split)", hours: 5, step: "Di nach der Arbeit: Tag A, obere Brust & Schultern",
      why: "Präsenz, Energie, Ausstrahlung" },
    { name: "Redner: Islam-Wissen + 1 Aufnahme/Woche", hours: 3, step: "Nach Fajr 25 Min. lesen; So-Abend in Köln Gespräche führen",
      why: "Islam-Vorträge, Charisma, Verkauf" },
    { name: "Baulia: erster Immo-Deal", hours: 2, step: "10 mögliche Deal-Quellen aufschreiben",
      why: "Plus machen, reinvestieren" },
  ],
  later: [
    { name: "Baulia AI (KI-Produkt)", hours: 4, step: "Q4 prüfen; bis dahin wächst das Wissen im KI-Job", why: "" },
    { name: "Zweites Startup", hours: 5, step: "Frühestens 2028", why: "" },
  ],
  rules: [
    "<strong>Kein Deal ins Minus.</strong> Aus 50 Cent 1 € machen: nur Plus, dann reinvestieren.",
    "<strong>Keine Schulden für Deals.</strong> Investiert wird nur aus dem Kapital-Stack.",
    "<strong>Nur für mich und die Familie arbeiten.</strong> Wer mich einmal verarscht hat, bekommt keine zweite Chance (YouTube-Angebot: abgelehnt).",
    "<strong>Ein Fokus pro Halbjahr.</strong> 2027 heißt das: Immobilien, nicht Baulia AI.",
    "<strong>Neue Idee? Ab auf die Später-Liste.</strong> Nicht sofort anfangen.",
    "<strong>Schlaf wird nicht gekürzt.</strong>",
  ],
  routine: [
    ["Nach Fajr", "25 Min. Islam-Wissen (bis 15.12.: Lese-Sprint)"],
    ["Mo–Fr", "KI-Job / Standortleiter, 40 h. Schulungen = Rhetorik-Praxis, 1× pro Woche aufnehmen"],
    ["Täglich", "ca. 1 h Elektrojob, flexibel, z. B. Pause oder Abend"],
    ["Täglich", "8.000–10.000 Schritte (Telefonate im Gehen)"],
    ["Di / Do", "Gym nach der Arbeit (Tag A / B)"],
    ["Samstag", "Ausschlafen → Gym (Tag C) → 2 h Baulia: Deals, Anrufe, Besichtigungen"],
    ["Sonntag", "Ausschlafen → Gym (Tag D) → 15 Min. Wochen-Check → 12–18 Uhr Eltern"],
    ["So-Abend", "Köln: Leute treffen = Gespräche über den Islam, Netzwerk, Deals"],
    ["Jeden Abend", "Handy weg, Schlaf mindestens 7,5 h"],
  ],
};

const MIN_WEEKS_FOR_QUOTE = 2;   // ab so vielen Wochen-Checks zählt die echte Quote
const QUOTE_WINDOW = 4;          // die letzten N Wochen werden berücksichtigt

/* ---------------------------- State ---------------------------- */

function defaultState() {
  const time = {};
  TIME_FIELDS.forEach(f => { time[f.key] = f.def; });
  return { time, timeVersion: TIME_VERSION, quoteDefault: 60, maxActive: 3, goals: [], checks: {},
    milestones: {}, sprint: JSON.parse(JSON.stringify(SPRINT_DEFAULT)) };
}

function mergeState(data) {
  const base = defaultState();
  const merged = Object.assign(base, data);
  // Alte Zeitwerte verwerfen, wenn sich die Standardwerte geändert haben
  const oldTime = data && (data.timeVersion || 1) >= TIME_VERSION ? data.time : {};
  merged.time = Object.assign(defaultState().time, oldTime);
  merged.timeVersion = TIME_VERSION;
  merged.milestones = Object.assign({}, data && data.milestones);
  if (!merged.sprint || !Array.isArray(merged.sprint.books)) merged.sprint = defaultState().sprint;
  return merged;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorieren */ }
}

let state = loadState();
let weekOffset = 0;

/* --------------------------- Helfer ---------------------------- */

const $ = sel => document.querySelector(sel);
const round1 = n => Math.round(n * 10) / 10;
const fmtH = n => `${round1(n).toLocaleString("de-DE")} h`;
const uid = () => Math.random().toString(36).slice(2, 10);

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ISO-Kalenderwoche, z. B. "2026-W48"
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function weekKey(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset * 7);
  return isoWeek(d);
}

const weekLabel = key => {
  const [y, w] = key.split("-W");
  return `KW ${Number(w)} / ${y}`;
};

/* -------------------------- Rechnen ---------------------------- */

function weeklyHours(field) {
  const v = Number(state.time[field.key]) || 0;
  return field.unit === "day" ? v * 7 : v;
}

function freeHours() {
  return 168 - TIME_FIELDS.reduce((s, f) => s + weeklyHours(f), 0);
}

function checkedWeeks() {
  return Object.keys(state.checks)
    .sort()
    .map(k => ({ key: k, ...weekTotals(k) }))
    .filter(w => w.planned > 0 && w.saved);
}

function weekTotals(key) {
  const c = state.checks[key];
  if (!c) return { planned: 0, actual: 0, saved: false };
  const planned = c.planned.reduce((s, g) => s + g.hours, 0);
  const actual = c.planned.reduce((s, g) => s + (Number(c.actual[g.id]) || 0), 0);
  return { planned, actual, saved: true };
}

// Umsetzungsquote: aus echten Daten, sonst Startwert.
function quote() {
  const weeks = checkedWeeks().slice(-QUOTE_WINDOW);
  if (weeks.length < MIN_WEEKS_FOR_QUOTE) {
    return { value: Number(state.quoteDefault) || 60, fromData: false, weeks: weeks.length };
  }
  const p = weeks.reduce((s, w) => s + w.planned, 0);
  const a = weeks.reduce((s, w) => s + w.actual, 0);
  const v = Math.max(10, Math.min(100, Math.round((a / p) * 100)));
  return { value: v, fromData: true, weeks: weeks.length };
}

function realisticHours() {
  return Math.max(0, Math.floor(freeHours() * quote().value / 100 * 2) / 2);
}

const activeGoals = () => state.goals.filter(g => g.status === "active");
const plannedHours = () => activeGoals().reduce((s, g) => s + g.hours, 0);

// Prüft, ob ein Ziel mit `hours` noch reinpasst. Liefert {ok, reason, room}.
function fits(hours, ignoreId) {
  const active = activeGoals().filter(g => g.id !== ignoreId);
  const room = realisticHours() - active.reduce((s, g) => s + g.hours, 0);
  if (active.length >= state.maxActive) return { ok: false, reason: "count", room };
  if (hours > room) return { ok: false, reason: "time", room };
  return { ok: true, room };
}

/* --------------------------- Render ---------------------------- */

function render() {
  renderSprint();
  renderOverview();
  renderPlan();
  renderTime();
  renderGoals();
  renderCheck();
  renderHistory();
}

function renderOverview() {
  const free = freeHours();
  const real = realisticHours();
  const used = plannedHours();
  const q = quote();

  $("#ov-realistic").textContent = fmtH(real);
  $("#ov-free").textContent = fmtH(Math.max(0, free));
  $("#ov-quote").textContent = `${q.value} %`;
  $("#ov-active").textContent = `${activeGoals().length} / ${state.maxActive}`;

  const pct = real > 0 ? (used / real) * 100 : (used > 0 ? 100 : 0);
  const fill = $("#ov-bar");
  fill.style.width = `${Math.min(100, pct)}%`;
  fill.className = "fill" + (pct > 100 ? " bad" : pct > 85 ? " warn" : "");
  $("#ov-bar-label").textContent = `${fmtH(used)} von ${fmtH(real)} verplant`;

  let cls, html;
  if (free <= 0) {
    cls = "bad";
    html = `<p><strong>Deine Woche ist schon ohne Ziele voll.</strong></p>
      <p>Du hast mehr Pflicht-Stunden eingetragen, als eine Woche hat (168). Bevor du dir etwas Neues vornimmst, muss irgendwo Platz entstehen.</p>`;
  } else if (used > real) {
    cls = "bad";
    html = `<p><strong>Du hast ${fmtH(used - real)} zu viel geplant.</strong></p>
      <p>Genau das ist das Muster, das dich frustriert. Park ein Ziel auf der Später-Liste. Es ist nicht weg, nur nicht jetzt.</p>`;
  } else if (activeGoals().length === 0) {
    cls = "ok";
    html = `<p><strong>Fang mit einem Ziel an.</strong> Eins reicht. Wirklich.</p>
      <p>Lieber ein Ziel, das du durchziehst, als fünf, die dir ein schlechtes Gewissen machen.</p>`;
  } else if (pct > 85) {
    cls = "warn";
    html = `<p><strong>Knapp, aber machbar.</strong></p>
      <p>Lass die restliche Zeit frei. Das Leben passiert sowieso dazwischen.</p>`;
  } else {
    cls = "ok";
    html = `<p><strong>Das passt.</strong> Dein Plan ist realistisch.</p>
      <p>Wenn du mehr schaffst, ist das ein Bonus und keine Pflicht.</p>`;
  }
  if (!q.fromData) {
    html += `<p class="label">Die Quote ist noch geschätzt (${q.value} %). Nach ${MIN_WEEKS_FOR_QUOTE} Wochen-Checks rechnet die App mit deinen echten Werten.</p>`;
  }
  $("#ov-message").innerHTML = `<div class="msg ${cls}" style="margin:0">${html}</div>`;

  const steps = activeGoals().filter(g => g.step);
  $("#ov-steps").innerHTML = steps.length
    ? steps.map(g => `<li><strong>${esc(g.name)}:</strong> ${esc(g.step)}</li>`).join("")
    : `<li class="empty">Noch keine Schritte. Gib bei jedem Ziel einen winzigen nächsten Schritt an.</li>`;
}

function renderSprint() {
  const sp = state.sprint;
  const dl = new Date(sp.deadline + "T23:59:59");
  $("#sprint-deadline").textContent = dl.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
  const box = $("#sprint-books");
  if (!box.dataset.built) {
    box.innerHTML = sp.books.map((_, i) => `
      <div class="book">
        <label>Titel<input type="text" data-book="${i}" data-f="title"></label>
        <label>Seiten<input type="number" min="1" data-book="${i}" data-f="pages"></label>
        <label>gelesen<input type="number" min="0" data-book="${i}" data-f="read"></label>
        <div class="bar"><div class="fill" data-bar="${i}"></div></div>
      </div>`).join("");
    box.dataset.built = "1";
    box.addEventListener("input", e => {
      const i = e.target.dataset.book, f = e.target.dataset.f;
      if (i === undefined) return;
      const b = state.sprint.books[i];
      b[f] = f === "title" ? e.target.value : Math.max(0, Number(e.target.value) || 0);
      saveState();
      renderSprint();
    });
  }
  box.querySelectorAll("input[data-book]").forEach(inp => {
    if (document.activeElement !== inp) inp.value = sp.books[inp.dataset.book][inp.dataset.f];
  });
  sp.books.forEach((b, i) => {
    const pct = b.pages ? Math.min(100, (b.read / b.pages) * 100) : 0;
    box.querySelector(`[data-bar="${i}"]`).style.width = `${pct}%`;
  });

  const total = sp.books.reduce((s, b) => s + (Number(b.pages) || 0), 0);
  const read = sp.books.reduce((s, b) => s + Math.min(Number(b.read) || 0, Number(b.pages) || 0), 0);
  const left = Math.max(0, total - read);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysLeft = Math.max(0, Math.round((new Date(sp.deadline + "T00:00:00") - today) / 86400000) + 1);
  let cls, html;
  if (left === 0) {
    cls = "ok"; html = `<p><strong>Beide Bücher durch.</strong> Stark. Jetzt neu strukturieren.</p>`;
  } else if (daysLeft === 0) {
    cls = "bad"; html = `<p><strong>Deadline vorbei.</strong> Noch ${left} Seiten offen. Kein Drama: Setz dir ein neues, ehrliches Datum.</p>`;
  } else {
    const perDay = Math.ceil(left / daysLeft);
    const min = Math.ceil(perDay * 1.5); // ca. 1,5 Min. pro Seite
    cls = min > 60 ? "warn" : "ok";
    html = `<p><strong>${perDay} Seiten pro Tag</strong> (ca. ${min} Min.), noch ${daysLeft} Tage, ${left} Seiten offen.</p>
      <p class="label">Tipp: 25 Min. nach Fajr und 20 Min. abends. Bis zum 15.12. pausiert dafür Baulia.${min > 60 ? " Das ist viel: Nimm für eins der Bücher das Hörbuch beim Fahren." : ""}</p>`;
  }
  $("#sprint-status").innerHTML = `<div class="msg ${cls}">${html}</div>`;
}

function renderPlan() {
  const jobs = weeklyHours(TIME_FIELDS.find(f => f.key === "job1")) + weeklyHours(TIME_FIELDS.find(f => f.key === "job2"));
  const free = Math.max(0, freeHours());
  const planH = PLAN.goals.reduce((s, g) => s + g.hours, 0);
  const real = realisticHours();
  const fitsPlan = planH <= real;
  $("#plan-time").innerHTML = `<div class="msg ${fitsPlan ? "ok" : "warn"}" style="margin:0">
    <p><strong>Ehrliche Rechnung:</strong> ${fmtH(jobs)} Jobs pro Woche. Danach bleiben ${fmtH(free)} frei, realistisch nutzbar sind <strong>${fmtH(real)}</strong>.</p>
    <p>Der Plan braucht ${fmtH(planH)} pro Woche für die drei Säulen. ${fitsPlan
      ? "Das passt. Alles, was du mehr schaffst, ist Bonus."
      : "Das passt gerade nicht. Prüf die Job-Stunden unter „Meine Woche“, oder Baulia läuft erst mal auf Sparflamme."}</p>
    <p class="label">Ändert sich etwas an deiner Woche, trag es unter „Meine Woche“ ein. Dann rechnet alles neu.</p></div>`;

  $("#plan-pillars").innerHTML = PLAN.pillars.map(p => {
    const all = p.quarters.flatMap(([q, items]) => items.map((_, i) => `${p.id}-${q}-${i}`));
    const done = all.filter(id => state.milestones[id]).length;
    return `<div class="card pillar"><h2>${esc(p.title)} <span class="progress">${done}/${all.length}</span></h2>
      <p class="hint" style="margin-bottom:4px">${esc(p.goal)}</p>
      ${p.quarters.map(([q, items]) => `<div class="quarter"><h3>${q} 2027</h3>
        ${items.map((t, i) => {
          const id = `${p.id}-${q}-${i}`;
          const d = !!state.milestones[id];
          return `<label class="check${d ? " done" : ""}"><input type="checkbox" data-ms="${id}"${d ? " checked" : ""}><span>${esc(t)}</span></label>`;
        }).join("")}</div>`).join("")}
    </div>`;
  }).join("");

  $("#plan-training").innerHTML = TRAINING.days.map(d => `<div class="train-day">
    <h3>${esc(d.name)}</h3><div class="when">${esc(d.day)}</div>
    <table>${d.ex.map(([n, r]) => `<tr><td>${esc(n)}</td><td>${esc(r)}</td></tr>`).join("")}</table></div>`).join("");
  $("#plan-nutrition").innerHTML = TRAINING.nutrition.map(n => `<li>${n}</li>`).join("");
  $("#plan-rules").innerHTML = PLAN.rules.map(r => `<li>${r}</li>`).join("");
  $("#plan-routine").innerHTML = PLAN.routine.map(([t, w]) => `<tr><td>${esc(t)}</td><td>${esc(w)}</td></tr>`).join("");
  $("#plan-parked").innerHTML = PLAN.later.map(g => `<li><strong>${esc(g.name)}:</strong> ${esc(g.step)}</li>`).join("") +
    `<li><strong>Weitere Security-Arbeit für mich selbst:</strong> Die machen Bruder und Onkel. Ich koordiniere nur.</li>`;
}

function applyPlan() {
  const names = new Set(state.goals.map(g => g.name));
  const added = [], parked = [];
  PLAN.goals.forEach(t => {
    if (names.has(t.name)) return;
    const g = { id: uid(), ...t, created: new Date().toISOString() };
    const f = fits(g.hours, g.id);
    g.status = f.ok ? "active" : "later";
    state.goals.push(g);
    (f.ok ? added : parked).push(g.name);
  });
  PLAN.later.forEach(t => {
    if (names.has(t.name)) return;
    state.goals.push({ id: uid(), ...t, status: "later", created: new Date().toISOString() });
  });
  saveState();
  let html = added.length || parked.length
    ? `<p><strong>Übernommen.</strong> ${added.length} Ziel(e) aktiv${parked.length ? `, ${parked.length} passen gerade nicht rein und liegen auf der Später-Liste: ${parked.map(esc).join(", ")}` : ""}.</p>`
    : `<p>Der Plan ist schon in deinen Zielen.</p>`;
  $("#plan-feedback").innerHTML = `<div class="msg ${parked.length ? "warn" : "ok"}">${html}</div>`;
  render();
}

$("#plan-apply").addEventListener("click", applyPlan);

$("#plan").addEventListener("change", e => {
  const id = e.target.dataset.ms;
  if (!id) return;
  if (e.target.checked) state.milestones[id] = true; else delete state.milestones[id];
  saveState();
  renderPlan();
});

function renderTime() {
  const box = $("#time-fields");
  if (!box.dataset.built) {
    box.innerHTML = TIME_FIELDS.map(f => `
      <label class="field inline">
        <span>${esc(f.label)}<small>${f.unit === "day" ? "Stunden pro Tag" : "Stunden pro Woche"}${f.note ? " · " + esc(f.note) : ""}</small></span>
        <input type="number" min="0" step="0.5" data-time="${f.key}">
      </label>`).join("");
    box.dataset.built = "1";
    box.addEventListener("input", e => {
      const k = e.target.dataset.time;
      if (!k) return;
      state.time[k] = Math.max(0, Number(e.target.value) || 0);
      saveState();
      renderOverview();
      updateFree();
    });
  }
  box.querySelectorAll("input[data-time]").forEach(inp => {
    if (document.activeElement !== inp) inp.value = state.time[inp.dataset.time];
  });
  updateFree();
  if (document.activeElement !== $("#quote-default")) $("#quote-default").value = state.quoteDefault;
  if (document.activeElement !== $("#max-active")) $("#max-active").value = state.maxActive;
}

function updateFree() {
  const free = freeHours();
  $("#time-free").textContent = free >= 0 ? `${fmtH(free)} / Woche` : `${fmtH(free)} – das geht sich nicht aus`;
}

function goalItem(g) {
  const meta = [`${fmtH(g.hours)} / Woche`];
  if (g.step) meta.push(`Nächster Schritt: ${esc(g.step)}`);
  if (g.why) meta.push(`Warum: ${esc(g.why)}`);
  let actions = "";
  if (g.status === "active") {
    actions = `<button class="small" data-act="done" data-id="${g.id}">Geschafft</button>
      <button class="small ghost" data-act="park" data-id="${g.id}">Parken</button>`;
  } else if (g.status === "later") {
    actions = `<button class="small" data-act="activate" data-id="${g.id}">Aktivieren</button>`;
  }
  actions += `<button class="small danger" data-act="delete" data-id="${g.id}">✕</button>`;
  return `<li><div class="info"><div class="title">${esc(g.name)}</div>
    <div class="meta">${meta.join(" · ")}</div></div><div class="actions">${actions}</div></li>`;
}

function renderGoals() {
  const lists = { active: "#active-list", later: "#later-list", done: "#done-list" };
  const empty = {
    active: "Noch nichts aktiv.",
    later: "Leer. Das muss nicht so bleiben.",
    done: "Kommt noch.",
  };
  Object.entries(lists).forEach(([status, sel]) => {
    const items = state.goals.filter(g => g.status === status);
    $(sel).innerHTML = items.length ? items.map(goalItem).join("") : `<li class="empty">${empty[status]}</li>`;
  });
  $("#active-count").textContent = `${activeGoals().length} / ${state.maxActive} · ${fmtH(plannedHours())} von ${fmtH(realisticHours())}`;
}

function renderCheck() {
  const key = weekKey(weekOffset);
  $("#check-week").textContent = weekLabel(key) + (weekOffset === 0 ? " (diese Woche)" : "");
  $("#week-next").disabled = weekOffset >= 0;

  const existing = state.checks[key];
  const goals = existing
    ? existing.planned
    : activeGoals().map(g => ({ id: g.id, name: g.name, hours: g.hours }));

  if (!goals.length) {
    $("#check-form").innerHTML = `<p class="hint">Für diese Woche gibt es keine aktiven Ziele.</p>`;
    $("#check-result").innerHTML = "";
    return;
  }
  $("#check-form").innerHTML = goals.map(g => `
    <label class="field inline">
      <span>${esc(g.name)}<small>geplant: ${fmtH(g.hours)}</small></span>
      <input type="number" min="0" step="0.5" name="${g.id}" value="${existing ? (existing.actual[g.id] ?? 0) : ""}" placeholder="0">
    </label>`).join("") +
    `<button type="submit" class="primary" style="margin-top:14px">${existing ? "Aktualisieren" : "Woche speichern"}</button>`;

  $("#check-result").innerHTML = existing ? weekFeedback(key) : "";
}

function weekFeedback(key) {
  const t = weekTotals(key);
  if (!t.planned) return "";
  const p = Math.round((t.actual / t.planned) * 100);
  let cls, text;
  if (p >= 100) {
    cls = "ok";
    text = `Stark: ${p} %. Wenn das öfter klappt, kannst du dir ein Ziel von der Später-Liste holen.`;
  } else if (p >= 70) {
    cls = "ok";
    text = `${p} %. Das ist eine richtig gute Woche. Mehr musst du nicht.`;
  } else if (p >= 40) {
    cls = "warn";
    text = `${p} %. Kein Drama. Die App rechnet das ein und plant beim nächsten Mal weniger für dich.`;
  } else {
    cls = "bad";
    text = `${p} %. Das liegt nicht an dir, sondern am Plan. Halbier nächste Woche die Stunden oder park ein Ziel.`;
  }
  return `<div class="msg ${cls}"><p>${text}</p></div>`;
}

function renderHistory() {
  const weeks = checkedWeeks().reverse();
  $("#history-body").innerHTML = weeks.length
    ? weeks.map(w => `<tr><td>${weekLabel(w.key)}</td><td>${fmtH(w.planned)}</td>
        <td>${fmtH(w.actual)}</td><td>${Math.round((w.actual / w.planned) * 100)} %</td></tr>`).join("")
    : `<tr><td colspan="4" class="label">Noch keine Wochen-Checks.</td></tr>`;
}

/* --------------------------- Aktionen -------------------------- */

function feedback(html, cls) {
  $("#goal-feedback").innerHTML = `<div class="msg ${cls}">${html}</div>`;
}

function tryActivate(goal, isNew) {
  const f = fits(goal.hours, goal.id);
  if (f.ok) {
    goal.status = "active";
    if (isNew) state.goals.push(goal);
    saveState();
    feedback(`<p><strong>„${esc(goal.name)}“ ist aktiv.</strong> Passt in deine Woche.</p>`, "ok");
    return true;
  }

  // Passt nicht: auf die Später-Liste und Optionen anbieten
  goal.status = "later";
  if (isNew) state.goals.push(goal);
  saveState();

  let html;
  if (f.reason === "count") {
    html = `<p><strong>Du hast schon ${state.maxActive} aktive Ziele.</strong> „${esc(goal.name)}“ liegt jetzt auf der Später-Liste.</p>
      <p>Mehr Ziele gleichzeitig heißt nicht, dass du mehr schaffst. Meistens schaffst du dann gar keins richtig. Schließ erst eins ab oder park eins.</p>`;
  } else {
    const room = Math.max(0, Math.floor(f.room * 2) / 2);
    html = `<p><strong>Passt gerade nicht rein.</strong> Du bräuchtest ${fmtH(goal.hours)}, realistisch frei sind noch ${fmtH(room)}.</p>
      <p>„${esc(goal.name)}“ liegt jetzt auf der Später-Liste.</p>`;
    if (room >= 0.5) {
      html += `<div class="row"><button class="small" data-shrink="${goal.id}" data-hours="${room}">Mit ${fmtH(room)} starten</button></div>`;
    }
  }
  feedback(html, f.reason === "count" ? "bad" : "warn");
  return false;
}

$("#goal-form").addEventListener("submit", e => {
  e.preventDefault();
  const goal = {
    id: uid(),
    name: $("#g-name").value.trim(),
    hours: Math.max(0.5, Number($("#g-hours").value) || 0.5),
    step: $("#g-step").value.trim(),
    why: $("#g-why").value.trim(),
    created: new Date().toISOString(),
  };
  if (!goal.name) return;
  tryActivate(goal, true);
  e.target.reset();
  $("#g-hours").value = 2;
  render();
});

$("#goal-feedback").addEventListener("click", e => {
  const id = e.target.dataset.shrink;
  if (!id) return;
  const g = state.goals.find(x => x.id === id);
  if (!g) return;
  g.hours = Number(e.target.dataset.hours);
  tryActivate(g, false);
  render();
});

document.querySelector("#ziele").addEventListener("click", e => {
  const { act, id } = e.target.dataset;
  if (!act) return;
  const g = state.goals.find(x => x.id === id);
  if (!g) return;
  if (act === "done") g.status = "done";
  if (act === "park") g.status = "later";
  if (act === "activate") tryActivate(g, false);
  if (act === "delete") {
    if (!confirm(`„${g.name}“ wirklich löschen?`)) return;
    state.goals = state.goals.filter(x => x.id !== id);
  }
  saveState();
  render();
});

$("#quote-default").addEventListener("input", e => {
  state.quoteDefault = Math.max(10, Math.min(100, Number(e.target.value) || 60));
  saveState();
  renderOverview();
  renderGoals();
});

$("#max-active").addEventListener("input", e => {
  state.maxActive = Math.max(1, Math.min(10, Math.round(Number(e.target.value) || 3)));
  saveState();
  renderOverview();
  renderGoals();
});

$("#check-form").addEventListener("submit", e => {
  e.preventDefault();
  const key = weekKey(weekOffset);
  const existing = state.checks[key];
  const planned = existing
    ? existing.planned
    : activeGoals().map(g => ({ id: g.id, name: g.name, hours: g.hours }));
  const actual = {};
  planned.forEach(g => {
    const inp = e.target.elements[g.id];
    actual[g.id] = Math.max(0, Number(inp && inp.value) || 0);
  });
  state.checks[key] = { planned, actual };
  saveState();
  render();
});

$("#week-prev").addEventListener("click", () => { weekOffset--; renderCheck(); });
$("#week-next").addEventListener("click", () => { if (weekOffset < 0) weekOffset++; renderCheck(); });

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === btn.dataset.tab));
    render();
  });
});

$("#export").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `leben-realistisch-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

$("#import").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || !Array.isArray(data.goals)) throw new Error("Format");
    state = mergeState(data);
    saveState();
    render();
    alert("Import erfolgreich.");
  } catch (err) {
    alert("Die Datei konnte nicht gelesen werden.");
  }
  e.target.value = "";
});

$("#reset").addEventListener("click", () => {
  if (!confirm("Wirklich alles löschen? Das kann nicht rückgängig gemacht werden.")) return;
  state = defaultState();
  saveState();
  render();
});

render();
