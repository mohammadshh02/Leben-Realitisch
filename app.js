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
  { key: "gym",      label: "Gym (Fundament)",                        unit: "week", def: 6.5,
    note: "5× Krafttraining inkl. Weg. Cardio danach zählt als Lernzeit (Hörbuch)" },
  { key: "islam",    label: "Islam-Wissen nach Fajr (Fundament)",     unit: "week", def: 3,
    note: "ca. 25 Min. täglich" },
  { key: "chores",   label: "Essen, Haushalt, Körperpflege",          unit: "day",  def: 2 },
  { key: "fixed",    label: "Feste Termine",                          unit: "week", def: 9,
    note: "inkl. Sonntag 12–18 Uhr bei den Eltern" },
  { key: "rest",     label: "Erholung, Freunde, Handy",               unit: "day",  def: 2,
    note: "inkl. Sonntagabend in Köln. Kein Luxus." },
];
const TIME_VERSION = 3; // bei Änderung der Standardwerte hochzählen

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
    { day: "Mo (nach der Arbeit)", name: "1 · Obere Brust, Schultern, Trizeps", ex: [
      ["Schrägbank-Maschine (progressiv)", "4 × 6–10"],
      ["Weighted Dips (progressiv)", "3 × 6–8"],
      ["Kabel-Fliegende von unten nach oben (obere Brust)", "3 × 12–15"],
      ["Seitheben am Kabel", "4 × 12–15"],
      ["Trizeps über Kopf am Kabel", "3 × 10–12"],
      ["Cardio: Laufband 10 %, 4,5–5 km/h, Puls 125–145, mit Hörbuch", "30–35 Min."],
    ]},
    { day: "Di (nach der Arbeit)", name: "2 · Rücken, Bizeps", ex: [
      ["Weighted Chin-Ups (progressiv)", "4 × 5–8"],
      ["Rudern brustgestützt", "3 × 8–10"],
      ["Pullover am Kabel (Lat)", "3 × 12"],
      ["Reverse Fly (hintere Schulter)", "3 × 15"],
      ["Preacher Curl", "3 × 10"],
      ["Hammer Curls", "2 × 12"],
      ["Cardio wie Tag 1", "30–35 Min."],
    ]},
    { day: "Do (nach der Arbeit)", name: "3 · Schultern, Arme, Bauch", ex: [
      ["Schulterpresse", "3 × 8–10"],
      ["Seitheben (letzter Satz bis Versagen)", "4 × 12–15"],
      ["Supersatz Bizeps-Maschine + Pushdowns", "3 × 10–12"],
      ["Dip-Maschine", "2 × 10"],
      ["Hängendes Beinheben", "3 × 10–15"],
      ["Cable Crunch", "3 × 12"],
      ["Cardio wie Tag 1", "30–35 Min."],
    ]},
    { day: "Sa (nach dem Ausschlafen)", name: "4 · Brust & Rücken", ex: [
      ["Schrägbank Kurzhantel 30°", "3 × 8–10"],
      ["Butterfly (Brust-Mitte, voll zusammendrücken)", "3 × 12–15"],
      ["Latzug eng", "3 × 10"],
      ["Kabelrudern", "3 × 10–12"],
      ["Seitheben", "3 × 15"],
      ["Cardio wie Tag 1", "30–35 Min."],
    ]},
    { day: "So (vor 12 Uhr)", name: "5 · Beine leicht, Arm-Pump, Bauch", ex: [
      ["Beinpresse eng (nicht bis Versagen)", "3 × 12–15"],
      ["Beinbeuger", "2 × 15"],
      ["Supersatz Curls + Pushdowns", "3 × 15"],
      ["Seitheben", "3 × 15"],
      ["Bauch nach Wahl", "3 Sätze"],
      ["Cardio wie Tag 1", "30 Min."],
    ]},
    { day: "Mi / Fr", name: "Ruhetag", ex: [
      ["Spazieren, gern beim Telefonieren", "ca. 45 Min."],
      ["8.000–10.000 Schritte", "täglich"],
    ]},
  ],
  nutrition: [
    "<strong>Start:</strong> 1,80 m · 91 kg · ca. 23 % Körperfett, also ca. 70 kg fettfreie Masse",
    "<strong>Ende Dezember:</strong> ca. 86–87 kg. Mehr wäre vor allem Wasser und Muskelverlust",
    "<strong>Ziel:</strong> ca. 79–80 kg bei ca. 12 % (Sixpack sichtbar), machbar bis März 2027",
    "<strong>Tempo:</strong> 0,7–0,9 kg pro Woche. Wenn 2 Wochen lang nichts runtergeht, 150 kcal weniger",
    "<strong>Kalorien:</strong> ca. 2.100–2.300 kcal pro Tag",
    "<strong>Protein:</strong> 170–190 g pro Tag. Im Defizit ist das der Muskelschutz Nr. 1",
    "<strong>Steigerung:</strong> Wenn du in allen Sätzen das obere Ende der Wiederholungen schaffst, nächstes Mal +2,5 kg. Bei Grundübungen 1–2 Wiederholungen im Tank lassen",
    "<strong>Effizienz:</strong> Cardio direkt nach dem Training (kein Extra-Weg) und als Lernzeit mit Hörbuch zu Bau/Immo oder Chase Hughes",
    "<strong>Ehrlich:</strong> Gezielt an Beinen, Po oder Unterbauch abnehmen geht nicht. Das Fett dort geht als Letztes, aber es geht, wenn das Gesamt-Körperfett sinkt",
  ],
};

