/* =========================================================
   ✏️  הגדרות האתר – כאן עורכים את זמני התפילות
   ---------------------------------------------------------
   כל תפילה מוגדרת באחת משלוש דרכים (כמו ב-MyGabay):
     • שעה קבועה:  { label: "...", time: "08:10" }
     • לפי נוסחה:   { label: "...", base: "sunset", offset: "-1:15" }
                    (base = זמן בסיס, offset = שעות:דקות להוסיף "+" או להחסיר "-")
     • ללא שעה:     { label: "..." }

   זמני בסיס אפשריים (לפי שיטת אור החיים):
     "sunrise"        – נץ החמה
     "sunset"         – שקיעה
     "tzeit"          – צאת הכוכבים (13.5 דקות זמניות אחרי השקיעה)
     "motzaeiShabbat" – מוצאי שבת

   • אפשר להוסיף או למחוק שורות – פשוט מעתיקים שורה קיימת.
   • אחרי שמירה, מרעננים את הדף בדפדפן.
   ========================================================= */

const CONFIG = {
  synagogueName: "מטה משה",
  tagline: "״היכל רבנו יורם״",
  address: "רחוב החרצית 5, חולון",

  // true = מוסיף "(לדוגמה)" ליד כותרת תפילות החול.
  isSample: false,

  // ---------- מיקום לחישוב זמני היום (חולון) ----------
  location: { latitude: 32.0158, longitude: 34.7874, tzid: "Asia/Jerusalem" },

  // עיגול זמני תפילות שמחושבים לפי נוסחה (בדקות), כמו ב-MyGabay. 1 = ללא עיגול.
  roundToMinutes: 5,

  // ---------- תפילות ימי חול (מחושבות לפי זמני היום) ----------
  weekdayNote: "",
  weekday: {
    shacharit: [
      { label: "שחרית נץ", base: "sunrise", offset: "-0:40" },
      { label: "מניין שני – הודו", time: "07:45" },
    ],
    mincha: [
      { label: "מנחה גדולה", time: "13:10" },
      { label: "מנחה", base: "tzeit", offset: "-0:45" },
    ],
    arvit: [
      { label: "ערבית", base: "tzeit", offset: "+0:00" },
      { label: "ערבית מניין שני", time: "21:15" },
    ],
  },

  // ---------- תפילות שבת ----------
  // שם הפרשה מתעדכן אוטומטית.
  // בערב שבת זמני הבסיס הם של יום שישי, וביום שבת – של שבת.
  shabbat: {
    erevShabbat: {
      title: "ערב שבת",
      day: "friday",
      items: [
        { label: "שיעור", base: "sunset", offset: "-1:15" },
        { label: "שיר השירים", base: "sunset", offset: "-0:45" },
        { label: "מנחה" },
      ],
    },
    shabbatDay: {
      title: "יום שבת",
      day: "saturday",
      items: [
        { label: "שיעור", time: "06:45" },
        { label: "שחרית – הודו", time: "08:10" },
        { label: "שיעור", base: "motzaeiShabbat", offset: "-3:35" },
        { label: "מנחה", base: "motzaeiShabbat", offset: "-1:35" },
        { label: "ערבית מוצאי שבת", base: "motzaeiShabbat", offset: "-0:15" },
      ],
    },
  },

  // ---------- שיעורי תורה ----------
  // כאן אפשר לכתוב כל טקסט בשדה time (למשל "20:00-21:15" או "לאחר תפילת הנץ")
  lessons: {
    shiurim: {
      title: "שיעורים שבועיים",
      icon: "📖",
      items: [
        { label: "יום ג׳ – שיעור בשיר השירים", time: "לאחר תפילת הנץ" },
        { label: "יום ג׳ – שיעור תניא והלכה", time: "20:00-21:15" },
        { label: "יום ד׳ – שיעור תניא, בצור ירום", time: "18:00 עד מנחה" },
        { label: "יום ה׳ – שיעור תניא, בצור ירום", time: "12:00-13:00" },
      ],
    },
    kollel: {
      title: "כולל",
      icon: "📚",
      items: [
        { label: "כולל יום, ימים א׳–ה׳", time: "9:00-17:00" },
        { label: "כולל ערב, ימים א׳–ה׳", time: "20:00-21:15" },
        { label: "כולל בעלי בתים, ימים א׳–ה׳", time: "12:00-13:00" },
        { label: "כולל יום ו׳", time: "9:00-10:30" },
        { label: "כולל מוצאי שבת", time: "20:00-21:30" },
      ],
    },
  },

  // ---------- פרנסי השבוע ----------
  // כל שורה במערך מוצגת בשורה נפרדת. השורה השנייה (השם) מודגשת.
  // רשימה ריקה [] = האזור מוסתר. דוגמה להחזרה:
  //   parnasim: ["הלימוד השבוע להצלחת", "פלוני בן פלוני הי״ו", "בגשמיות וברוחניות"],
  parnasim: [],
};

