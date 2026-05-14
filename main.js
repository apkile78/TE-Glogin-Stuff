// ===============================
// MAIN NAV INITIALIZER
// ===============================

console.log("Navigator initialized");

// Add Ctrl+Q shortcut to quickly toggle UI visibility if hidden
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'q') {
        document.body.classList.toggle('uiHidden');
    }
});
