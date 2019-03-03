export class Game {
    constructor() {
        this.level = 0;
        this.availableBlocks = 3;
        this.speed = 0.009 * Game.speedPercentage;
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
            Game.audio.loop = true;
            Game.audio.volume = Game.musicVolume;
            Game.audio.play();
            let game = new Game();
            game.updateRecord();
            game.updatePoints();
            game.updateMessage();
            game.moveBlocks();
        }
    }
    static changeBackgroundColor() {
        let blocks = document.getElementsByClassName('block');
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].style.backgroundColor = Game.backgroundColor + '99';
            blocks[i].style.borderColor = Game.backgroundColor;
        }
        document.getElementById('info').style.backgroundColor = Game.backgroundColor;
    }
    static updateDefaultConfigValues() {
        document.querySelector('#configForm .info').style.display = 'none';
        document.getElementById('speedRange').value = String(Game.speedPercentage * Number(document.getElementById('speedRange').max));
        document.getElementById('bgColor').value = Game.backgroundColor;
        document.getElementById('musicVolume').value = String(Game.musicVolume * Number(document.getElementById('musicVolume').max));
        document.getElementById('effectsVolume').value = String(Game.effectsVolume * Number(document.getElementById('effectsVolume').max));
    }
    static handleSpeedChange() {
        document.querySelector('#configForm .info').style.display = 'block';
    }
    static handleConfigReset(event) {
        document.getElementById('speedRange').defaultValue = '100';
        document.getElementById('bgColor').defaultValue = Game.DEFAULT_BLOCK_COLOR;
        document.getElementById('musicVolume').defaultValue = '80';
        document.getElementById('effectsVolume').defaultValue = '100';
    }
    static handleConfigUpdate(event) {
        event.preventDefault();
        let speedRange = Number(document.getElementById('speedRange').value) / Number(document.getElementById('speedRange').max);
        let bgColor = document.getElementById('bgColor').value;
        let musicVolume = Number(document.getElementById('musicVolume').value) / Number(document.getElementById('musicVolume').max);
        let effectsVolume = Number(document.getElementById('effectsVolume').value) / Number(document.getElementById('effectsVolume').max);
        if (bgColor.toUpperCase() === '#FFFFFF' || bgColor.toUpperCase() === '#FEFFFF') {
            bgColor = '#000000';
        }
        localStorage.setItem('bgColor', bgColor);
        Game.backgroundColor = bgColor;
        localStorage.setItem('speedPercentage', String(speedRange));
        Game.speedPercentage = speedRange;
        localStorage.setItem('musicVolume', String(musicVolume));
        Game.musicVolume = musicVolume;
        localStorage.setItem('effectsVolume', String(effectsVolume));
        Game.effectsVolume = effectsVolume;
        Game.audio.volume = Game.musicVolume;
        Game.changeBackgroundColor();
        Game.handleConfigClick();
    }
    static handleConfigClick() {
        Game.updateDefaultConfigValues();
        let configBlock = document.getElementById('configForm');
        let displayValue = Game.configFormOpen ? 'none' : 'block';
        configBlock.style.display = displayValue;
        Game.configFormOpen = !Game.configFormOpen;
    }
    static generateBlocks() {
        let numBlocks = 0;
        let gameClickable = document.getElementById('gameClickable');
        for (let i = 0; i < Game.ROWS; i++) {
            let blockGroup = document.createElement('div');
            blockGroup.classList.add('block-group');
            blockGroup.id = 'group' + i;
            gameClickable.prepend(blockGroup);
            for (let j = 0; j < Game.COLUMNS; j++) {
                var block = document.createElement('div');
                block.classList.add('block');
                block.id = 'block' + numBlocks;
                blockGroup.prepend(block);
                numBlocks++;
            }
            block.classList.add('first-block');
        }
        let game = document.getElementById('gameContainer');
        let blockInfoGroup = document.createElement('div');
        blockInfoGroup.classList.add('block-group');
        blockInfoGroup.id = 'info';
        blockInfoGroup.innerHTML = 'Points: <span id="numPoints">0</span> | Record: <span id="record"></span><img src="images/settings.png" id="configGear"><span id="message"></span>';
        game.prepend(blockInfoGroup);
        Game.changeBackgroundColor();
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
        let soundNotification;
        if (this.availableBlocks === 0) {
            soundNotification = new Audio('sounds/lose.wav');
            this.end(false);
        }
        else {
            this.speed *= 1.1;
            this.points = Math.round(50 * Game.speedPercentage + 1.1 * this.points);
            this.updatePoints();
            for (let block of wrongBlocks) {
                block.classList.remove('marked');
                block.classList.add('wrong');
            }
            if (this.level === Game.ROWS) {
                soundNotification = new Audio('sounds/win.wav');
                this.end(true);
            } else {
                soundNotification = new Audio('sounds/bleep.wav');
            }
        }
        soundNotification.volume = Game.effectsVolume;
        soundNotification.play();
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
        Game.audio.pause();
        this.finished = true;
        Game.gameStarted = false;
        this.updateMessage(won);
        this.updateRecord();
    }
}
Game.ROWS = 12;
Game.COLUMNS = 7;
Game.DEFAULT_BLOCK_COLOR = '#1555b6';
Game._record = Number(localStorage.getItem('record'));
Game.gameStarted = false;
Game.configFormOpen = false;
Game.audio = new Audio('sounds/loop.wav');
Game.backgroundColor = localStorage.getItem('bgColor') !== null ? localStorage.getItem('bgColor') : Game.DEFAULT_BLOCK_COLOR;
Game.speedPercentage = localStorage.getItem('speedPercentage') !== null ? Number(localStorage.getItem('speedPercentage')) : 1;
Game.musicVolume = localStorage.getItem('musicVolume') !== null ? Number(localStorage.getItem('musicVolume')) : 0.8;
Game.effectsVolume = localStorage.getItem('effectsVolume') !== null ? Number(localStorage.getItem('effectsVolume')) : 1;
//# sourceMappingURL=Game.js.map