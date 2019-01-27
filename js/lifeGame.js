class LifeGame {
    /**
     * Constructor of {LifeGame}.  
     * When this class is initialized, this class makes HTML canvas.
     * @param {string} width 
     * @param {string} height 
     */
    constructor(width, height) {
        // Initializing variables
        this.blockSize = 20; // size of each cell
        this.canvas = $('<canvas id="gameCanvas">'); // game board
        this.context = this.canvas[0].getContext("2d");
        // blockBound is used for check bound of each cell
        this.blockBound = [[-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1],[1, 0],[1, 1]];
        this.timer = null; // null means game is not running.
        this.speed = 500; // Default speed is 500ms

        // Set Canvas
        this.canvas.appendTo($("section"));
        this.setSize(width, height);
    }

    /**
     * Change color to {color}
     * @param {string} color #FFFFFF format.
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Setter of {this.speed}  
     * {this.speed} has 500ms as default value.
     * @param {string} speed value of speed(ms)
     */
    setSpeed(speed) {
        this.speed = Number.parseInt(speed);
    }

    /**
     * Change game size.
     * @param {string} width columnm of game board
     * @param {string} height rows of game board
     */
    setSize(width, height) {
        // Clear Canvas
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        this.cols = Number.parseInt(width);
        this.rows = Number.parseInt(height);
        this.canvasWidth = this.cols * this.blockSize + this.cols + 1;
        this.canvasHeight = this.rows * this.blockSize + this.rows + 1;
        this.canvas.attr("width", this.canvasWidth);
        this.canvas.attr("height", this.canvasHeight);

        this.setup();
    }

    /**
     * Initialize game before start.
     */
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

    /**
     * Check the cell status.  
     * Apply the Conway's life game rule.  
     * If you want to change rule, override this method.
     * @param {number} col coordinate of column
     * @param {number} row coordinate of row
     * @return {boolean} false neighbor >= 4 or == 2(when cell is dead) or < 2
     * @return {boolean} true neighbor == 3 or == 2(when cell is alived)
     */
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

    /**
     * Update game status per each frame.
     */
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

    /**
     * Render canvas per each frame.
     */
    render() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = this.color;
        this.context.strokeStyle = "#ababab";
        this.drawGrid();
        this.context.stroke();
    }

    /**
     * Draw grid board.  
     * Board is consist of cells.
     */
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

    /**
     * Save previous status of cells.
     */
    saveCells() {
        this.savedCells = this.cells;
    }

    /**
     * Restore previous status of cells.
     */
    restoreCells() {
        this.cells = this.savedCells;
    }

    /**
     * Start game.
     */
    start() {
        let frame = () => {
            this.update();
            this.render();
            this.timer = setTimeout(frame, this.speed);
        }

        this.saveCells();
        this.timer = setTimeout(frame, this.speed);
    }

    /**
     * Stop the game.
     */
    stop() {
        clearTimeout(this.timer);
        this.timer = null;

        this.restoreCells();
        this.render();
    }

    /**
     * Returns whether the game is in progress or not
     * @return boolean
     */
    isRunning() {
        return this.timer != null;
    }
}   