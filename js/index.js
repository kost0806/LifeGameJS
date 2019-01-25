let lifeGame;

function bindEvents() {
    // Components
    let runBtn = $("#runBtn");
    let resetBtn = $("#resetBtn");
    let stopBtn = $("#stopBtn");
    let colorDiv = $("#color");

    // Bind Events
    resetBtn.click((event) => {
        console.log("reset!");
        if (lifeGame.timer != null) {
            stopBtn.trigger("click");
        }

        // Read width, height
        let width = $("#width").val();
        let height = $("#height").val();

        // Read Color
        let rColor = /rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/
        let color = colorDiv.css("background");
        let rgb = color.match(rColor);
        if (rgb.length != 4) {
            color = "#000000";
        }
        else {
            color = "#";
            for (let i = 1; i < 4; ++i) {
                let hex = parseInt(rgb[i]).toString(16);
                if (hex.length == 1) {
                    hex = "0" + hex;
                }
                color += hex;
            }
        }

        // console.log(color);

        // Add new canvas
        lifeGame.setColor(color);
        lifeGame.setSize(width, height);
    });

    runBtn.click((event) => {
        console.log("run!");
        let speed = Number.parseInt($("#speed").val());
        lifeGame.setSpeed(speed);
        runBtn.addClass("hide");
        stopBtn.removeClass("hide");

        lifeGame.saveCells();

        let frame = () => {
            lifeGame.update();
            lifeGame.render();
            lifeGame.timer = setTimeout(frame, lifeGame.speed);
        }

        lifeGame.timer = setTimeout(frame, lifeGame.speed);
    });

    stopBtn.click((event) => {
        console.log("stop");
        clearTimeout(lifeGame.timer);
        lifeGame.timer = null;

        lifeGame.restoreCells();
        lifeGame.render();

        runBtn.removeClass("hide");
        stopBtn.addClass("hide");
    });
}

$(document).ready(function() {
    console.log("ready")
    bindEvents();
    
    lifeGame = new LifeGame($("#width").val(), $("#height").val());
    lifeGame.setSpeed($("#speed").val());
});

