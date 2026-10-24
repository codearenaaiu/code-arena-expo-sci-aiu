// Official Code Arena 2026 Launch Timestamp: October 22, 2026, 09:00:00 AM (MYT)
const EVENT_DATE = new Date('2026-10-22T09:00:00+08:00').getTime();

function updateElapsedClock() {
    const now = new Date().getTime();
    const elapsed = Math.max(0, now - EVENT_DATE);

    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

// Hacker Cypher reveal effect for prize numbers
const CYPHER_CHARS = '0123456789!@#$%^&*<>/?';

function scrambleText(element, finalText, duration = 1200) {
    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
            let result = '';
            for (let i = 0; i < finalText.length; i++) {
                if (finalText[i] === ' ') {
                    result += ' ';
                } else if (Math.random() < progress) {
                    result += finalText[i];
                } else {
                    result += CYPHER_CHARS[Math.floor(Math.random() * CYPHER_CHARS.length)];
                }
            }
            element.innerText = result;
            requestAnimationFrame(animate);
        } else {
            element.innerText = finalText;
        }
    }

    requestAnimationFrame(animate);
}

function initCypherEffects() {
    const cypherElements = document.querySelectorAll('.cypher-text');

    cypherElements.forEach(el => {
        let isScrambling = false;
        const target = el.getAttribute('data-target');

        el.addEventListener('mouseenter', () => {
            if (!isScrambling) {
                isScrambling = true;
                scrambleText(el, target, 800);
                setTimeout(() => { isScrambling = false; }, 900);
            }
        });

        el.addEventListener('click', () => {
            scrambleText(el, target, 1200);
        });
    });
}

