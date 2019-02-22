export class Game {
    constructor() {
        this.level = 0;
        this.availableBlocks = 3;
        this.speed = 0.009;
        this.intervals = [];
        this.points = 0;
        Game.gameStarted = true;
        this.finished = false;
        this.resetBlocks();
    }
    static get record() {
        return this._record;
    }
    static newGame(event) {
        if ((event.which === 1 || event.which === 32) && !Game.gameStarted) {
            let game = new Game();
            game.updateRecord();
            game.updatePoints();
            game.updateMessage();
            game.moveBlocks();
        }
    }
    updateRecord() {
        if (this.points > Game._record) {
            Game._record = this.points;
            localStorage.setItem('record', String(Game._record));
        }
        document.getElementById('record').innerText = String(Game._record);
    }
    updatePoints() {
        document.getElementById('numPoints').innerText = String(this.points);
    }
    updateMessage(won = false) {
        let newMessage = '';
        if (this.finished) {
            newMessage = won ? 'You won! 😀' : 'You lost! 😱';
        }
        document.getElementById('message').innerText = newMessage;
    }
    resetBlocks() {
        let blocks = document.getElementsByClassName('block');
        for (let block of blocks) {
            block.classList.remove('marked');
            block.classList.remove('wrong');
        }
    }
    calculateDiv() {
        let div = Game.COLUMNS;
        switch (this.availableBlocks) {
            case 3:
                div += 4;
                break;
            case 2:
                div += 2;
                break;
            case 1:
                div += 0;
                break;
        }
        return div;
    }
    checkMove() {
        let wrongBlocks = [];
        if (this.level !== 0) {
            let auxAvailableBlocks = this.availableBlocks;
            let foundBlocks = 0;
            for (let i = Game.COLUMNS * this.level; i < Game.COLUMNS * this.level + Game.COLUMNS; i++) {
                if (document.getElementById('block' + i).classList.contains('marked')) {
                    if (!document.getElementById('block' + (i - Game.COLUMNS)).classList.contains('marked')) {
                        this.availableBlocks--;
                        wrongBlocks.push(document.getElementById('block' + i));
                    }
                    foundBlocks++;
                }
            }
            if (auxAvailableBlocks !== foundBlocks) {
                this.availableBlocks -= auxAvailableBlocks - foundBlocks;
            }
        }
        if (this.level === 2 && this.availableBlocks === 3 || this.level === 7 && this.availableBlocks === 2) {
            this.availableBlocks--;
        }
        this.level++;
        if (this.availableBlocks === 0) {
            this.end(false);
        }
        else {
            this.speed *= 1.1;
            this.points = Math.round(50 + 1.1 * this.points);
            this.updatePoints();
            for (let block of wrongBlocks) {
                block.classList.remove('marked');
                block.classList.add('wrong');
            }
            if (this.level === Game.ROWS) {
                this.end(true);
            }
        }
        console.log(this.speed);
    }
    moveBlocks() {
        let level = this.level;
        let availableBlocks = this.availableBlocks;
        let div = this.calculateDiv();
        let block = 0;
        let direction = 'left';
        let finished = this.finished;
        clearInterval(this.intervals[this.level - 1]);
        this.intervals[level] = setInterval(function () {
            if (!finished) {
                if (block % div >= 0 && block % div < Game.COLUMNS) {
                    document.getElementById('block' + (block % div + level * Game.COLUMNS)).classList.add('marked');
                }
                if ((block - availableBlocks) % div >= 0 || (block + availableBlocks) % div >= 0) {
                    let blockToUncolour = direction === 'left' && block - availableBlocks >= 0 ? block - availableBlocks : block + availableBlocks;
                    document.getElementById('block' + ((blockToUncolour) % div + level * Game.COLUMNS)).classList.remove('marked');
                }
                if (block % div === Game.COLUMNS - 2 + availableBlocks && direction === 'left') {
                    direction = 'right';
                }
                else if (block % div == 1 - availableBlocks && direction === 'right') {
                    direction = 'left';
                }
                block = direction === 'left' ? block + 1 : block - 1;
            }
        }, 1 / this.speed);
        let obj = this;
        document.addEventListener('keydown', function (event) {
            obj.stopBlocks(event);
        });
        document.getElementById('gameClickable').addEventListener('click', function (event) {
            obj.stopBlocks(event);
        });
    }
    stopBlocks(event) {
        if ((event.which === 1 || event.which === 32) && !this.finished) {
            this.checkMove();
            this.moveBlocks();
            event.stopImmediatePropagation();
        }
    }
    end(won) {
        this.finished = true;
        Game.gameStarted = false;
        this.updateMessage(won);
        this.updateRecord();
    }
}
Game.ROWS = 12;
Game.COLUMNS = 7;
Game._record = Number(localStorage.getItem('record'));
Game.gameStarted = false;
//# sourceMappingURL=Game.js.map