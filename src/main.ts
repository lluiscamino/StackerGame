import { Game } from "./Game.js";
document.getElementById('start').addEventListener('click', Game.newGame);
document.addEventListener('keydown', Game.newGame);