/* =========================================================
   מכאן והלאה – הקוד שמציג את הנתונים. אין צורך לערוך.
   ========================================================= */

const PRAYER_META = {
  shacharit: { name: "שחרית", icon: "🌅" },
  mincha: { name: "מנחה", icon: "☀️" },
  arvit: { name: "ערבית", icon: "🌙" },
};

const SAMPLE_SUFFIX = " (לדוגמה)";

/* ---------- עזרי זמן ---------- */

// "HH:MM" -> מספר הדקות מחצות
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/* ---------- תאריך עברי (בגימטריה) ---------- */

const GEMATRIA = [
  [400, "ת"], [300, "ש"], [200, "ר"], [100, "ק"],
  [90, "צ"], [80, "פ"], [70, "ע"], [60, "ס"], [50, "נ"],
  [40, "מ"], [30, "ל"], [20, "כ"], [10, "י"],
  [9, "ט"], [8, "ח"], [7, "ז"], [6, "ו"], [5, "ה"],
  [4, "ד"], [3, "ג"], [2, "ב"], [1, "א"],
];

function toGematria(num) {
  let letters = "";
  let n = num;
  for (const [value, letter] of GEMATRIA) {
    // 15 ו-16 נכתבים ט״ו ו-ט״ז ולא י״ה / י״ו
    if (n === 15) { letters += "טו"; n = 0; break; }
    if (n === 16) { letters += "טז"; n = 0; break; }
    while (n >= value) {
      letters += letter;
      n -= value;
    }
  }
  if (letters.length === 1) return letters + "׳";
  return letters.slice(0, -1) + "״" + letters.slice(-1);
}

function getHebrewDate(date) {
  try {
    const parts = new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(date);

    const get = (type) => parts.find((p) => p.type === type)?.value;
    const day = parseInt(get("day"), 10);
    const month = get("month");
    const year = parseInt(get("year"), 10);

    return `${toGematria(day)} ב${month} ${toGematria(year % 1000)}`;
  } catch (e) {
    // דפדפן ישן שלא תומך בלוח העברי
    return "";
  }
}

function getGregorianDate(date) {
  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/* ---------- בניית HTML ---------- */

function renderTimeList(items) {
  const ul = document.createElement("ul");
  ul.className = "time-list";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.dataset.time = item.time;
    li.innerHTML = `<span class="t-label"></span><span class="t-time"></span>`;
    li.querySelector(".t-label").textContent = item.label;
    li.querySelector(".t-time").textContent = item.time || "";
    ul.appendChild(li);
  });
  return ul;
}