// Verified Standings Data Across All 3 Rounds
const STANDINGS_DATA = {
    finals: [
        { rank: 1, id: "CA026-T023", name: "The SAS", handle: "T23_The_SAS", inst: "UiTM Cawangan Kedah", score: "109.80", time: "1:59:48", status: "CHAMPION · RM 1,000", badge: "gold" },
        { rank: 2, id: "CA026-T010", name: "Ey/ilaf", handle: "T10_Ey_ilaf", inst: "AIU (SCI)", score: "107.40", time: "1:47:24", status: "2ND PLACE · RM 750", badge: "gold" },
        { rank: 3, id: "CA026-T031", name: "2 chill guys", handle: "T31_2_Chill_Guys", inst: "AIU (SCI)", score: "105.00", time: "1:25:17", status: "3RD PLACE · RM 500", badge: "gold" },
        { rank: 4, id: "CA026-T033", name: "O(1)", handle: "T33_O_1", inst: "AIU (SCI)", score: "105.00", time: "1:33:47", status: "4TH PLACE · RM 250", badge: "gold" },
        { rank: 5, id: "CA026-T006", name: "EthioByte", handle: "T06_EthioByte", inst: "AIU (SCI)", score: "99.00", time: "1:41:55", status: "GRAND FINALIST", badge: "advance" },
        { rank: 6, id: "CA026-T004", name: "ByteX", handle: "T04_ByteX", inst: "AIU (SCI)", score: "96.00", time: "1:41:27", status: "GRAND FINALIST", badge: "advance" },
        { rank: 7, id: "CA026-T014", name: "Genz", handle: "T14_Genz", inst: "AIU (SCI)", score: "88.00", time: "2:07:46", status: "GRAND FINALIST", badge: "advance" },
        { rank: 8, id: "CA026-T026", name: "Aurafarmer67", handle: "T26_Aurafarmer67", inst: "UiTM", score: "85.00", time: "0:43:28", status: "GRAND FINALIST", badge: "advance" },
        { rank: 9, id: "CA026-T027", name: "NOVA", handle: "T27_NOVA", inst: "AIU (SCI)", score: "85.00", time: "1:12:57", status: "GRAND FINALIST", badge: "advance" },
        { rank: 10, id: "CA026-T021", name: "Debuggers", handle: "T21_Debuggers", inst: "AIU (SCI)", score: "72.00", time: "1:31:34", status: "GRAND FINALIST", badge: "advance" },
        { rank: 11, id: "CA026-T011", name: "Handle", handle: "T11_Handle", inst: "AIU (SBSS)", score: "61.00", time: "1:45:30", status: "GRAND FINALIST", badge: "advance" }
    ],
    semis: [
        { rank: 1, id: "CA026-T031", name: "2 chill guys", handle: "T31_2_Chill_Guys", inst: "AIU (SCI)", score: "105.00", time: "2:00:22", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 2, id: "CA026-T021", name: "Debuggers", handle: "T21_Debuggers", inst: "AIU (SCI)", score: "105.00", time: "2:32:09", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 3, id: "CA026-T023", name: "The SAS", handle: "T23_The_SAS", inst: "UiTM Cawangan Kedah", score: "105.00", time: "3:16:04", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 4, id: "CA026-T010", name: "Ey/ilaf", handle: "T10_Ey_ilaf", inst: "AIU (SCI)", score: "105.00", time: "3:17:29", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 5, id: "CA026-T004", name: "ByteX", handle: "T04_ByteX", inst: "AIU (SCI)", score: "105.00", time: "3:30:23", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 6, id: "CA026-T014", name: "Genz", handle: "T14_Genz", inst: "AIU (SCI)", score: "105.00", time: "3:40:47", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 7, id: "CA026-T033", name: "O(1)", handle: "T33_O_1", inst: "AIU (SCI)", score: "105.00", time: "4:25:34", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 8, id: "CA026-T011", name: "Handle", handle: "T11_Handle", inst: "AIU (SBSS)", score: "105.00", time: "4:30:43", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 9, id: "CA026-T006", name: "EthioByte", handle: "T06_EthioByte", inst: "AIU (SCI)", score: "100.00", time: "1:06:52", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 10, id: "CA026-T027", name: "NOVA", handle: "T27_NOVA", inst: "AIU (SCI)", score: "100.00", time: "1:55:35", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 11, id: "CA026-T026", name: "Aurafarmer67", handle: "T26_Aurafarmer67", inst: "UiTM", score: "91.00", time: "3:08:36", status: "ADVANCED TO FINALS", badge: "advance" },
        { rank: 12, id: "CA026-T025", name: "Team Zero", handle: "T25_Team_Zero", inst: "AIU (Foundation)", score: "51.00", time: "2:18:55", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 13, id: "CA026-T003", name: "bYteZero", handle: "T03_bYteZero", inst: "AIU (SCI)", score: "30.00", time: "0:47:50", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 14, id: "CA026-T018", name: "Take it easy", handle: "T18_Take_It_Easy", inst: "AIU (SCI)", score: "30.00", time: "1:05:02", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 15, id: "CA026-T030", name: "Team PPP", handle: "T30_Team_PPP", inst: "AIU (SCI)", score: "24.00", time: "3:15:32", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 16, id: "CA026-T008", name: "MULTO", handle: "T08_MULTO", inst: "AIU (SCI)", score: "19.00", time: "1:43:53", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 17, id: "CA026-T016", name: "Code Titans", handle: "T16_Code_Titans", inst: "AIU (SCI)", score: "17.00", time: "1:56:36", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 18, id: "CA026-T028", name: "AHA Nexus", handle: "T28_AHA_Nexus", inst: "AIU (SCI)", score: "12.00", time: "2:04:30", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 19, id: "CA026-T017", name: "Data Raiders", handle: "T17_Data_Raiders", inst: "AIU (SCI)", score: "5.00", time: "1:12:23", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 20, id: "CA026-T029", name: "Blue team", handle: "T29_Blue_Team", inst: "AIU (SCI)", score: "5.00", time: "1:18:02", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 21, id: "CA026-T007", name: "Team Ikigai", handle: "T07_Team_Ikigai", inst: "AIU (SCI)", score: "5.00", time: "1:24:24", status: "SEMI-FINALIST", badge: "participant" },
        { rank: 22, id: "CA026-T013", name: "ThinkSync", handle: "T13_ThinkSync", inst: "AIU (SCI)", score: "5.00", time: "1:28:12", status: "SEMI-FINALIST", badge: "participant" }
    ],
    qualifiers: [
        { rank: 1, id: "CA026-T021", name: "Debuggers", handle: "T21_Debuggers", inst: "AIU (SCI)", score: "60.00", time: "0:29:54", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 2, id: "CA026-T010", name: "Ey/ilaf", handle: "T10_Ey_ilaf", inst: "AIU (SCI)", score: "60.00", time: "0:35:55", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 3, id: "CA026-T023", name: "The SAS", handle: "T23_The_SAS", inst: "UiTM Cawangan Kedah", score: "60.00", time: "0:39:41", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 4, id: "CA026-T006", name: "EthioByte", handle: "T06_EthioByte", inst: "AIU (SCI)", score: "60.00", time: "0:50:19", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 5, id: "CA026-T027", name: "NOVA", handle: "T27_NOVA", inst: "AIU (SCI)", score: "60.00", time: "0:54:16", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 6, id: "CA026-T031", name: "2 chill guys", handle: "T31_2_Chill_Guys", inst: "AIU (SCI)", score: "60.00", time: "0:55:00", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 7, id: "CA026-T026", name: "Aurafarmer67", handle: "T26_Aurafarmer67", inst: "UiTM", score: "60.00", time: "1:05:43", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 8, id: "CA026-T033", name: "O(1)", handle: "T33_O_1", inst: "AIU (SCI)", score: "60.00", time: "1:13:43", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 9, id: "CA026-T004", name: "ByteX", handle: "T04_ByteX", inst: "AIU (SCI)", score: "60.00", time: "1:17:15", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 10, id: "CA026-T014", name: "Genz", handle: "T14_Genz", inst: "AIU (SCI)", score: "60.00", time: "1:17:35", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 11, id: "CA026-T003", name: "bYteZero", handle: "T03_bYteZero", inst: "AIU (SCI)", score: "60.00", time: "1:32:26", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 12, id: "CA026-T008", name: "MULTO", handle: "T08_MULTO", inst: "AIU (SCI)", score: "60.00", time: "1:48:30", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 13, id: "CA026-T016", name: "Code Titans", handle: "T16_Code_Titans", inst: "AIU (SCI)", score: "60.00", time: "1:50:32", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 14, id: "CA026-T011", name: "Handle", handle: "T11_Handle", inst: "AIU (SBSS)", score: "60.00", time: "1:52:58", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 15, id: "CA026-T030", name: "Team PPP", handle: "T30_Team_PPP", inst: "AIU (SCI)", score: "35.00", time: "1:43:15", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 16, id: "CA026-T025", name: "Team Zero", handle: "T25_Team_Zero", inst: "AIU (Foundation)", score: "35.00", time: "1:48:25", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 17, id: "CA026-T024", name: "CCDA", handle: "T24_CCDA", inst: "AIU (SCI)", score: "20.00", time: "0:59:55", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 18, id: "CA026-T029", name: "Blue team", handle: "T29_Blue_Team", inst: "AIU (SCI)", score: "19.00", time: "1:30:34", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 19, id: "CA026-T007", name: "Team Ikigai", handle: "T07_Team_Ikigai", inst: "AIU (SCI)", score: "15.00", time: "0:25:42", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 20, id: "CA026-T018", name: "Take it easy", handle: "T18_Take_It_Easy", inst: "AIU (SCI)", score: "15.00", time: "0:34:51", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 21, id: "CA026-T028", name: "AHA Nexus", handle: "T28_AHA_Nexus", inst: "AIU (SCI)", score: "15.00", time: "0:37:06", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 22, id: "CA026-T001", name: "Byte Squad", handle: "T01_Byte_Squad", inst: "AIU (SCI)", score: "9.00", time: "0:26:41", status: "QUALIFIERS", badge: "participant" },
        { rank: 23, id: "CA026-T022", name: "RE:MANGO", handle: "T22_RE_MANGO", inst: "UiTM Sungai Petani", score: "9.00", time: "0:54:21", status: "QUALIFIERS", badge: "participant" },
        { rank: 24, id: "CA026-T015", name: "Binary beast", handle: "T15_Binary_Beast", inst: "AIU (SCI)", score: "3.00", time: "0:20:49", status: "QUALIFIERS", badge: "participant" },
        { rank: 25, id: "CA026-T020", name: "AlgoNomads", handle: "T20_AlgoNomads", inst: "AIU (SCI)", score: "0.00", time: "0:00:00", status: "QUALIFIERS", badge: "participant" },
        { rank: 26, id: "CA026-T017", name: "Data Raiders", handle: "T17_Data_Raiders", inst: "AIU (SCI)", score: "0.00", time: "0:00:00", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 27, id: "CA026-T013", name: "ThinkSync", handle: "T13_ThinkSync", inst: "AIU (SCI)", score: "0.00", time: "0:00:00", status: "ADVANCED TO R2", badge: "advance" },
        { rank: 28, id: "CA026-T012", name: "The Trio", handle: "T12_The_Trio", inst: "AIU (SCI)", score: "0.00", time: "0:00:00", status: "QUALIFIERS", badge: "participant" },
        { rank: 29, id: "CA026-T005", name: "MindBursters", handle: "T05_MindBursters", inst: "AIU (SCI)", score: "0.00", time: "0:00:00", status: "QUALIFIERS", badge: "participant" }
    ]
};

