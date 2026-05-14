const urlInput = document.getElementById("urlInput");
const viewer = document.getElementById("viewer");

let embedMode = "iframe";
let popupMode = "about";
window.currentUrl = ""; 
let coreEl = null;

// ——————————————————————————————
// EMBED MODE SWITCHING
// ——————————————————————————————
document.querySelectorAll(".modeBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".modeBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        embedMode = btn.dataset.mode;
        if (window.currentUrl) updateViewer(window.currentUrl);
    });
});

// ——————————————————————————————
// VIEWER UPDATE ENGINE
// ——————————————————————————————
function updateViewer(url) {
    window.currentUrl = url;

    if (!url) {
        viewer.innerHTML = "";
        coreEl = null;
        return;
    }

    // Initialize core element if it doesn't exist
    if (!coreEl) {
        coreEl = document.createElement("iframe");
        viewer.innerHTML = "";
        viewer.appendChild(coreEl);
    }

    // Swap tags if mode changed (IFRAME vs OBJECT)
    const targetTag = embedMode === "iframe" ? "IFRAME" : "OBJECT";
    if (coreEl.tagName !== targetTag) {
        const newEl = document.createElement(targetTag.toLowerCase());
        if (targetTag === "OBJECT") newEl.type = "text/html";
        coreEl.replaceWith(newEl);
        coreEl = newEl;
    }

    // Set the source
    if (embedMode === "iframe") {
        coreEl.src = url;
    } else {
        coreEl.data = url;
    }
}

// ——————————————————————————————
// LOADING LOGIC
// ——————————————————————————————
function loadSite() {
    let url = urlInput.value.trim();
    if (!url) return;

    if (!url.startsWith("http")) url = "https://" + url;
    updateViewer(url);
}

document.getElementById("goBtn").onclick = loadSite;

urlInput.addEventListener("keydown", e => {
    if (e.key === "Enter") loadSite();
});

// ——————————————————————————————
// STEALTH POPUP MODES
// ——————————————————————————————
const abtBtn = document.getElementById("abtBtn");
const blbBtn = document.getElementById("blbBtn");

abtBtn.onclick = () => {
    popupMode = "about";
    abtBtn.classList.add("active");
    blbBtn.classList.remove("active");
};

blbBtn.onclick = () => {
    popupMode = "blob";
    blbBtn.classList.add("active");
    abtBtn.classList.remove("active");
};

function launchStealth(targetUrl) {
    const popupHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body, html { margin: 0; padding: 0; background: #000; overflow: hidden; }
                iframe { width: 100vw; height: 100vh; border: none; }
            </style>
        </head>
        <body><iframe src="${targetUrl}"></iframe></body>
        </html>
    `;

    if (popupMode === "about") {
        const win = window.open("about:blank", "_blank");
        if (win) {
            win.document.write(popupHTML);
            win.document.close();
        }
    } else {
        const blob = new Blob([popupHTML], { type: "text/html" });
        window.open(URL.createObjectURL(blob), "_blank");
    }
}

// "popt" button
document.getElementById("clckBtn").onclick = () => {
    launchStealth(window.location.href);
};

// "vew" button
document.getElementById("vtprBtn").onclick = () => {
    let url = window.currentUrl || urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;
    launchStealth(url);
};
