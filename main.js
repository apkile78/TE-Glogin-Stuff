// ===============================
// MAIN NAV INITIALIZER
// ===============================

console.log("Navigator initialized");


// ===============================
// PROXY NAVIGATOR LAUNCH BUTTON
// ===============================
// Opens a new window containing proxyNav.html
// Flat structure version (no folders)

document.getElementById("prxBtn").onclick = () => {
    const win = window.open("about:blank", "_blank");

    win.document.write(`
        <html>
        <head>
            <title>Proxy Navigator</title>
            <style>
                body, html { margin:0; padding:0; height:100%; }
                iframe { width:100%; height:100%; border:none; }
            </style>
        </head>
        <body>
            <iframe src="proxyNav.html"></iframe>
        </body>
        </html>
    `);
};