let currentRoundTab = 'finals';

function renderStandingsTable() {
    const tbody = document.getElementById('standingsTableBody');
    const searchInput = document.getElementById('teamSearchInput');
    if (!tbody) return;

    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const rows = STANDINGS_DATA[currentRoundTab] || [];

    const filtered = rows.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query) ||
        r.handle.toLowerCase().includes(query) ||
        r.inst.toLowerCase().includes(query) ||
        r.status.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">No matching team records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(r => {
        const badgeClass = r.badge === 'gold' ? 'badge-gold' : (r.badge === 'advance' ? 'badge-advance' : 'badge-participant');
        return `
            <tr>
                <td class="rank-cell">#${r.rank}</td>
                <td>${r.id}</td>
                <td class="rank-cell">${r.name}</td>
                <td>${r.inst}</td>
                <td class="prize-cell">${r.score}</td>
                <td>${r.time}</td>
                <td><span class="badge-status ${badgeClass}">${r.status}</span></td>
            </tr>
        `;
    }).join('');
}

function initStandingsTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('teamSearchInput');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRoundTab = btn.getAttribute('data-round');
            renderStandingsTable();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', renderStandingsTable);
    }

    renderStandingsTable();
}

// Initializations
document.addEventListener('DOMContentLoaded', () => {
    updateElapsedClock();
    setInterval(updateElapsedClock, 1000);
    initCypherEffects();
    initStandingsTabs();
});