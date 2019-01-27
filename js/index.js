let lifeGame;

function bindEvents() {
    // Components
    let runBtn = $("#runBtn");
    let resetBtn = $("#resetBtn");
    let stopBtn = $("#stopBtn");
    let colorDiv = $("#color");
    let speedInput = $("#speed");
    let blockPage = $("#block");
    let speedBarContainer = $("#speed-bar-container");
    let speedBarBtn = $("#speed-bar-btn");

    // Bind Events
    resetBtn.click((event) => {
        console.log("reset!");
        if (lifeGame.isRunning()) {
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

        lifeGame.start();
    });

    stopBtn.click((event) => {
        console.log("stop");
        lifeGame.stop();

        runBtn.removeClass("hide");
        stopBtn.addClass("hide");
    });

    speedInput.click((event) => {
        speedBarContainer.removeClass("hide");
        blockPage.removeClass("hide");

        let offset = speedInput.offset();
        let top = offset.top + Number.parseInt(speedInput.css("height"));
        let left = offset.left - Number.parseInt(speedBarContainer.css("width")) / 2;
        speedBarContainer.css({
            top : top,
            left : left
        });

        let speedRatio = Number.parseInt(speedInput.val()) / 1950;
        offset = {
            top : 10,
            left : 5 + speedRatio * 270
        }
        speedBarBtn.css(offset);
    });

    speedInput.change((event) => {
        lifeGame.setSpeed(speedInput.val());
    });

    let speedMax = 2000;
    let speedMin = 50;
    speedBarBtn.mousedown((event) => {
        $(document).unbind("mousemove");
        $(document).mousemove((e) => {
            let left = 5;
            let leftMin = 207.125;
            let leftMax = 477.125;
            let realSpeed;
            if (e.pageX <= leftMin) {
                left = 5;
                realSpeed = speedMin;
            }
            else if (e.pageX >= leftMax) {
                left = 275;
                realSpeed = speedMax;
            }
            else {
                left = 5 + e.pageX - leftMin;
                realSpeed = (speedMax - speedMin) * ((e.pageX - leftMin) / (leftMax - leftMin));
            }
            speedBarBtn.css({
                left: left
            })
            speedInput.val(Math.ceil(realSpeed));
            speedInput.trigger("change");
        })
    })
    $(document).mouseup(() => {
        $(document).unbind("mousemove");
    });

    blockPage.click(() => {
        speedBarContainer.addClass("hide");
        blockPage.addClass("hide");
    })
}

$(document).ready(function() {
    console.log("ready")
    bindEvents();
    
    lifeGame = new LifeGame($("#width").val(), $("#height").val());
    lifeGame.setSpeed($("#speed").val());
});