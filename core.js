/* CORE LOGIC - uplugin branch */

let embedMode = "iframe"; // Default mode

// Function to switch modes
function setMode(mode) {
    embedMode = mode;
    console.log("Mode set to: " + mode);
    // Visual feedback: remove active class from all, add to current
    document.querySelectorAll('#topBar button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode + 'Btn').classList.add('active');
}

// THE VIEWER ENGINE
function updateViewer(url) {
    window.currentUrl = url;
    const viewer = document.getElementById("viewer");
    if (!url) { viewer.innerHTML = ""; return; }

    viewer.innerHTML = "";
    
    if (embedMode === "js") {
        const coreEl = document.createElement("iframe");
        viewer.appendChild(coreEl);
        const doc = coreEl.contentWindow.document;
        doc.open();
        // This ensures the plugin has a 'body' and 'head' to attach to
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head><style>body{background:#000;color:#fff;margin:0;overflow:hidden;font-family:monospace;}</style></head>
            <body>
                <script>${url}<\/script>
            </body>
            </html>
        `);
        doc.close();
    } else {
        const tag = embedMode === "iframe" ? "iframe" : "object";
        const coreEl = document.createElement(tag);
        
        if (tag === "iframe") {
            // Sandbox helps bypass some security headers
            coreEl.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-scripts allow-same-origin");
            coreEl.src = url;
        } else {
            coreEl.type = "text/html";
            coreEl.data = url;
        }
        
        coreEl.style.width = "100%";
        coreEl.style.height = "100%";
        coreEl.style.border = "none";
        viewer.appendChild(coreEl);
    }
}

// THE PLUGIN INJECTOR (The Bridge)
async function devInject() {
    const frame = document.querySelector("#viewer iframe");
    // If OBJ mode is used, we look for 'object' instead of 'iframe'
    const target = frame || document.querySelector("#viewer object");
    
    if (!target) return alert("Load a site first!");

    try {
        // Fetches your standalone plugin file from your GitHub branch
        const response = await fetch('./plugin/plugin-core.js');
        if (!response.ok) throw new Error("Plugin file not found at ./plugin/plugin-core.js");
        
        const code = await response.text();
        
        // Injecting the code into the viewer's window context
        const win = target.contentWindow || target.data; 
        target.contentWindow.eval(code);
        
        console.log("Plugin Engine Injected Successfully.");
    } catch (e) {
        console.error("Injection error:", e);
        alert("Security Block: This site forbids injection. Try 'JS' or 'OBJ' mode.");
    }
}

// Event Listeners for Buttons
document.getElementById("ifrBtn").onclick = () => setMode("iframe");
document.getElementById("jsBtn").onclick = () => setMode("js");
document.getElementById("objBtn").onclick = () => setMode("object");
document.getElementById("plgBtn").onclick = devInject; // Link the PLG button

document.getElementById("goBtn").onclick = () => {
    const url = document.getElementById("urlInput").value;
    updateViewer(url);
};