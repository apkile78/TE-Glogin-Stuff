// ===============================
// AUTOCOMPLETE SYSTEM
// ===============================

const autoBox = document.getElementById("autocomplete");
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
