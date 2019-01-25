let lifeGame;

function bindEvents() {
    // Components
    let runBtn = $("#runBtn");
    let resetBtn = $("#resetBtn");
    let stopBtn = $("#stopBtn");

    // Bind Events
    resetBtn.click((event) => {
        console.log("reset!");
        stopBtn.trigger("click");

        // Read width, height
        let width = $("#width").val();
        let height = $("#height").val();

        // Add new canvas
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

