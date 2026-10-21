let config = {
    totalStations: 33,
    streamPrefix: "Team",
    contestSlug: "code-arena-sim-3-qualifiers",
    gridScale: 340,
    scrollSpeed: 1.5,
    isBlackout: false,
    apiBase: "http://localhost:8080"
};

let latestLeaderboardModels = [];
let scrollInterval = null;
let scrollDirection = 1;

const stationsGrid = document.getElementById('stationsGrid');
const gridViewport = document.getElementById('gridViewport');
const paneResizer = document.getElementById('paneResizer');
const leaderboardViewport = document.getElementById('leaderboardViewport');
const lbBody = document.getElementById('lbBody');
const lbSyncStatus = document.getElementById('lbSyncStatus');
const lbContestLabel = document.getElementById('lbContestLabel');
const lbCutoffLabel = document.getElementById('lbCutoffLabel');
const gridSizeRange = document.getElementById('gridSizeRange');
const gridScaleLabel = document.getElementById('gridScaleLabel');
const scrollSpeedRange = document.getElementById('scrollSpeedRange');
const scrollSpeedLabel = document.getElementById('scrollSpeedLabel');
const settingsDrawer = document.getElementById('settingsDrawer');
const spotlightModal = document.getElementById('spotlightModal');
const spotlightBody = document.getElementById('spotlightBody');
const spotlightTitle = document.getElementById('spotlightTitle');

function buildMatrix() {
    stationsGrid.innerHTML = '';
    for (let i = 1; i <= config.totalStations; i++) {
        const stationId = `${config.streamPrefix}${i < 10 ? '0' + i : i}`;
        const card = document.createElement('div');
        card.className = 'station-card';
        card.id = `card-${stationId}`;

        const streamUrl = `https://vdo.ninja/?view=${stationId}&autoplay&cleanoutput&transparent`;

        card.innerHTML = `
            <div class="station-topbar">
                <span>&gt;_ ${stationId}</span>
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
    updateCutoffHeader();
}

function updateCutoffHeader() {
    const cutoff = Math.ceil(config.totalStations / 2);
    lbContestLabel.textContent = config.contestSlug;
    lbCutoffLabel.textContent = `TOP ${cutoff} ADVANCE (50%)`;
}

function formatSeconds(sec) {
    const total = Math.max(0, Math.floor(Number(sec) || 0));
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    if (hrs > 0) {
        return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function fetchLeaderboardNow() {
    try {
        lbSyncStatus.textContent = "● SYNCING";
        const resp = await fetch(`${config.apiBase}/api/leaderboard?slug=${encodeURIComponent(config.contestSlug)}`);
        const data = await resp.json();
        const models = Array.isArray(data.models) ? data.models : [];
        latestLeaderboardModels = models;
        renderLeaderboard(models);

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        lbSyncStatus.textContent = `● ${timeStr}`;
        lbSyncStatus.style.color = "var(--mint-bright)";
    } catch (err) {
        lbSyncStatus.textContent = "● OFFLINE";
        lbSyncStatus.style.color = "var(--danger-red)";
    }
}

function renderLeaderboard(models) {
    if (!models || models.length === 0) {
        lbBody.innerHTML = `<div class="lb-empty">No submissions recorded yet for<br><strong>${config.contestSlug}</strong></div>`;
        return;
    }

    const cutoffCount = Math.ceil(config.totalStations / 2);
    let html = '';

    models.forEach((entry, idx) => {
        const rank = entry.rank || (idx + 1);
        const team = entry.hacker || "Unknown";
        const score = Number(entry.score || 0).toFixed(1);
        const timeStr = formatSeconds(entry.time_taken);
        const rankClass = rank <= 4 ? `rank-${rank}` : '';

        html += `
            <div class="lb-row ${rankClass}">
                <span class="col-rank">#${rank}</span>
                <span class="col-team" title="${team}">${team}</span>
                <span class="col-score">${score}</span>
                <span class="col-time">${timeStr}</span>
            </div>
        `;

        if (idx + 1 === cutoffCount && models.length > cutoffCount) {
            html += `<div class="lb-cutoff-divider">▲ TOP ${cutoffCount} ADVANCEMENT CUTOFF ▲</div>`;
        }
    });

    lbBody.innerHTML = html;
}

function exportLeaderboardCSV() {
    if (!latestLeaderboardModels || latestLeaderboardModels.length === 0) {
        alert("No leaderboard entries to export yet.");
        return;
    }
    const cutoffCount = Math.ceil(config.totalStations / 2);
    let csv = "Rank,Leaderboard Handle,Score,Time Seconds,Time Formatted,Cutoff Status\n";
    latestLeaderboardModels.forEach((entry, idx) => {
        const rank = entry.rank || (idx + 1);
        const team = entry.hacker || "Unknown";
        const score = Number(entry.score || 0).toFixed(2);
        const sec = Math.floor(Number(entry.time_taken) || 0);
        const tStr = formatSeconds(sec);
        const status = (idx + 1) <= cutoffCount ? "ADVANCE" : "ELIMINATED";
        csv += `${rank},"${team}",${score},${sec},${tStr},${status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Leaderboard_${config.contestSlug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function copyTabBridgeScript() {
    const slug = document.getElementById('cfgContestSlug').value.trim() || config.contestSlug;
    const snippet = `setInterval(async()=>{const r=await fetch('/rest/contests/${slug}/leaderboard?offset=0&limit=100');const d=await r.json();await fetch('http://localhost:8080/api/push_leaderboard',{method:'POST',body:JSON.stringify({slug:'${slug}',data:d})});console.log('Synced to Stage Matrix:',d.models.length);},6000);`;
    navigator.clipboard.writeText(snippet);
    const btn = document.getElementById('copyBridgeBtn');
    btn.textContent = "Copied! Paste in HR Console (F12)";
    setTimeout(() => { btn.textContent = "Copy Console Bridge Snippet"; }, 3000);
}

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

let isDragging = false;
paneResizer.addEventListener('mousedown', () => {
    isDragging = true;
    paneResizer.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const containerRect = document.getElementById('stageContainer').getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    if (newWidth >= 240 && newWidth <= containerRect.width * 0.65) {
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

function openSpotlight(stationId) {
    spotlightTitle.textContent = `>_ AUDITORIUM FOCUS: ${stationId}`;
    const directStreamUrl = `https://vdo.ninja/?view=${stationId}&autoplay&cleanoutput`;
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

function toggleSettingsDrawer() {
    settingsDrawer.classList.toggle('open');
}

function toggleLeaderboardCollapse() {
    const isHidden = leaderboardViewport.style.display === 'none';
    leaderboardViewport.style.display = isHidden ? 'flex' : 'none';
    paneResizer.style.display = isHidden ? 'flex' : 'none';
}

function applyPreset(count) {
    document.getElementById('cfgTotalStations').value = count;
}

function saveAndApplySettings() {
    const slug = document.getElementById('cfgContestSlug').value.trim();
    const count = parseInt(document.getElementById('cfgTotalStations').value, 10);
    const prefix = document.getElementById('cfgStreamPrefix').value.trim();

    if (slug) config.contestSlug = slug;
    if (count && count > 0) config.totalStations = count;
    if (prefix) config.streamPrefix = prefix;

    buildMatrix();
    fetchLeaderboardNow();
    toggleSettingsDrawer();
}

buildMatrix();
startAutoScroll();
fetchLeaderboardNow();
setInterval(fetchLeaderboardNow, 8000);