function renderWeekday() {
  const grid = document.getElementById("weekday-prayers");
  grid.innerHTML = "";

  Object.entries(CONFIG.weekday).forEach(([key, items]) => {
    const meta = PRAYER_META[key];
    const card = document.createElement("article");
    card.className = `prayer-card prayer-${key}`;

    const h3 = document.createElement("h3");
    h3.innerHTML = `<span class="icon" aria-hidden="true">${meta.icon}</span>`;
    h3.append(meta.name);

    card.append(h3, renderTimeList(items));
    grid.appendChild(card);
  });
}

function renderShabbat() {
  const wrap = document.getElementById("shabbat-prayers");
  wrap.innerHTML = "";

  Object.values(CONFIG.shabbat).forEach((block) => {
    const div = document.createElement("div");
    div.className = "shabbat-block";

    const h3 = document.createElement("h3");
    h3.textContent = block.title;

    div.append(h3, renderTimeList(block.items));
    wrap.appendChild(div);
  });
}

function renderLessons() {
  const grid = document.getElementById("lessons");
  grid.innerHTML = "";

  Object.values(CONFIG.lessons).forEach((block) => {
    const card = document.createElement("article");
    card.className = "prayer-card lesson-card";

    const h3 = document.createElement("h3");
    h3.innerHTML = `<span class="icon" aria-hidden="true">${block.icon}</span>`;
    h3.append(block.title);

    card.append(h3, renderTimeList(block.items));
    grid.appendChild(card);
  });
}

function renderParnasim() {
  const box = document.getElementById("parnasim-text");
  box.innerHTML = "";
  box.closest("section").hidden = CONFIG.parnasim.length === 0;
  CONFIG.parnasim.forEach((line, i) => {
    const p = document.createElement("p");
    p.textContent = line;
    if (i === 1) p.className = "highlight";
    box.appendChild(p);
  });
}

/* ---------- התפילה הבאה ---------- */

function findNextPrayer(now) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isShabbat = now.getDay() === 6;

  // ביום שבת מחפשים בלוח השבת, בשאר הימים – בלוח החול
  const candidates = isShabbat
    ? CONFIG.shabbat.shabbatDay.items.map((i) => ({ ...i, name: i.label }))
    : Object.entries(CONFIG.weekday).flatMap(([key, items]) =>
        items.map((i) => {
          // אם שם התפילה כבר כתוב בתווית (למשל "מנחה גדולה") – לא מוסיפים אותו שוב
          const prayerName = PRAYER_META[key].name;
          const name = i.label.includes(prayerName) ? i.label : `${prayerName} · ${i.label}`;
          return { ...i, name };
        })
      );

  return candidates
    .filter((p) => p.time && toMinutes(p.time) > nowMin)
    .sort((a, b) => toMinutes(a.time) - toMinutes(b.time))[0];
}

function renderNextPrayer(now) {
  const box = document.getElementById("next-prayer");
  const next = findNextPrayer(now);

  // הסרת סימון "הבאה" קודם
  document.querySelectorAll(".time-list li.is-next").forEach((li) => li.classList.remove("is-next"));

  if (!next) {
    box.innerHTML = `
      <div>
        <div class="np-label">התפילה הבאה</div>
        <div class="np-name">התפילות להיום הסתיימו</div>
      </div>
      <div class="np-countdown">נתראה מחר בשחרית</div>`;
    return;
  }

  const diff = toMinutes(next.time) - (now.getHours() * 60 + now.getMinutes());
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  const countdown = hours > 0 ? `בעוד ${hours} שע׳ ו-${mins} דק׳` : mins === 1 ? "בעוד דקה" : `בעוד ${mins} דקות`;

  box.innerHTML = `
    <div>
      <div class="np-label">התפילה הבאה</div>
      <div class="np-name"></div>
    </div>
    <div>
      <div class="np-time">${next.time}</div>
      <div class="np-countdown">${countdown}</div>
    </div>`;
  box.querySelector(".np-name").textContent = next.name;

  // סימון השורה המתאימה ברשימה
  const container = now.getDay() === 6 ? "#shabbat-prayers" : "#weekday-prayers";
  document.querySelectorAll(`${container} li[data-time="${next.time}"]`).forEach((li) => {
    if (li.querySelector(".t-label").textContent === next.label) li.classList.add("is-next");
  });
}

