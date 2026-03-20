// =========================================================
//  GLOBAL ELEMENTS
// =========================================================
const searchContainer = document.getElementById("searchContainer");
const urlInput = document.getElementById("urlInput");
const savedContainer = document.getElementById("savedSites");
const workingContainer = document.getElementById("workingSites");
const viewer = document.getElementById("viewer");
const autoBox = document.getElementById("autocomplete");

const mnuBtn = document.getElementById("openBtn");
const hdeBtn = document.getElementById("hdeBtn");

let embedMode = "iframe";
let popupMode = "about";
let currentUrl = "";
let coreEl = null;

// =========================================================
//  MAIN PAGE LOCK SYSTEM (G → H → J)
// =========================================================
let unlockStage = 0;
let uiUnlocked = false;

const isMainPage =
    !location.href.startsWith("about:blank") &&
    !location.href.startsWith("blob:");

if (isMainPage) {
    document.body.classList.add("locked");
    hideUI(true);
}

document.addEventListener("keydown", e => {
    if (!isMainPage || uiUnlocked) return;

    if (unlockStage === 0 && e.key.toLowerCase() === "g") unlockStage = 1;
    else if (unlockStage === 1 && e.key.toLowerCase() === "h") unlockStage = 2;
    else if (unlockStage === 2 && e.key.toLowerCase() === "j") {
        uiUnlocked = true;
        document.body.classList.remove("locked");
        hideUI(false);
    } else {
        unlockStage = 0;
    }
});

// =========================================================
//  UI HIDE / UNHIDE SYSTEM
// =========================================================
function hideUI(state) {
    if (state) {
        document.body.classList.add("uiHidden");
    } else {
        document.body.classList.remove("uiHidden");
    }
}

hdeBtn.onclick = () => hideUI(true);

mnuBtn.onclick = () => {
    // If UI is hidden → unhide it
    if (document.body.classList.contains("uiHidden")) {
        hideUI(false);
        return;
    }

    // If UI is visible → toggle menu
    if (uiUnlocked) {
        searchContainer.classList.toggle("active");
    }
};

// =========================================================
//  POPUP MODE TOGGLES
// =========================================================
document.getElementById("abtBtn").onclick = () => {
    popupMode = "about";
    abtBtn.classList.add("active");
    blbBtn.classList.remove("active");
};

document.getElementById("blbBtn").onclick = () => {
    popupMode = "blob";
    blbBtn.classList.add("active");
    abtBtn.classList.remove("active");
};

// =========================================================
//  AUTOCOMPLETE
// =========================================================
let autoTimer = null;

urlInput.addEventListener("input", () => {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(runAutocomplete, 80);
});

function runAutocomplete() {
    const val = urlInput.value.toLowerCase();
    autoBox.innerHTML = "";
    if (!val) return;

    for (const site of siteDB) {
        if (
            site.name.toLowerCase().includes(val) ||
            site.url.toLowerCase().includes(val)
        ) {
            const item = document.createElement("div");
            item.className = "autoItem";
            item.textContent = `${site.name} — ${site.url}`;
            item.onclick = () => {
                urlInput.value = site.url;
                autoBox.innerHTML = "";
            };
            autoBox.appendChild(item);
        }
    }
}

// =========================================================
//  EMBED MODE SWITCHING
// =========================================================
document.querySelectorAll(".modeBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".modeBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        embedMode = btn.dataset.mode;
        if (currentUrl) updateViewer(currentUrl);
    });
});

// =========================================================
//  VIEWER
// =========================================================
function updateViewer(url) {
    currentUrl = url;
    if (!url) {
        viewer.innerHTML = "";
        coreEl = null;
        return;
    }

    if (!coreEl) {
        coreEl = document.createElement("iframe");
        coreEl.style.width = "100%";
        coreEl.style.height = "100%";
        coreEl.style.border = "none";
        viewer.innerHTML = "";
        viewer.appendChild(coreEl);
    }

    if (embedMode === "iframe" && coreEl.tagName !== "IFRAME") {
        const newEl = document.createElement("iframe");
        copyCoreProps(coreEl, newEl);
        coreEl.replaceWith(newEl);
        coreEl = newEl;
    } else if (embedMode === "object" && coreEl.tagName !== "OBJECT") {
        const newEl = document.createElement("object");
        copyCoreProps(coreEl, newEl);
        newEl.type = "text/html";
        coreEl.replaceWith(newEl);
        coreEl = newEl;
    } else if (embedMode === "embed" && coreEl.tagName !== "EMBED") {
        const newEl = document.createElement("embed");
        copyCoreProps(coreEl, newEl);
        newEl.type = "text/html";
        coreEl.replaceWith(newEl);
        coreEl = newEl;
    }

    if (embedMode === "iframe" || embedMode === "embed") {
        coreEl.src = url;
    } else {
        coreEl.data = url;
    }
}

function copyCoreProps(oldEl, newEl) {
    newEl.style.cssText = oldEl.style.cssText;
    if (oldEl.src) newEl.src = oldEl.src;
    if (oldEl.data) newEl.data = oldEl.data;
}

// =========================================================
//  BASIC ACTIONS
// =========================================================
function closeSearch() {
    searchContainer.classList.remove("active");
}

function loadSite() {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;
    updateViewer(url);
}

document.addEventListener("keydown", e => {
    if (!uiUnlocked) return;
    if (e.key === "Enter") loadSite();
});

