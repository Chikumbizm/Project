/* ============================================================
   GREENWOOD ACADEMY — SCHOOL CALENDAR 2026
   Renders a full-year, month-by-month calendar with:
     - Zambian public holidays
     - Term / week structure (school days)
     - Weekend + school-break shading
     - Friday = Physical Education
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const YEAR = 2026;
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    /* ---------- Date helpers ---------- */
    function d(m, day) { return new Date(YEAR, m, day); } // m is 0-indexed
    function iso(date) { return date.toISOString().slice(0, 10); }
    function addDays(date, n) { const c = new Date(date); c.setDate(c.getDate() + n); return c; }

    // Monday-indexed day of week (0=Mon ... 6=Sun)
    function mondayIndex(date) { return (date.getDay() + 6) % 7; }

    function nthWeekdayOfMonth(year, monthIndex0, targetDow /*0=Sun..6=Sat*/, n) {
        const first = new Date(year, monthIndex0, 1);
        let offset = (targetDow - first.getDay() + 7) % 7;
        return new Date(year, monthIndex0, 1 + offset + (n - 1) * 7);
    }

    // Meeus/Jones/Butcher Gregorian Easter algorithm
    function easterSunday(year) {
        const a = year % 19, b = Math.floor(year / 100), c = year % 100;
        const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30;
        const i = Math.floor(c / 4), k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-indexed month
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    /* ---------- Public holidays ---------- */
    const easter = easterSunday(YEAR);
    const goodFriday = addDays(easter, -2);
    const easterMonday = addDays(easter, 1);
    const heroesDay = nthWeekdayOfMonth(YEAR, 6, 1, 1);      // 1st Monday of July
    const unityDay = addDays(heroesDay, 1);                   // Tuesday after Heroes' Day
    const farmersDay = nthWeekdayOfMonth(YEAR, 7, 1, 1);       // 1st Monday of August

    const HOLIDAYS = [
        { date: d(0, 1), name: "New Year's Day" },
        { date: d(2, 8), name: "International Women's Day" },
        { date: d(2, 12), name: "Youth Day" },
        { date: goodFriday, name: "Good Friday" },
        { date: easterMonday, name: "Easter Monday" },
        { date: d(3, 28), name: "Kenneth Kaunda's Birthday" },
        { date: d(4, 1), name: "Labour Day" },
        { date: d(4, 25), name: "African Freedom Day" },
        { date: heroesDay, name: "Heroes' Day" },
        { date: unityDay, name: "Unity Day" },
        { date: farmersDay, name: "Farmers' Day" },
        { date: d(9, 18), name: "National Day of Prayer" },
        { date: d(9, 24), name: "Independence Day" },
        { date: d(11, 25), name: "Christmas Day" }
    ];
    const HOLIDAY_MAP = {};
    HOLIDAYS.forEach(h => { HOLIDAY_MAP[iso(h.date)] = h.name; });

    /* ---------- Term / week structure ---------- */
    const TERMS = [
        {
            id: 'term1', label: 'Term 1', cls: 'term1', color: 'var(--term1)',
            opening: d(0, 12), closing: d(3, 2),
            weeks: [
                { n: 1, start: d(0, 12), end: d(0, 16), note: 'Schools Open' },
                { n: 2, start: d(0, 19), end: d(0, 23) },
                { n: 3, start: d(0, 26), end: d(0, 30) },
                { n: 4, start: d(1, 2), end: d(1, 6) },
                { n: 5, start: d(1, 9), end: d(1, 13) },
                { n: 6, start: d(1, 16), end: d(1, 20) },
                { n: 7, start: d(1, 23), end: d(1, 27) },
                { n: 8, start: d(2, 2), end: d(2, 6), note: 'Mid-Term Assessment window' },
                { n: 9, start: d(2, 9), end: d(2, 13), note: "Includes Women's Day & Youth Day holidays" },
                { n: 10, start: d(2, 16), end: d(2, 20) },
                { n: 11, start: d(2, 23), end: d(2, 27), note: 'End of term examinations' },
                { n: 12, start: d(2, 30), end: d(3, 2), note: 'Closing on Thursday before Good Friday' }
            ]
        },
        {
            id: 'term2', label: 'Term 2', cls: 'term2', color: 'var(--term2)',
            opening: d(4, 4), closing: d(7, 7),
            weeks: [
                { n: 1, start: d(4, 4), end: d(4, 8), note: 'Schools Reopen' },
                { n: 2, start: d(4, 11), end: d(4, 15) },
                { n: 3, start: d(4, 18), end: d(4, 22) },
                { n: 4, start: d(4, 25), end: d(4, 29), note: 'Includes Africa Freedom Day' },
                { n: 5, start: d(5, 1), end: d(5, 5) },
                { n: 6, start: d(5, 8), end: d(5, 12) },
                { n: 7, start: d(5, 15), end: d(5, 19) },
                { n: 8, start: d(5, 22), end: d(5, 26) },
                { n: 9, start: d(5, 29), end: d(6, 3) },
                { n: 10, start: d(6, 6), end: d(6, 10), note: "Includes Heroes' Day & Unity Day holidays" },
                { n: 11, start: d(6, 13), end: d(6, 17) },
                { n: 12, start: d(6, 20), end: d(6, 24) },
                { n: 13, start: d(6, 27), end: d(6, 31), note: 'End of Term assessments' },
                { n: 14, start: d(7, 3), end: d(7, 7), note: "Includes Farmers' Day holiday & Term 2 Closing" }
            ]
        },
        {
            id: 'term3', label: 'Term 3', cls: 'term3', color: 'var(--term3)',
            opening: d(8, 14), closing: d(11, 11),
            weeks: [
                { n: 1, start: d(8, 14), end: d(8, 18), note: 'Schools Reopen' },
                { n: 2, start: d(8, 21), end: d(8, 25) },
                { n: 3, start: d(8, 28), end: d(9, 2) },
                { n: 4, start: d(9, 5), end: d(9, 9), note: "Includes World Teachers' Day" },
                { n: 5, start: d(9, 12), end: d(9, 16) },
                { n: 6, start: d(9, 19), end: d(9, 23), note: 'Includes National Day of Prayer & Independence Day' },
                { n: 7, start: d(9, 26), end: d(9, 30), note: 'Mock exams / Revision period' },
                { n: 8, start: d(10, 2), end: d(10, 6) },
                { n: 9, start: d(10, 9), end: d(10, 13) },
                { n: 10, start: d(10, 16), end: d(10, 20), note: 'Grade 7 National Composite Exams begin' },
                { n: 11, start: d(10, 23), end: d(10, 27), note: 'Grade 7 Exam final phase' },
                { n: 12, start: d(10, 30), end: d(11, 4), note: 'General primary end-of-year exams' },
                { n: 13, start: d(11, 7), end: d(11, 11), note: 'Report compilation & Final School Closing' }
            ]
        }
    ];

    // Build a lookup: iso date -> { term, week, note }
    const SCHOOL_DAY_MAP = {};
    TERMS.forEach(term => {
        term.weeks.forEach(week => {
            let cur = new Date(week.start);
            while (cur <= week.end) {
                SCHOOL_DAY_MAP[iso(cur)] = { term, week };
                cur = addDays(cur, 1);
            }
            // The "badge date" is the first weekday of the week that isn't a public
            // holiday, so the Week badge still shows even if the week opens on a holiday.
            let badgeCur = new Date(week.start);
            while (badgeCur <= week.end && HOLIDAY_MAP[iso(badgeCur)]) {
                badgeCur = addDays(badgeCur, 1);
            }
            week.badgeDate = iso(badgeCur);
        });
    });

    /* ---------- Render: Term summary cards ---------- */
    const introGrid = document.getElementById('calTermCards');
    if (introGrid) {
        const fmt = date => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        introGrid.innerHTML = TERMS.map(term => `
            <div class="term-card ${term.cls}">
                <h3>${term.label}</h3>
                <span class="term-weeks">${term.weeks.length} Weeks Total</span>
                <div class="term-dates">
                    <span>Opening: <strong>${fmt(term.opening)}</strong></span>
                    <span>Closing: <strong>${fmt(term.closing)}</strong></span>
                </div>
            </div>
        `).join('');
    }

    /* ---------- Render: Holiday reference table ---------- */
    const holidayBody = document.getElementById('calHolidayBody');
    if (holidayBody) {
        const sorted = [...HOLIDAYS].sort((a, b) => a.date - b.date);
        holidayBody.innerHTML = sorted.map(h => `
            <tr>
                <td class="hol-date">${h.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</td>
                <td class="hol-day">${h.date.toLocaleDateString('en-GB', { weekday: 'long' })}</td>
                <td>${h.name}</td>
            </tr>
        `).join('');
    }

    /* ---------- Render: Year calendar ---------- */
    const yearContainer = document.getElementById('calMonths');
    const jumpNav = document.getElementById('calJumpNav');
    if (!yearContainer) return;

    let monthsHtml = '';
    let navHtml = '';

    for (let m = 0; m < 12; m++) {
        navHtml += `<button type="button" data-month="${m}">${MONTH_NAMES[m].slice(0, 3)}</button>`;

        const daysInMonth = new Date(YEAR, m + 1, 0).getDate();
        const firstDay = new Date(YEAR, m, 1);
        const leadingBlanks = mondayIndex(firstDay);

        let cells = '';
        for (let i = 0; i < leadingBlanks; i++) {
            cells += `<div class="cal-day empty"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(YEAR, m, day);
            const key = iso(date);
            const dow = date.getDay(); // 0=Sun..6=Sat
            const isWeekend = dow === 0 || dow === 6;
            const isFriday = dow === 5;
            const holidayName = HOLIDAY_MAP[key];
            const schoolInfo = SCHOOL_DAY_MAP[key];
            const isSchoolDay = !!schoolInfo && !isWeekend && !holidayName;

            let classes = ['cal-day'];
            if (isWeekend) classes.push('weekend');
            if (holidayName) classes.push('holiday');
            if (isSchoolDay) classes.push(schoolInfo.term.cls);
            if (!isWeekend && !holidayName && !schoolInfo) classes.push('school-break');

            let tip = '';
            if (holidayName) tip = holidayName;
            else if (isSchoolDay) {
                tip = `${schoolInfo.term.label} · Week ${schoolInfo.week.n}` + (schoolInfo.week.note ? ` — ${schoolInfo.week.note}` : '');
            }

            const termBar = isSchoolDay ? `<span class="cal-term-bar"></span>` : '';
            const weekBadge = (isSchoolDay && schoolInfo.week.badgeDate === key) ? `<span class="cal-week-badge">W${schoolInfo.week.n}</span>` : '';
            const holidayLabel = holidayName ? `<span class="cal-holiday-label">${holidayName}</span>` : '';
            const peTag = (isFriday && isSchoolDay) ? `<span class="cal-pe-tag">PE</span>` : '';
            const noteDot = (isSchoolDay && schoolInfo.week.note && schoolInfo.week.badgeDate !== key) ? `<span class="cal-note-dot"></span>` : '';

            cells += `<div class="${classes.join(' ')}"${tip ? ` data-tip="${tip.replace(/"/g, '&quot;')}"` : ''}>
                ${termBar}${weekBadge}
                <span class="cal-day-num">${day}</span>
                ${holidayLabel}
                ${peTag}
                ${noteDot}
            </div>`;
        }

        const totalCells = leadingBlanks + daysInMonth;
        const trailingBlanks = (7 - (totalCells % 7)) % 7;
        for (let i = 0; i < trailingBlanks; i++) {
            cells += `<div class="cal-day empty"></div>`;
        }

        monthsHtml += `
            <div class="cal-month" id="month-${m}">
                <div class="cal-month-head">
                    <h3>${MONTH_NAMES[m]}</h3>
                    <span class="cal-year-label">${YEAR}</span>
                </div>
                <div class="cal-weekdays">
                    ${WEEKDAY_LABELS.map(w => `<span class="${w === 'Fri' ? 'fri' : ''}">${w}</span>`).join('')}
                </div>
                <div class="cal-grid">${cells}</div>
            </div>
        `;
    }

    yearContainer.innerHTML = monthsHtml;
    if (jumpNav) jumpNav.innerHTML = navHtml;

    /* ---------- Jump nav scroll behaviour ---------- */
    if (jumpNav) {
        jumpNav.addEventListener('click', function (e) {
            const btn = e.target.closest('button[data-month]');
            if (!btn) return;
            const target = document.getElementById('month-' + btn.dataset.month);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        const monthEls = Array.from(document.querySelectorAll('.cal-month'));
        const navBtns = Array.from(jumpNav.querySelectorAll('button'));
        if (typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = monthEls.indexOf(entry.target);
                    navBtns.forEach(b => b.classList.remove('active'));
                    if (navBtns[idx]) navBtns[idx].classList.add('active');
                }
            });
        }, { rootMargin: '-40% 0px -50% 0px' });
        monthEls.forEach(el => observer.observe(el));
    }
});
