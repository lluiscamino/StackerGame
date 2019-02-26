import { Game } from "./Game.js";
Game.generateBlocks();
document.getElementById('record').innerText = String(Game.record);
document.getElementById('gameClickable').addEventListener('click', Game.newGame);
document.addEventListener('keydown', Game.newGame);
document.getElementById('configGear').addEventListener('click', Game.handleConfigClick);
document.getElementById('configForm').addEventListener('submit', Game.handleConfigUpdate);
//# sourceMappingURL=main.js.map