const searchContainer = document.getElementById("searchContainer");
const urlInput = document.getElementById("urlInput");
const savedContainer = document.getElementById("savedSites");
const workingContainer = document.getElementById("workingSites");
const viewer = document.getElementById("viewer");
const autoBox = document.getElementById("autocomplete");

let embedMode = "iframe";
let popupMode = "about";
let currentUrl = "";
let coreEl = null;

// MENU TOGGLE
openBtn.onclick = () => {
    searchContainer.classList.toggle("active");
};

// AUTOCOMPLETE
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

// EMBED MODE SWITCHING
document.querySelectorAll(".modeBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".modeBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        embedMode = btn.dataset.mode;
        if (currentUrl) updateViewer(currentUrl);
    });
});

// VIEWER
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

// BASIC ACTIONS
function loadSite() {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;
    updateViewer(url);
}

goBtn.onclick = loadSite;

document.addEventListener("keydown", e => {
    if (e.key === "Enter") loadSite();
});

// SAVED SITES
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

saveBtn.onclick = saveSite;

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

// POPUP MODE
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

// POPUP BUTTONS
clckBtn.onclick = () => {
    const url = location.href;
    if (popupMode === "about") window.open(url, "_blank");
    else {
        const blob = new Blob([`<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`], { type: "text/html" });
        window.open(URL.createObjectURL(blob), "_blank");
    }
};

vtprBtn.onclick = () => {
    let url = currentUrl || urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;

    if (popupMode === "about") window.open(url, "_blank");
    else {
        const blob = new Blob([`<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`], { type: "text/html" });
        window.open(URL.createObjectURL(blob), "_blank");
    }
};

// CLOSE MENU
closeBtn.onclick = () => searchContainer.classList.remove("active");
