export class Game {
    static readonly ROWS: number = 12;
    static readonly COLUMNS: number = 7;
    private static _record: number = Number(localStorage.getItem('record'));
    private static gameStarted: boolean = false;
    private finished: boolean;
    private level: number = 0;
    private availableBlocks: number = 3;
    private speed: number = 0.009;
    private intervals: number[] = [];
    private points: number = 0;

    constructor() {
        Game.gameStarted = true;
        this.finished = false;
        this.resetBlocks();
    }

    static get record(): number {
        return this._record;
    }

    static newGame(event: any): void {
        if ((event.which === 1 || event.which === 32) && !Game.gameStarted) {
            let game: Game = new Game();
            game.updateRecord();
            game.updatePoints();
            game.updateMessage();
            game.moveBlocks();
        }
    }

    private updateRecord(): void {
        if (this.points > Game._record) {
            Game._record = this.points;
            localStorage.setItem('record', String(Game._record));
        }
        document.getElementById('record').innerText = String(Game._record);
    }

    private updatePoints(): void {
        document.getElementById('numPoints').innerText = String(this.points);
    }

    private updateMessage(won: boolean = false): void {
        let newMessage: string = '';
        if (this.finished) {
            newMessage = won ? 'You won! 😀' : 'You lost! 😱';
        }
        document.getElementById('message').innerText = newMessage;
    }

    private resetBlocks(): void {
        let blocks: any = document.getElementsByClassName('block');
        for (let block of blocks) {
            block.classList.remove('marked');
            block.classList.remove('wrong');
        }
    }

    private calculateDiv(): number {
        let div: number = Game.COLUMNS;
        switch(this.availableBlocks) {
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

    private checkMove(): void {
        let wrongBlocks: HTMLElement[] = [];
        if (this.level !== 0) {
            let auxAvailableBlocks: number = this.availableBlocks;
            let foundBlocks: number = 0;
            for (let i: number = Game.COLUMNS * this.level; i < Game.COLUMNS * this.level + Game.COLUMNS; i++) {
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
        this.speed *= 1.1;
        this.points = Math.round(50 + 1.1 * this.points);
        this.updatePoints();
        if (this.availableBlocks === 0) {
            this.end(false);
        } else {
            for (let block of wrongBlocks) {
                block.classList.remove('marked');
                block.classList.add('wrong');
            }
            if (this.level === Game.ROWS) {
                this.end(true);
            }
        }
    }

    private moveBlocks(): void {
        let level: number = this.level;
        let availableBlocks: number = this.availableBlocks;
        let div: number = this.calculateDiv();
        let block: number = 0;
        let direction: string = 'left';
        let finished: boolean = this.finished;
        clearInterval(this.intervals[this.level - 1]);
        this.intervals[level] = setInterval(function () {
            if (!finished) {
                if (block % div >= 0 && block % div < Game.COLUMNS) {
                    document.getElementById('block' + (block % div + level * Game.COLUMNS)).classList.add('marked');
                }
                if ((block - availableBlocks) % div >= 0 || (block + availableBlocks) % div >= 0) {
                    let blockToUncolour: number = direction === 'left' && block - availableBlocks >= 0 ? block - availableBlocks : block + availableBlocks;
                    document.getElementById('block' + ((blockToUncolour) % div + level * Game.COLUMNS)).classList.remove('marked');
                }
                if (block % div === Game.COLUMNS - 2 + availableBlocks && direction === 'left') {
                    direction = 'right';
                } else if (block % div == 1 - availableBlocks && direction === 'right') {
                    direction = 'left';
                }
                block = direction === 'left' ? block + 1 : block - 1;
            }
        }, 1 / this.speed);
        let obj: Game = this;
        document.addEventListener('keydown', function (event: any): void {
            obj.stopBlocks(event);
        });
        document.getElementById('gameClickable').addEventListener('click', function (event: any): void {
            obj.stopBlocks(event);
        });
    }

    private stopBlocks(event: any): void {
        if ((event.which === 1 || event.which === 32) && !this.finished) {
            this.checkMove();
            this.moveBlocks();
            event.stopImmediatePropagation();
        }
    }

    private end(won: boolean): void {
        this.finished = true;
        Game.gameStarted = false;
        this.updateMessage(won);
        this.updateRecord();
    }
}