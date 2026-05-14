const urlInput = document.getElementById("urlInput");
const viewer = document.getElementById("viewer");

let embedMode = "iframe";
let popupMode = "about";
window.currentUrl = ""; 
let coreEl = null;

// ——————————————————————————————
// MODE SWITCHING
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
// RENDER ENGINE (Updated for Auth Fix)
// ——————————————————————————————
function updateViewer(url) {
    window.currentUrl = url;
    if (!url) { viewer.innerHTML = ""; coreEl = null; return; }

    const tag = embedMode === "iframe" ? "IFRAME" : (embedMode === "object" ? "OBJECT" : "IFRAME");
    
    if (!coreEl || coreEl.tagName !== tag) {
        coreEl = document.createElement(tag.toLowerCase());
        if (tag === "OBJECT") coreEl.type = "text/html";
        viewer.innerHTML = "";
        viewer.appendChild(coreEl);
    }

    // FIX: sandbox and allow attributes enable Google Sign-In popups and session saving
    // allow-popups-to-escape-sandbox is the critical flag for Hordes.io login
    coreEl.setAttribute('sandbox', 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-storage-access-by-user-activation');
    coreEl.setAttribute('allow', 'cross-origin-isolated; autoplay; encrypted-media; fullscreen; clipboard-read; clipboard-write');

    if (embedMode === "js") {
        const doc = coreEl.contentWindow.document;
        doc.open();
        doc.write(`<html><body style="background:#000;color:#fff;font-family:monospace;padding:10px;">
            <script>try{ ${url} }catch(e){ document.write('<span style="color:red">ERR: '+e.message+'</span>'); }<\/script>
        </body></html>`);
        doc.close();
    } else {
        if (embedMode === "iframe") coreEl.src = url;
        else coreEl.data = url;
    }
}

function loadSite() {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith("http") && embedMode !== "js") url = "https://" + url;
    updateViewer(url);
}

document.getElementById("goBtn").onclick = loadSite;
urlInput.onkeydown = e => { if (e.key === "Enter") loadSite(); };

// ——————————————————————————————
// STEALTH POPUPS (Updated for Auth Fix)
// ——————————————————————————————
const abtBtn = document.getElementById("abtBtn");
const blbBtn = document.getElementById("blbBtn");

abtBtn.onclick = () => { popupMode = "about"; abtBtn.classList.add("active"); blbBtn.classList.remove("active"); };
blbBtn.onclick = () => { popupMode = "blob"; blbBtn.classList.add("active"); abtBtn.classList.remove("active"); };

function launchStealth(targetUrl) {
    // Note: We use win.location.href instead of document.write to ensure
    // the window has a real 'Origin', which Google requires for login
    const win = window.open("about:blank", "_blank");
    if (win) {
        win.location.href = targetUrl;
    } else {
        alert("Popup blocked! Please allow popups for this site.");
    }
}

document.getElementById("clckBtn").onclick = () => { if (window.currentUrl) launchStealth(window.currentUrl); };
document.getElementById("vtprBtn").onclick = () => {
    let url = window.currentUrl || urlInput.value.trim();
    if (url) launchStealth(url.startsWith("http") ? url : "https://" + url);
};
