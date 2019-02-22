import { Game } from "./Game.js";

Game.generateBlocks();
document.getElementById('record').innerText = String(Game.record);
document.getElementById('gameClickable').addEventListener('click', Game.newGame);
document.addEventListener('keydown', Game.newGame);
//# sourceMappingURL=main.js.map