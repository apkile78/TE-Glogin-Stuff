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
// RENDER ENGINE
// ——————————————————————————————
function updateViewer(url) {
    window.currentUrl = url;
    if (!url) { viewer.innerHTML = ""; coreEl = null; return; }

    if (!coreEl) {
        coreEl = document.createElement("iframe");
        viewer.innerHTML = "";
        viewer.appendChild(coreEl);
    }

    if (embedMode === "js") {
        const doc = coreEl.contentWindow.document;
        doc.open();
        doc.write(`<html><body style="background:#000;color:#fff;font-family:monospace;padding:10px;">
            <script>try{ ${url} }catch(e){ document.write('<span style="color:red">ERR: '+e.message+'</span>'); }<\/script>
        </body></html>`);
        doc.close();
    } else {
        const tag = embedMode === "iframe" ? "IFRAME" : "OBJECT";
        if (coreEl.tagName !== tag) {
            const newEl = document.createElement(tag.toLowerCase());
            if (tag === "OBJECT") newEl.type = "text/html";
            coreEl.replaceWith(newEl);
            coreEl = newEl;
        }
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
// STEALTH POPUPS
// ——————————————————————————————
const abtBtn = document.getElementById("abtBtn");
const blbBtn = document.getElementById("blbBtn");

abtBtn.onclick = () => { popupMode = "about"; abtBtn.classList.add("active"); blbBtn.classList.remove("active"); };
blbBtn.onclick = () => { popupMode = "blob"; blbBtn.classList.add("active"); abtBtn.classList.remove("active"); };

function launchStealth(targetUrl) {
    const html = `<html><body style="margin:0;background:#000;"><iframe src="${targetUrl}" style="width:100vw;height:100vh;border:none;"></iframe></body></html>`;
    if (popupMode === "about") {
        const win = window.open("about:blank", "_blank");
        win.document.write(html); win.document.close();
    } else {
        const blob = new Blob([html], { type: "text/html" });
        window.open(URL.createObjectURL(blob), "_blank");
    }
}

document.getElementById("clckBtn").onclick = () => launchStealth(window.location.href);
document.getElementById("vtprBtn").onclick = () => {
    let url = window.currentUrl || urlInput.value.trim();
    if (url) launchStealth(url.startsWith("http") ? url : "https://" + url);
};