/* ------------------- Gesundheit: Hyperfokus -------------------- */
// Vollständige Liste: docs/gesundheit-masterliste.md. Hier nur das, was täglich zählt.

const HEALTH = {
  daily: [
    ["morning", "Morgens: Glas Wasser mit Zitrone und Prise Salz, 10 Min. Tageslicht"],
    ["supps",   "Basis-Supplements: D3 + K2, Kreatin 5 g, Vitamin C, Omega-3 (an Tagen ohne Fisch)"],
    ["seed",    "1 TL Schwarzkümmelöl mit etwas Honig zum Frühstück"],
    ["protein", "Protein 170–190 g erreicht (getrackt)"],
    ["kcal",    "Kalorien im Ziel: 2.100–2.300 kcal"],
    ["water",   "2,5–3 l Wasser (gern Nelken- oder Ingwerwasser)"],
    ["gut",     "Darm: 1 TL Flohsamen in viel Wasser + Kefir oder Joghurt"],
    ["walk",    "10 Min. gehen nach der größten Mahlzeit"],
    ["coffee",  "Kein Koffein nach 14 Uhr"],
    ["night",   "Abends: Magnesiumglycinat + Kamille/Melisse, Handy 30 Min. vorher weg, Licht aus 22:00–22:30"],
  ],
  weekly: [
    "<strong>2× Fisch</strong> (Lachs, Sardinen, Makrele) und <strong>1× Rinderleber</strong>, nicht öfter",
    "<strong>Rosmarinöl</strong> 2–3× einmassieren, <strong>Kopfhautmassage</strong> 5 Min. täglich",
    "<strong>Fasten Mo/Do:</strong> im Winter nach dem Iftar trainieren. Im Sommer Montags-Training auf Dienstag/Mittwoch schieben",
    "<strong>Draußen essen:</strong> gegrillt statt frittiert, doppelt Salat, Wasser oder Ayran. Danach 10 Min. gehen",
    "<strong>Jeden Monat:</strong> Foto vom Haaransatz im gleichen Licht",
    "<strong>Sonntag beim Wochen-Check:</strong> Gewicht (Wochenschnitt) und Einkaufsliste",
  ],
  // Tage seit Start → Phase
  phases: [
    { from: 0,  label: "Woche 1–2",  add: "Blutbild, Kalorien-Tracking, Tee-Vorrat, Rituale, Einkauf", check: "Ausgangswerte kennen" },
    { m: 1,  label: "Monat 1",    add: "Basis: D3 + K2, Magnesium, Kreatin, Vitamin C, Omega-3, OPC", check: "Schlaf und Energie" },
    { m: 2,  label: "Monat 2",    add: "Tongkat Ali (5 an / 2 aus), Schwarzkümmelöl, Redensyl + Rosmarinöl", check: "Libido, Energie, Haare" },
    { m: 3,  label: "Monat 3",    add: "Ashwagandha", check: "Stress, Schlaf" },
    { m: 4,  label: "Monat 4",    add: "Blutbild 2. Berberin nur, wenn HbA1c oder Insulin es nahelegen", check: "Werte vergleichen" },
    { m: 5,  label: "Monat 5–6",  add: "Shilajit oder Maca (bei Kinderwunsch: CoQ10 + L-Carnitin)", check: "1 neues Mittel pro Monat" },
    { m: 7,  label: "Monat 7",    add: "Tongkat Ali 4 Wochen Pause, Ashwagandha → Rhodiola oder Ginseng", check: "Keine Gewöhnung" },
    { m: 8,  label: "Monat 8–9",  add: "Tongkat Ali wieder rein, optional Cordyceps oder Lion's Mane", check: "Gehirn, Ausdauer" },
    { m: 10, label: "Monat 10–12", add: "Blutbild 3, Haar-Fotos vergleichen", check: "Behalten, was wirkt, Rest streichen" },
  ],
  rules: [
    "Max. 2–3 Extrakte gleichzeitig, nur 1 neues Mittel alle 4–8 Wochen",
    "Nur geprüfte Ware mit Laborzertifikat, keine „Proprietary Blends“",
    "Blutbild alle 3–6 Monate. Hormone und hoch dosiertes D3 ärztlich abklären",
    "Finger weg: He Shou Wu, Detox-Kuren, Yohimbe ohne Arzt, Nelkenöl trinken",
  ],
};

