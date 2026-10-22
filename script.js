/* =========================================================
   ✏️  הגדרות האתר – כאן עורכים את זמני התפילות
   ---------------------------------------------------------
   • כל שעה נכתבת בפורמט "HH:MM" (למשל "06:30" או "18:45").
   • אפשר להוסיף או למחוק שורות – פשוט מעתיקים שורה קיימת.
   • אחרי שמירה, מרעננים את הדף בדפדפן.
   ========================================================= */

const CONFIG = {
  synagogueName: "מטה משה",
  tagline: "״היכל רבנו יורם״",
  address: "רחוב החרצית 5, חולון",

  // true = מוסיף "(לדוגמה)" ליד כותרת תפילות החול.
  isSample: false,

  // ---------- תפילות ימי חול ----------
  weekdayNote: "",
  weekday: {
    shacharit: [
      { label: "שחרית נץ", time: "06:10" },
      { label: "מניין שני – הודו", time: "07:45" },
    ],
    mincha: [
      { label: "מנחה גדולה", time: "13:10" },
      { label: "מנחה", time: "17:35" },
    ],
    arvit: [
      { label: "ערבית", time: "18:20" },
      { label: "ערבית מניין שני", time: "21:15" },
    ],
  },

  // ---------- תפילות שבת ----------
  // יש לעדכן את שם הפרשה בכל שבוע
  shabbatNote: "פרשת לך לך",
  shabbat: {
    erevShabbat: {
      title: "ערב שבת",
      items: [
        { label: "שיעור", time: "17:00" },
        { label: "שיר השירים", time: "17:30" },
        { label: "מנחה", time: "" }, // אין שעה בלוח – להשלים
      ],
    },
    shabbatDay: {
      title: "יום שבת",
      items: [
        { label: "שיעור", time: "06:45" },
        { label: "שחרית – הודו", time: "08:10" },
        { label: "שיעור", time: "14:55" },
        { label: "מנחה", time: "16:55" },
        { label: "ערבית מוצאי שבת", time: "18:15" },
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
  parnasim: [
    "הלימוד השבוע להצלחת",
    "רועי לוי הי״ו",
    "והמסייעים הי״ו",
    "בגשמיות וברוחניות ובכל מילי דמיטב",
  ],
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
    li.querySelector(".t-time").textContent = item.time || "—";
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
    .filter((p) => toMinutes(p.time) > nowMin)
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
  const countdown = hours > 0 ? `בעוד ${hours} שע׳ ו-${mins} דק׳` : `בעוד ${mins} דקות`;

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

/* ---------- אנימציית הופעה בגלילה ---------- */

function setupReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const targets = document.querySelectorAll(
    ".next-prayer, .section-head, .parnasim h2, .prayer-card, .shabbat, .shabbat-block, .parnasim-card"
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

/* ---------- עדכון שוטף ---------- */

function tick() {
  const now = new Date();
  document.getElementById("clock").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  document.getElementById("hebrew-date").textContent = getHebrewDate(now) || "—";
  document.getElementById("gregorian-date").textContent = getGregorianDate(now);
  renderNextPrayer(now);
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
  document.getElementById("shabbat-note").textContent = CONFIG.shabbatNote;
  renderWeekday();
  renderShabbat();
  renderLessons();
  renderParnasim();
  setupReveal();

  tick();
  setInterval(tick, 30 * 1000); // עדכון כל 30 שניות
}

document.addEventListener("DOMContentLoaded", init);
