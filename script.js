import Game from './src/game.js';
import View from './src/view.js';

const root = document.querySelector('.root');

const game = new Game();
const view = new View(root, 480, 640, 20, 10);

window.game = game;
window.view = view;

document.addEventListener("keydown", event => {
	switch (event.code) {
		case "ArrowUp":
			game.rotateTarget();
			view.render(game.getState());
			break;

		case "ArrowDown":
			game.moveActiveTargetDown();
			view.render(game.getState());
			break;

		case "ArrowLeft":
			game.moveActiveTargetLeft();
			view.render(game.getState());
			break;

		case "ArrowRight":
			game.moveActiveTargetRight();
			view.render(game.getState());
			break;
	}
});

view.render(game.getState());
