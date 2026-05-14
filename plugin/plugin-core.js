(function() {
    // 1. Prevent the plugin from loading twice
    if (window.UGP_ACTIVE) return;
    window.UGP_ACTIVE = true;

    console.log("UGP: Plugin Active");

    // 2. Create the HUD (The Visual Interface)
    const hud = document.createElement('div');
    hud.style.cssText = `
        position: fixed; bottom: 15px; right: 15px; 
        background: rgba(0,0,0,0.9); color: #0f0; border: 1px solid #0f0; 
        padding: 8px; z-index: 1000000; font-family: monospace; font-size: 10px;
        box-shadow: 4px 4px 0px #060; pointer-events: none;
    `;
    hud.innerHTML = `
        <div style="border-bottom:1px solid #0f0;margin-bottom:4px">PLUGIN_v1.0</div>
        FPS: <span id="p-fps">00</span><br>
        OBJ: <span id="p-obj">SCANNING</span>
    `;
    document.body.appendChild(hud);

    // 3. Performance Monitor
    let frames = 0, lastTime = performance.now();
    function loop() {
        frames++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
            document.getElementById('p-fps').innerText = frames;
            frames = 0; lastTime = now;
        }
        requestAnimationFrame(loop);
    }
    loop();

    // 4. Game Detection (Look for Canvas)
    const findGame = () => {
        const c = document.querySelector('canvas');
        if (c) {
            document.getElementById('p-obj').innerText = "CANVAS_FOUND";
            document.getElementById('p-obj').style.color = "#fff";
        }
    };
    setInterval(findGame, 2000);

})();