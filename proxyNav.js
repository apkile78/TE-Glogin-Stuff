// ===============================
// PROXY NAVIGATOR CORE LOGIC
// ===============================

// Elements
const urlInput = document.getElementById("urlInput");
const iframe = document.getElementById("view");
const autoBox = document.getElementById("autocomplete");

// Storage key (separate from main navigator)
const STORAGE_KEY = "savedSites_proxy";

// Load saved sites (if any)
let savedSites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");


// ===============================
// PROXY URL REWRITING
// ===============================

function toProxyURL(raw) {
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
        raw = "https://" + raw;
    }

    // Visible proxy URL model
    return `http://localhost:8080/proxy?url=${encodeURIComponent(raw)}`;
}


// ===============================
// GO BUTTON
// ===============================

document.getElementById("goBtn").onclick = () => {
    const raw = urlInput.value.trim();
    if (!raw) return;

    const proxied = toProxyURL(raw);
    iframe.src = proxied;
};


// ===============================
// SAVE BUTTON
// ===============================

document.getElementById("saveBtn").onclick = () => {
    const raw = urlInput.value.trim();
    if (!raw) return;

    savedSites.push(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSites));

    alert("Saved to proxy sites");
};


// ===============================
// AUTOCOMPLETE (same system as main nav)
// ===============================

let autoTimer = null;

urlInput.addEventListener("input", () => {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(runAutocomplete, 80);
});

function runAutocomplete() {
    const val = urlInput.value.toLowerCase();
    autoBox.innerHTML = "";
    if (!val) return;

    // Uses the same siteDB as main nav (global)
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
