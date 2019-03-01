import { Game } from "./Game.js";
Game.generateBlocks();
document.getElementById('record').innerText = String(Game.record);
document.getElementById('gameClickable').addEventListener('click', Game.newGame);
document.addEventListener('keydown', Game.newGame);
document.getElementById('configGear').addEventListener('click', Game.handleConfigClick);
document.getElementById('configForm').addEventListener('submit', Game.handleConfigUpdate);
document.getElementById('configForm').addEventListener('reset', Game.handleConfigReset);
document.getElementById('speedRange').addEventListener('change', Game.handleSpeedChange);
//# sourceMappingURL=main.js.map