/* ---------- חישוב זמני תפילות לפי נוסחאות (בעזרת Hebcal) ---------- */

const HEBCAL_URL = "https://www.hebcal.com";

function isoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// יום שישי של השבת הקרובה (בשבת עצמה – יום שישי של אתמול)
function upcomingFriday(now) {
  const friday = new Date(now);
  const daysToFriday = now.getDay() === 6 ? -1 : 5 - now.getDay();
  friday.setDate(now.getDate() + daysToFriday);
  return friday;
}

// "2026-10-23T17:59:48+03:00" -> שניות מחצות (לפי השעון המקומי בישראל)
function isoToSeconds(iso) {
  const [h, m, s] = iso.slice(11, 19).split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

// "-1:15" -> -4500 שניות
function offsetToSeconds(offset = "0:00") {
  const sign = offset.trim().startsWith("-") ? -1 : 1;
  const [h, m] = offset.replace(/[+-]/, "").split(":").map(Number);
  return sign * (h * 3600 + m * 60);
}

// עיגול לכפולה הקרובה של roundTo דקות (למשל 16:53:50 -> 16:55)
function secondsToTime(seconds, roundTo = 1) {
  const totalMin = Math.round(seconds / 60 / roundTo) * roundTo;
  return `${pad(Math.floor(totalMin / 60))}:${pad(totalMin % 60)}`;
}

async function fetchZmanim(date) {
  const { latitude, longitude, tzid } = CONFIG.location;
  const url = `${HEBCAL_URL}/zmanim?cfg=json&sec=1&latitude=${latitude}&longitude=${longitude}&tzid=${tzid}&date=${isoDate(date)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Hebcal ${res.status}`);
  return (await res.json()).times;
}

async function fetchParasha(friday) {
  const { latitude, longitude, tzid } = CONFIG.location;
  const url = `${HEBCAL_URL}/shabbat?cfg=json&leyning=off&latitude=${latitude}&longitude=${longitude}&tzid=${tzid}` +
    `&gy=${friday.getFullYear()}&gm=${friday.getMonth() + 1}&gd=${friday.getDate()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Hebcal ${res.status}`);
  const item = (await res.json()).items.find((i) => i.category === "parashat");
  return item ? item.hebrew.replace("־", " ") : "";
}

// זמני הבסיס של יום מסוים, בשניות מחצות
function computeBases(dayZmanim, saturdayZmanim) {
  const sunrise = isoToSeconds(dayZmanim.sunrise);
  const sunset = isoToSeconds(dayZmanim.sunset);
  const zmanitMinute = (sunset - sunrise) / 720; // דקה זמנית = אורך היום חלקי 720
  return {
    sunrise,
    sunset,
    tzeit: sunset + 13.5 * zmanitMinute,
    motzaeiShabbat: isoToSeconds(saturdayZmanim.tzeit7083deg),
  };
}

function applyFormulas(items, bases) {
  items.forEach((item) => {
    if (!item.base) return;
    const base = bases[item.base];
    item.time = base !== undefined
      ? secondsToTime(base + offsetToSeconds(item.offset), CONFIG.roundToMinutes)
      : "";
  });
}

let zmanimDate = ""; // התאריך שעבורו חושבו הזמנים