/* ------------------------- Plan 2027 --------------------------- */

// Namen älterer Plan-Ziele: werden beim Übernehmen des neuen Plans entfernt (Körper ist jetzt Fundament)
const OLD_PLAN_GOALS = ["Körper: 3× Training", "Körper: 4× Training (Ästhetik-Split)",
  "Redner: Islam-Wissen + 1 Aufnahme/Woche", "Baulia: erster Immo-Deal", "Zweites Startup"];

const PLAN = {
  pillars: [
    {
      id: "ai", title: "Fokus 1 · Baulia AI (Hauptfokus)",
      goal: "KI-Produkt für Bau und Immobilien in Deutschland. Hardcore vermarkten.",
      quarters: [
        ["Q1", ["Arbeitsvertrag KI-Job prüfen: Wettbewerbsverbot oder Nebentätigkeit? (Massoud macht auch KI)",
                "Produkt in einem Satz: Welches Problem, für wen, zu welchem Preis?",
                "10 Gespräche mit Bau- und Elektrobetrieben. Die Elektrofirma ist dein erster Testkunde"]],
        ["Q2", ["3 Pilotkunden nutzen Baulia AI",
                "Jede Woche 1 Post oder Kurzvideo. Vermarktung ist gleichzeitig Redner-Training"]],
        ["Q3", ["10 zahlende Kunden",
                "Angebot und Preis anhand von Kunden-Feedback schärfen"]],
        ["Q4", ["Bilanz: Kunden, monatlicher Umsatz, was hat verkauft?",
                "Plan für 2028: skalieren"]],
      ],
    },
    {
      id: "immo", title: "Fokus 2 · Bau & Immobilien Deutschland",
      goal: "Alles kennen, alle Auflagen, nur Deutschland. Wissen für Baulia AI und Deals über die Baulia UG.",
      quarters: [
        ["Q1", ["Lernblock 1: Planungsrecht (siehe Lernplan unten)",
                "Lernblock 2: Kauf, Notar, Steuern",
                "Baulia UG mit Bruder sauber aufgesetzt, Kapital-Stack aus Security läuft"]],
        ["Q2", ["Lernblock 3: Sanierung, Energie, Förderung",
                "Lernblock 4: Vermittlung & Deals (§34c klären!)",
                "Erster Deal mit Sweat Equity"]],
        ["Q3", ["Lernblock 5: Miete, WEG, Finanzierung, Rendite",
                "Zweiter Deal"]],
        ["Q4", ["Jahresbilanz Kapital-Stack und Deals",
                "Großhandel Afghanistan–Europa prüfen, aber nur, wenn Fokus 1 läuft"]],
      ],
    },
    {
      id: "rede", title: "Fokus 3 · Confidence & Rede",
      goal: "Ruhig, vertrauenswürdig, charismatisch. Bühnen: KI-Schulungen, Baulia-Pitches, Islam-Gespräche in Köln.",
      quarters: [
        ["Q1", ["Jede Woche 1 Schulung oder Rede aufnehmen und mit der Checkliste unten auswerten",
                "Chase Hughes: 1 Buch durcharbeiten, jede Woche 1 Prinzip bewusst anwenden"]],
        ["Q2", ["Stimme: Tempo, Pausen, Tiefe. Dazu Storytelling",
                "Erste kleine Gesprächsrunde über den Islam"]],
        ["Q3", ["Erster eigener Vortrag vor Publikum",
                "Verkaufs-Pitch für Baulia AI sitzt (unter 2 Minuten)"]],
        ["Q4", ["1 Vortrag pro Monat",
                "Schulungen laufen sicher, ruhig und mit Autorität"]],
      ],
    },
    {
      id: "koerper", title: "Fundament · Körper & Ausstrahlung",
      goal: "91 kg / ca. 23 % → ca. 80 kg / ca. 12 % bis März. Obere Brust, runde Schultern, breiter Lat, Arme, Sixpack. Beine nur gesund halten.",
      quarters: [
        ["Q1", ["5er-Split steht: Mo, Di, Do, Sa, So (Trainingsplan unten)",
                "ca. 2.100–2.300 kcal, 170–190 g Protein, 8.000–10.000 Schritte pro Tag",
                "Startfoto, Gewicht und Bauchumfang festhalten, dann alle 2 Wochen messen",
                "Ende Dezember ca. 86–87 kg, Ende März ca. 80 kg bei ca. 12 %"]],
        ["Q2", ["12 % halten, Sixpack sichtbar",
                "Hautpflege, Haare/Bart, Haltung und Style als feste Routine"]],
        ["Q3", ["Rekomposition: Kalorien auf Erhaltung, Schultern, obere Brust und Lat weiter aufbauen"]],
        ["Q4", ["10–12 % halten, Adern und Härte sichtbar, Energie und Blutwerte gut"]],
      ],
    },
  ],
  goals: [
    { name: "Fokus 1: Baulia AI vermarkten", hours: 3, step: "Problem, Kunde und Preis in einem Satz aufschreiben",
      why: "Hauptfokus Deutschland" },
    { name: "Fokus 2: Bau & Immo Deutschland", hours: 1, step: "Lernblock 1 als Hörbuch beim Cardio, 1 h pro Woche anwenden",
      why: "Wissen für Baulia AI und Deals" },
    { name: "Fokus 3: Confidence & Rede", hours: 2, step: "Diese Woche 1 Schulung aufnehmen und auswerten",
      why: "Charisma, Verkauf, Islam-Vorträge" },
  ],
  later: [
    { name: "Großhandel Afghanistan – Deutschland – Europa", hours: 5,
      step: "Frühestens Q4 2027 prüfen, nur wenn Baulia AI läuft. 2027 heißt es: nur Deutschland", why: "" },
  ],
  rules: [
    "<strong>Immer nur 3 Foki.</strong> Mehr schafft niemand. Alles andere kommt auf die Später-Liste.",
    "<strong>Nur Deutschland.</strong> 2027 ist der Kopf nur hier.",
    "<strong>Baulia AI ist Hauptfokus.</strong> Bei Zeitkonflikt gewinnt Baulia AI.",
    "<strong>Kein Deal ins Minus, keine Schulden.</strong> Aus 50 Cent 1 € machen, reinvestieren.",
    "<strong>Nur für mich und die Familie arbeiten.</strong> Wer mich einmal verarscht hat, bekommt keine zweite Chance.",
    "<strong>Lernen nur mit Anwendung.</strong> Kein Wissen auf Vorrat (siehe Meta-Learning).",
    "<strong>Schlaf wird nicht gekürzt.</strong>",
  ],
  routine: [
    ["Nach Fajr", "25 Min. Islam-Wissen (bis 15.12.: Lese-Sprint)"],
    ["Nach dem Aufstehen", "Zitronenwasser, Supplements, 10 Min. Tageslicht"],
    ["Pendeln & Cardio", "Karteikarten Bau/Immo oder Chase Hughes als Hörbuch"],
    ["Mo–Fr", "KI-Job 40 h. Jede Schulung ist Rede-Training, 1× pro Woche aufnehmen"],
    ["Täglich", "ca. 1 h Elektrojob, dabei Bau-Leute nach ihren Problemen fragen (Baulia AI)"],
    ["Mo / Di / Do", "Gym nach der Arbeit, danach 30 Min. Cardio mit Hörbuch"],
    ["Mi / Fr", "Ruhetag: 45 Min. spazieren, gern beim Telefonieren"],
    ["Samstag", "Ausschlafen → Gym → 3 h Fokus-Block: 2 h Baulia AI, 1 h Bau & Immo lernen"],
    ["Sonntag", "Ausschlafen → Gym → 15 Min. Wochen-Check → 12–18 Uhr Eltern"],
    ["So-Abend", "Köln: Islam-Gespräche, Netzwerk, Baulia AI pitchen"],
    ["14 Uhr", "Koffein-Stopp"],
    ["Nach dem Essen", "10 Min. gehen, Fenchel- oder Pfefferminztee"],
    ["Jeden Abend", "Magnesium + Kamille/Melisse, Handy weg, Licht aus 22:00–22:30"],
  ],
};

