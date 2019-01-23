class LifeGame {
    constructor(width, height) {
        console.log("init with", width, height);

        // Initializing variables
        this.blockSize = 20;
        this.canvas = $('<canvas id="gameCanvas">');
        this.cols = Number.parseInt(width);
        this.rows = Number.parseInt(height);
        this.blockBound = [[-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1],[1, 0],[1, 1]];
        this.timer = undefined;

        // Set Canvas
        this.canvasWidth = this.cols * this.blockSize + this.cols + 1;
        this.canvasHeight = this.rows * this.blockSize + this.rows + 1;
        this.canvas.attr("width", this.canvasWidth);
        this.canvas.attr("height", this.canvasHeight);
        this.canvas.appendTo($('section'));
        this.setup();
    }

    setSpeed(speed) {
        this.speed = Number.parseInt(speed);
    }

    setSize(width, height) {
        // Clear Canvas
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.cols = Number.parseInt(width);
        this.rows = Number.parseInt(height);
        this.canvasWidth = this.cols * this.blockSize + this.cols + 1;
        this.canvasHeight = this.rows * this.blockSize + this.rows + 1;
        this.canvas.attr("width", this.canvasWidth);
        this.canvas.attr("height", this.canvasHeight);

        this.setup();
    }

    setup() {
        this.cells = Array(this.cols);
        for (let i = 0; i < this.cols; ++i) {
            this.cells[i] = Array(this.rows);
            for (let j = 0; j < this.rows; ++j) {
                this.cells[i][j] = false
            }
        }

        this.context = this.canvas[0].getContext("2d");
        this.canvas.unbind("click");
        this.canvas.click((event) => {
            let c = Math.floor(event.offsetX / this.blockSize);
            let r = Math.floor(event.offsetY / this.blockSize);

            if (this.cells[c][r]) {
                this.cells[c][r] = false;
            }
            else {
                this.cells[c][r] = true;
            }
            this.render();
        });
        this.render();
    }

    checkCell(col, row) {
        let liveCells = 0;

        for (let bound of this.blockBound) {
            let c = col + bound[0];
            let r = row + bound[1];
            if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                if (this.cells[c][r]) {
                    ++liveCells;
                }
            }
        }

        if (liveCells >= 4) {
            return false;
        }
        else if (liveCells == 3) {
            return true;
        }
        else if (liveCells == 2) {
            return this.cells[col][row];
        }
        else {
            return false;
        }
    }

    update() {
        // Apply Life Game Rule
        // For each cell
        let newCells = Array(this.cols);
        for (let i = 0; i < this.cols; ++i) {
            newCells[i] = Array(this.rows)
            for (let j = 0; j < this.rows; ++j) {
                newCells[i][j] = this.checkCell(i, j);
            }
        }
        this.cells = newCells;
    }

    render() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawGrid();
        this.context.stroke();
    }

    drawGrid() {
        this.context.beginPath();
        for (let i = 0; i < this.cols; ++i) {
            for (let j = 0; j < this.rows; ++j) {
                if (this.cells[i][j]) {
                    this.context.fillRect(i * this.blockSize, j * this.blockSize, this.blockSize, this.blockSize);
                }
                else {
                    this.context.rect(i * this.blockSize, j * this.blockSize, this.blockSize, this.blockSize);
                }
                
            }
        }
    }

    saveCells() {
        this.savedCells = this.cells;
    }

    restoreCells() {
        this.cells = this.savedCells;
    }
}   