async function loadZmanimTimes() {
  const today = new Date();
  const friday = upcomingFriday(today);
  const saturday = new Date(friday);
  saturday.setDate(friday.getDate() + 1);
  zmanimDate = isoDate(today);

  try {
    const [todayZmanim, fridayZmanim, saturdayZmanim, parasha] = await Promise.all([
      fetchZmanim(today),
      fetchZmanim(friday),
      fetchZmanim(saturday),
      fetchParasha(friday).catch(() => ""),
    ]);

    const todayBases = computeBases(todayZmanim, saturdayZmanim);
    Object.values(CONFIG.weekday).forEach((items) => applyFormulas(items, todayBases));

    const basesByDay = {
      friday: computeBases(fridayZmanim, saturdayZmanim),
      saturday: computeBases(saturdayZmanim, saturdayZmanim),
    };
    Object.values(CONFIG.shabbat).forEach((block) => applyFormulas(block.items, basesByDay[block.day]));

    document.getElementById("shabbat-note").textContent = parasha;
  } catch (e) {
    // אין חיבור לשירות – תפילות שתלויות בנוסחה יוצגו ללא שעה
    console.error("טעינת זמני היום נכשלה:", e);
  }

  renderWeekday();
  renderShabbat();
  tick();
}

/* ---------- אנימציית הופעה בגלילה ---------- */

function setupReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const targets = document.querySelectorAll(
    ".next-prayer, .section-head, .parnasim h2, .prayer-card, .shabbat, .shabbat-block, .gallery-frame, .parnasim-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => {
    // כרטיסים שכנים מופיעים בזה אחר זה
    const siblings = [...el.parentElement.children].filter((c) => c.matches(".prayer-card, .shabbat-block"));
    const index = siblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = `${index * 120}ms`;

    el.classList.add("reveal");
    // בסיום האנימציה מחזירים את האלמנט למצב הרגיל (כדי שאפקט הריחוף יעבוד כרגיל)
    el.addEventListener("transitionend", function done(e) {
      if (e.target !== el || e.propertyName !== "opacity") return;
      el.classList.remove("reveal", "is-visible");
      el.style.transitionDelay = "";
      el.removeEventListener("transitionend", done);
    });
    observer.observe(el);
  });
}

/* ---------- הגדלת תמונה ---------- */

function setupLightbox() {
  const dialog = document.getElementById("lightbox");
  if (!dialog.showModal) return; // דפדפן ישן מאוד

  document.getElementById("kollel-open").addEventListener("click", () => dialog.showModal());
  document.getElementById("lightbox-close").addEventListener("click", () => dialog.close());

  // לחיצה על הרקע הכהה (מחוץ לתמונה) סוגרת את החלון
  dialog.addEventListener("click", (e) => {
    if (e.target.tagName !== "IMG") dialog.close();
  });
}

/* ---------- עדכון שוטף ---------- */

function tick() {
  const now = new Date();
  document.getElementById("clock").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  document.getElementById("hebrew-date").textContent = getHebrewDate(now) || "—";
  document.getElementById("gregorian-date").textContent = getGregorianDate(now);
  renderNextPrayer(now);

  // עבר חצות והדף עדיין פתוח – מחשבים מחדש את זמני היום החדש
  if (zmanimDate && zmanimDate !== isoDate(now)) loadZmanimTimes();
}

function init() {
  const suffix = CONFIG.isSample ? SAMPLE_SUFFIX : "";

  document.title = `זמני תפילות | ${CONFIG.synagogueName}`;
  document.getElementById("synagogue-name").textContent = CONFIG.synagogueName;
  document.getElementById("synagogue-tagline").textContent = CONFIG.tagline;
  document.getElementById("synagogue-address").textContent = CONFIG.address;
  document.getElementById("footer-name").textContent = `${CONFIG.synagogueName} ${CONFIG.tagline}`;
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("weekday-note").textContent = CONFIG.weekdayNote + suffix;
  renderLessons();
  renderParnasim();
  setupLightbox();
  tick();

  // קודם מחשבים את הזמנים, ורק אז מציגים את התפילות ומפעילים את האנימציה
  loadZmanimTimes().then(() => {
    setupReveal();
    setInterval(tick, 30 * 1000); // עדכון כל 30 שניות
  });
}

document.addEventListener("DOMContentLoaded", init);