const MIN_WEEKS_FOR_QUOTE = 2;   // ab so vielen Wochen-Checks zählt die echte Quote
const QUOTE_WINDOW = 4;          // die letzten N Wochen werden berücksichtigt

/* ---------------------------- State ---------------------------- */

function defaultState() {
  const time = {};
  TIME_FIELDS.forEach(f => { time[f.key] = f.def; });
  return { time, timeVersion: TIME_VERSION, quoteDefault: 60, maxActive: 3, goals: [], checks: {},
    milestones: {}, sprint: JSON.parse(JSON.stringify(SPRINT_DEFAULT)),
    daily: {}, healthStart: "2026-09-26" };
}

function mergeState(data) {
  const base = defaultState();
  const merged = Object.assign(base, data);
  // Alte Zeitwerte verwerfen, wenn sich die Standardwerte geändert haben
  const oldTime = data && (data.timeVersion || 1) >= 2 ? data.time : {}; // neue Felder bekommen Standardwerte
  merged.time = Object.assign(defaultState().time, oldTime);
  merged.timeVersion = TIME_VERSION;
  merged.milestones = Object.assign({}, data && data.milestones);
  if (!merged.sprint || !Array.isArray(merged.sprint.books)) merged.sprint = defaultState().sprint;
  if (!merged.daily || typeof merged.daily !== "object") merged.daily = {};
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
  renderHealthToday();
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
      <p class="label">Tipp: 25 Min. nach Fajr und 20 Min. abends. Bis zum 15.12. läuft Baulia dafür auf Sparflamme.${min > 60 ? " Das ist viel: Nimm für eins der Bücher das Hörbuch beim Fahren." : ""}</p>`;
  }
  $("#sprint-status").innerHTML = `<div class="msg ${cls}">${html}</div>`;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function renderHealthToday() {
  const key = todayKey();
  const done = state.daily[key] || {};
  const n = HEALTH.daily.filter(([id]) => done[id]).length;
  $("#health-progress").textContent = `${n}/${HEALTH.daily.length}`;
  $("#health-list").innerHTML = HEALTH.daily.map(([id, t]) =>
    `<label class="check${done[id] ? " done" : ""}"><input type="checkbox" data-health="${id}"${done[id] ? " checked" : ""}><span>${esc(t)}</span></label>`).join("");
  // Streak: Tage in Folge mit mind. 8/10
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const c = Object.values(state.daily[k] || {}).filter(Boolean).length;
    if (c >= 8) streak++; else if (i > 0) break;
  }
  $("#health-streak").textContent = streak
    ? `${streak} Tag(e) in Folge mit mindestens 8 von 10 Punkten.`
    : "Ziel: mindestens 8 von 10, nicht perfekt.";
}

$("#health-list").addEventListener("change", e => {
  const id = e.target.dataset.health;
  if (!id) return;
  const key = todayKey();
  state.daily[key] = state.daily[key] || {};
  if (e.target.checked) state.daily[key][id] = true; else delete state.daily[key][id];
  // nur die letzten 60 Tage behalten
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 60);
  Object.keys(state.daily).forEach(k => { if (new Date(k) < cutoff) delete state.daily[k]; });
  saveState();
  renderHealthToday();
});

function currentPhase() {
  const days = Math.floor((new Date() - new Date(state.healthStart + "T00:00:00")) / 86400000);
  if (isNaN(days) || days < 0) return -1;
  if (days < 14) return 0;
  const m = Math.floor((days - 14) / 30.44) + 1;
  let idx = 0;
  HEALTH.phases.forEach((p, i) => { if (p.m && m >= p.m) idx = i; });
  return m > 12 ? HEALTH.phases.length : idx;
}

function renderHealthPlan() {
  const cur = currentPhase();
  if (document.activeElement !== $("#health-start")) $("#health-start").value = state.healthStart;
  $("#health-phases").innerHTML = HEALTH.phases.map((p, i) =>
    `<tr class="${i === cur ? "current" : ""}"><td>${esc(p.label)}${i === cur ? " ← jetzt" : ""}</td><td>${esc(p.add)}</td><td>${esc(p.check)}</td></tr>`).join("");
  $("#health-weekly").innerHTML = HEALTH.weekly.map(w => `<li>${w}</li>`).join("");
  $("#health-rules").innerHTML = HEALTH.rules.map(r => `<li>${esc(r)}</li>`).join("");
}

$("#health-start").addEventListener("change", e => {
  if (!e.target.value) return;
  state.healthStart = e.target.value;
  saveState();
  renderHealthPlan();
});

function renderPlan() {
  renderHealthPlan();
  const jobs = weeklyHours(TIME_FIELDS.find(f => f.key === "job1")) + weeklyHours(TIME_FIELDS.find(f => f.key === "job2"));
  const free = Math.max(0, freeHours());
  const planH = PLAN.goals.reduce((s, g) => s + g.hours, 0);
  const real = realisticHours();
  const fitsPlan = planH <= real;
  $("#plan-time").innerHTML = `<div class="msg ${fitsPlan ? "ok" : "warn"}" style="margin:0">
    <p><strong>Ehrliche Rechnung:</strong> ${fmtH(jobs)} Jobs pro Woche. Danach bleiben ${fmtH(free)} frei, realistisch nutzbar sind <strong>${fmtH(real)}</strong>.</p>
    <p>Gym und Islam laufen als feste Routinen schon mit. Die 3 Foki brauchen ${fmtH(planH)} pro Woche. ${fitsPlan
      ? "Das passt. Alles, was du mehr schaffst, ist Bonus."
      : "Das passt gerade nicht. Schau unter „Meine Woche“, wo Zeit frei wird, oder kürz Fokus 2."}</p>
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
    `<li><strong>Security-Arbeit:</strong> machen Bruder und Onkel. Ich koordiniere nur, das Geld geht in den Kapital-Stack.</li>`;
}

function applyPlan() {
  state.goals = state.goals.filter(g => !(OLD_PLAN_GOALS.includes(g.name) && g.status !== "done"));
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
