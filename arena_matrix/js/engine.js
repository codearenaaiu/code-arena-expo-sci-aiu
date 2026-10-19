/* ==========================================================================
   CODE ARENA 2026 - STAGE BROADCAST ENGINE JAVASCRIPT
   ========================================================================== */

// --- Default Configuration State ---
let config = {
    totalStations: 12,
    streamPrefix: "Team",
    contestSlug: "code-arena-2026-simulation-2-qualifiers",
    gridScale: 340,
    scrollSpeed: 1.5,
    isBlackout: false
};

// --- DOM References ---
const stationsGrid = document.getElementById('stationsGrid');
const gridViewport = document.getElementById('gridViewport');
const paneResizer = document.getElementById('paneResizer');
const leaderboardViewport = document.getElementById('leaderboardViewport');
const lbIframe = document.getElementById('leaderboardIframe');
const gridSizeRange = document.getElementById('gridSizeRange');
const gridScaleLabel = document.getElementById('gridScaleLabel');
const scrollSpeedRange = document.getElementById('scrollSpeedRange');
const scrollSpeedLabel = document.getElementById('scrollSpeedLabel');
const settingsDrawer = document.getElementById('settingsDrawer');
const spotlightModal = document.getElementById('spotlightModal');
const spotlightBody = document.getElementById('spotlightBody');
const spotlightTitle = document.getElementById('spotlightTitle');

// --- Auto Scroll Variables ---
let scrollInterval = null;
let scrollDirection = 1;

// ==========================================================================
// 1. INITIALIZE & BUILD STREAM MATRIX
// ==========================================================================
function buildMatrix() {
    stationsGrid.innerHTML = '';

    for (let i = 1; i <= config.totalStations; i++) {
        const stationId = `${config.streamPrefix}${i < 10 ? '0' + i : i}`;

        const card = document.createElement('div');
        card.className = 'station-card';
        card.id = `card-${stationId}`;

        // VDO.Ninja direct clean peer viewer stream
        const streamUrl = `https://vdo.ninja/?view=${stationId}&autoplay&cleanoutput&transparent`;

        card.innerHTML = `
            <div class="station-topbar">
                <span>>_ ${stationId}</span>
                <div class="station-controls">
                    <button class="btn-spotlight" onclick="openSpotlight('${stationId}')">⛶ FOCUS</button>
                    <span style="color: var(--mint-bright); font-size: 0.65rem;">● LIVE</span>
                </div>
            </div>
            <iframe class="stream-frame" 
                    src="${streamUrl}" 
                    allow="autoplay; camera; microphone; display-capture; fullscreen">
            </iframe>
        `;
        stationsGrid.appendChild(card);
    }
}

// ==========================================================================
// 2. SLIDER & REAL-TIME SIZING CONTROLS
// ==========================================================================
gridSizeRange.addEventListener('input', (e) => {
    const val = e.target.value;
    document.documentElement.style.setProperty('--grid-card-min-width', `${val}px`);
    gridScaleLabel.textContent = `${val}px`;
    config.gridScale = val;
});

scrollSpeedRange.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    config.scrollSpeed = val;
    scrollSpeedLabel.textContent = `${val}x`;
    restartAutoScroll();
});

// ==========================================================================
// 3. DRAGGABLE SPLIT PANE RESIZER
// ==========================================================================
let isDragging = false;

paneResizer.addEventListener('mousedown', (e) => {
    isDragging = true;
    paneResizer.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const containerRect = document.getElementById('stageContainer').getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;

    if (newWidth >= 180 && newWidth <= containerRect.width * 0.65) {
        leaderboardViewport.style.width = `${newWidth}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        paneResizer.classList.remove('dragging');
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }
});

// ==========================================================================
// 4. SMART AUTO-SCROLL ENGINE
// ==========================================================================
function startAutoScroll() {
    if (scrollInterval) clearInterval(scrollInterval);
    if (config.scrollSpeed === 0) return;

    scrollInterval = setInterval(() => {
        if (gridViewport.scrollTop + gridViewport.clientHeight >= gridViewport.scrollHeight - 5) {
            scrollDirection = -1;
        } else if (gridViewport.scrollTop <= 5) {
            scrollDirection = 1;
        }
        gridViewport.scrollBy({ top: scrollDirection * config.scrollSpeed, behavior: 'auto' });
    }, 40);
}

function restartAutoScroll() {
    clearInterval(scrollInterval);
    startAutoScroll();
}

gridViewport.addEventListener('mouseenter', () => clearInterval(scrollInterval));
gridViewport.addEventListener('mouseleave', () => startAutoScroll());

// ==========================================================================
// 5. BLIND FINISH BLACKOUT PROTOCOL
// ==========================================================================
function toggleBlackout() {
    config.isBlackout = !config.isBlackout;
    document.body.classList.toggle('blackout-active', config.isBlackout);

    const btn = document.getElementById('blackoutBtn');
    if (config.isBlackout) {
        btn.textContent = "REVEAL LEADERBOARD";
        btn.style.background = "var(--mint-primary)";
        btn.style.color = "#000";
    } else {
        btn.textContent = "TRIGGER BLIND FINISH";
        btn.style.background = "";
        btn.style.color = "";
    }
}

// ==========================================================================
// 6. SPOTLIGHT FULLSCREEN FOCUS (AUDIENCE HERO VIEW)
// ==========================================================================
function openSpotlight(stationId) {
    spotlightTitle.textContent = `>_ AUDITORIUM FOCUS: ${stationId}`;
    const directStreamUrl = `https://vdo.ninja/?view=${stationId}&autoplay&cleanoutput&transparent`;
    spotlightBody.innerHTML = `<iframe src="${directStreamUrl}" allow="autoplay; display-capture; fullscreen"></iframe>`;
    spotlightModal.classList.add('active');
}

function closeSpotlight() {
    spotlightModal.classList.remove('active');
    spotlightBody.innerHTML = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpotlight();
});

// ==========================================================================
// 7. SETTINGS & LEADERBOARD CONTROLS
// ==========================================================================
function toggleSettingsDrawer() {
    settingsDrawer.classList.toggle('open');
}

function toggleLeaderboardCollapse() {
    if (leaderboardViewport.style.display === 'none') {
        leaderboardViewport.style.display = 'flex';
        paneResizer.style.display = 'flex';
    } else {
        leaderboardViewport.style.display = 'none';
        paneResizer.style.display = 'none';
    }
}

function reloadLeaderboard() {
    lbIframe.src = lbIframe.src;
}

function applyPreset(count) {
    document.getElementById('cfgTotalStations').value = count;
}

function saveAndApplySettings() {
    const slug = document.getElementById('cfgContestSlug').value.trim();
    const count = parseInt(document.getElementById('cfgTotalStations').value, 10);
    const prefix = document.getElementById('cfgStreamPrefix').value.trim();

    if (slug) {
        config.contestSlug = slug;
        lbIframe.src = `https://www.hackerrank.com/contests/${slug}/leaderboard`;
    }

    if (count && count > 0) config.totalStations = count;
    if (prefix) config.streamPrefix = prefix;

    buildMatrix();
    toggleSettingsDrawer();
}

// Bootstrapping
buildMatrix();
startAutoScroll();