// =========================================================
//  SAVED SITES
// =========================================================
function saveSite() {
    const urlToSave = currentUrl || urlInput.value.trim();
    if (!urlToSave) return;

    const savedSites = JSON.parse(localStorage.getItem("savedSites")) || [];

    if (!savedSites.includes(urlToSave)) {
        savedSites.push(urlToSave);
        localStorage.setItem("savedSites", JSON.stringify(savedSites));
        displaySavedSites();
    }
}

function deleteSite(index) {
    const savedSites = JSON.parse(localStorage.getItem("savedSites")) || [];
    savedSites.splice(index, 1);
    localStorage.setItem("savedSites", JSON.stringify(savedSites));
    displaySavedSites();
}

function displaySavedSites() {
    savedContainer.innerHTML = "";
    const savedSites = JSON.parse(localStorage.getItem("savedSites")) || [];

    savedSites.forEach((site, index) => {
        const item = document.createElement("div");
        item.className = "savedItem";

        const link = document.createElement("span");
        link.className = "link";
        link.textContent = site;

        link.onclick = () => {
            urlInput.value = site;
            searchContainer.classList.remove("active");
        };

        const del = document.createElement("span");
        del.className = "deleteBtn";
        del.textContent = "x";
        del.onclick = e => {
            e.stopPropagation();
            deleteSite(index);
        };

        item.appendChild(link);
        item.appendChild(del);
        savedContainer.appendChild(item);
    });
}
displaySavedSites();

// =========================================================
//  WORKING SITE DETECTION
// =========================================================
let workingSites = [];

function testSite(url) {
    return new Promise(resolve => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;

        let timeout = setTimeout(() => {
            iframe.remove();
            resolve(false);
        }, 2500);

        iframe.onload = () => {
            clearTimeout(timeout);
            iframe.remove();
            resolve(true);
        };

        iframe.onerror = () => {
            clearTimeout(timeout);
            iframe.remove();
            resolve(false);
        };

        document.body.appendChild(iframe);
    });
}

async function detectWorkingSites() {
    workingContainer.innerHTML = "Testing sites...";

    for (const site of siteDB) {
        const ok = await testSite(site.url);
        if (ok) workingSites.push(site.url);
    }

    displayWorkingSites();
}

function displayWorkingSites() {
    workingContainer.innerHTML = "";
    workingSites.forEach(url => {
        const item = document.createElement("div");
        item.className = "savedItem";

        const link = document.createElement("span");
        link.className = "link";
        link.textContent = url;

        link.onclick = () => {
            urlInput.value = url;
            searchContainer.classList.remove("active");
        };

        item.appendChild(link);
        workingContainer.appendChild(item);
    });
}

detectWorkingSites();

// =========================================================
//  POPUP CAPABILITY DISABLING
// =========================================================
function updatePopupCapabilities() {
    const isAboutBlank = location.href.startsWith("about:blank");
    const isBlob = location.href.startsWith("blob:");

    const abtBtn = document.getElementById("abtBtn");
    const blbBtn = document.getElementById("blbBtn");
    const poptBtn = document.getElementById("clckBtn");
    const vewBtn = document.getElementById("vtprBtn");

    abtBtn.classList.remove("disabled");
    blbBtn.classList.remove("disabled");
    poptBtn.classList.remove("disabled");
    vewBtn.classList.remove("disabled");

    if (isAboutBlank || isBlob) {
        abtBtn.classList.add("disabled");
        poptBtn.classList.add("disabled");
        vewBtn.classList.add("disabled");
    }
}

updatePopupCapabilities();

// =========================================================
//  POPUP ENGINES (NO REDIRECT HACKS)
// =========================================================
function openAboutBlank(url) {
    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Viewer</title>
            <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    overflow: hidden;
                }
                iframe {
                    width: 100vw;
                    height: 100vh;
                    border: none;
                    display: block;
                }
            </style>
        </head>
        <body>
            <iframe src="${url}" allow="fullscreen; autoplay; gamepad"></iframe>
        </body>
        </html>
    `);

    win.document.close();
}

function openBlobPopup(url) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Viewer</title>
            <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    overflow: hidden;
                }
                iframe {
                    width: 100vw;
                    height: 100vh;
                    border: none;
                    display: block;
                }
            </style>
        </head>
        <body>
            <iframe src="${url}" allow="fullscreen; autoplay; gamepad"></iframe>
        </body>
        </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
}

// =========================================================
//  POPUP BUTTONS
// =========================================================
function clck() {
    const url = location.href;
    if (popupMode === "about") openAboutBlank(url);
    else openBlobPopup(url);
}

function vtpr() {
    let url = currentUrl || urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;

    if (popupMode === "about") openAboutBlank(url);
    else openBlobPopup(url);
}

// =========================================================
//  BUTTON BINDINGS
// =========================================================
goBtn.onclick = loadSite;
saveBtn.onclick = saveSite;
closeBtn.onclick = closeSearch;
clckBtn.onclick = clck;
vtprBtn.onclick = vtpr;

openBtn.onclick = mnuBtn.onclick; // ensure no override

openBtn.onclick = mnuBtn.onclick; // safety

// Keyboard shortcut for menu toggle
document.addEventListener("keydown", e => {
    if (!uiUnlocked) return;
    if (e.key === "[") searchContainer.classList.toggle("active");
});
