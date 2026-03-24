// ===============================
// MENU + SAVED SITES + UI HIDE
// ===============================

const searchContainer = document.getElementById("searchContainer");
const savedContainer = document.getElementById("savedSites");

// OPEN MENU
document.getElementById("openBtn").onclick = () => {
    searchContainer.classList.toggle("active");
};

// CLOSE MENU
document.getElementById("closeBtn").onclick = () => {
    searchContainer.classList.remove("active");
};

// SAVE SITE
document.getElementById("saveBtn").onclick = () => {
    const urlToSave = currentUrl || urlInput.value.trim();
    if (!urlToSave) return;

    const savedSites = JSON.parse(localStorage.getItem("savedSites")) || [];

    if (!savedSites.includes(urlToSave)) {
        savedSites.push(urlToSave);
        localStorage.setItem("savedSites", JSON.stringify(savedSites));
        displaySavedSites();
    }
};

// DELETE SITE
function deleteSite(index) {
    const savedSites = JSON.parse(localStorage.getItem("savedSites")) || [];
    savedSites.splice(index, 1);
    localStorage.setItem("savedSites", JSON.stringify(savedSites));
    displaySavedSites();
}

// DISPLAY SAVED SITES
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

// UI HIDE SYSTEM
document.getElementById("hdeBtn").onclick = () => {
    document.body.classList.add("uiHidden");
};

document.getElementById("mnuReveal").onclick = () => {
    document.body.classList.remove("uiHidden");
};
