export class Game {
    static readonly ROWS: number = 12;
    static readonly COLUMNS: number = 7;
    private static gameStarted: boolean = false;
    private finished: boolean;
    private level: number = 0;
    private availableBlocks: number = 3;
    private speed: number = 0.012;
    private intervals: number[] = [];

    constructor() {
        Game.gameStarted = true;
        this.finished = false;
        this.resetBlocks();
    }

    static newGame(event: any): void {
        if ((event.which === 1 || event.which === 32) && !Game.gameStarted) {
            document.getElementById('go').innerText = 'Hit!';
            let game: Game = new Game();
            game.moveBlocks();
        }
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
        clearInterval(this.intervals[this.level-1]);
        this.intervals[level] = setInterval(function() {
            if (block%div >= 0 && block%div < Game.COLUMNS) {
                document.getElementById('block' + (block % div + level*Game.COLUMNS)).classList.add('marked');
            }
            if ((block - availableBlocks) % div >= 0 || (block + availableBlocks) % div >= 0) {
                let blockToUncolour = direction === 'left' && block - availableBlocks >= 0 ? block - availableBlocks : block + availableBlocks;
                document.getElementById('block' + ((blockToUncolour) % div + level*Game.COLUMNS)).classList.remove('marked');
            }
            if (block%div === Game.COLUMNS - 2 + availableBlocks  && direction === 'left') {
                direction = 'right';
            } else if (block%div == 1 - availableBlocks && direction === 'right') {
                direction = 'left';
            }
            block = direction === 'left' ? block+1 : block-1;
        }, 1/this.speed);
            let obj: Game = this;
            document.addEventListener('keydown', function(event: any): void {
                obj.stopBlocks(event);
            });
            document.getElementById('go').addEventListener('click', function(event: any): void {
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
        alert(won ? 'You won!' : 'You lost!');
        document.getElementById('go').innerText = 'Play again!';
    }
}