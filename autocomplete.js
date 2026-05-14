const autoBox = document.getElementById("autocomplete");
let autoTimer = null;

// ——————————————————————————————
// INPUT LISTENER
// ——————————————————————————————
urlInput.addEventListener("input", () => {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(runAutocomplete, 80); // 80ms debounce
});

// ——————————————————————————————
// AUTOCOMPLETE ENGINE
// ——————————————————————————————
function runAutocomplete() {
    const val = urlInput.value.toLowerCase();
    autoBox.innerHTML = "";
    
    // Hide box if input is empty
    if (!val) {
        autoBox.style.display = "none";
        return;
    }

    // Filter siteDB (Assumes siteDB is loaded from siteDB.js)
    const matches = siteDB.filter(site => 
        site.name.toLowerCase().includes(val) || 
        site.url.toLowerCase().includes(val)
    );

    if (matches.length > 0) {
        autoBox.style.display = "block";
        
        // Take top 10 matches to keep UI clean
        matches.slice(0, 10).forEach(site => {
            const item = document.createElement("div");
            item.className = "autoItem";
            item.textContent = `${site.name} — ${site.url}`;

            item.onclick = () => {
                urlInput.value = site.url;
                autoBox.style.display = "none";
                updateViewer(site.url); // Triggers the load immediately
            };

            autoBox.appendChild(item);
        });
    } else {
        autoBox.style.display = "none";
    }
}

// Close autocomplete if user clicks elsewhere
document.addEventListener("click", (e) => {
    if (e.target !== urlInput && e.target !== autoBox) {
        autoBox.style.display = "none";
    }
});
