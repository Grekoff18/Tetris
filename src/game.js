export default class Game {
	static points = {
		"1": 40,
		"2": 100,
		"3": 300,
		"4": 1200,
	};
	score = 0;
	lines = 19;
	play_field = this.createPlayField(20, 10);

	// Target property
	active_target = this.createTarget();
	next_target = this.createTarget();

	get level() {
		return Math.floor(this.lines * 0.1);
	}

	//Target methods
	moveActiveTargetLeft() {
		this.active_target.x -= 1;

		if (this.hasCollision()) {
			this.active_target.x += 1;
		};
	};

	moveActiveTargetRight() {
		this.active_target.x += 1;

		if (this.hasCollision()) {
			this.active_target.x -= 1;
		};
	};

	moveActiveTargetDown() {
		this.active_target.y += 1;

		if (this.hasCollision()) {
			this.active_target.y -= 1;
			this.lockTarget();
			this.clearLines();
			// const clearedLines = 
			this.updateScore(this.clearLines());
			this.updateTargets();
		};
	};

	rotateTarget() {
		this.rotateBlocks();

		if (this.hasCollision()) {
			this.rotateBlocks(false);
		};
	};

	rotateBlocks(clockwise = true) {
		const blocks = this.active_target.blocks;
		const length = blocks.length;
		const x = Math.floor(length / 2);
		const y = length - 1;

		for (let i = 0; i < x; i++) {
			for (let j = i; j < y - i; j++) {
				const temp = blocks[i][j];
				if (clockwise) {
					blocks[i][j] = blocks[y - j][i];
					blocks[y - j][i] = blocks[y - i][y - j];
					blocks[y - i][y - j] = blocks[j][y - i];
					blocks[j][y - i] = temp;
				} else {
					blocks[i][j] = blocks[j][y - i];
					blocks[j][y - i] = blocks[y - i][y - j];
					blocks[y - i][y - j] = blocks[y - j][i];
					blocks[y - j][i] = temp;
				};
			};
		};
	};

	hasCollision() {
		const {y: targetY, x: targetX, blocks} = this.active_target;

		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (
					blocks[y][x] &&
					((this.play_field[targetY + y] === undefined || this.play_field[targetY + y][targetX + x] === undefined) ||
					this.play_field[targetY + y][targetX + x])
 				) return true;
			};
		};

		return false;
	};

	lockTarget() {
		const {y: targetY, x: targetX, blocks} = this.active_target;
 
		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (blocks[y][x]) {
					this.play_field[targetY + y][targetX + x] = blocks[y][x];
				};
			};
		};
	};

	createPlayField(yLength, xLenght) {
		const playfield = [];

		for (let y = 0; y < yLength; y++) {
			playfield[y] = [];
			
			for (let x = 0; x < xLenght; x++) {
				playfield[y][x] = 0;
			};
		};

		return playfield;
	};

	createTarget() {
		const	formIndex = Math.floor(Math.random() * 7);
		const	formType = "IJLOSTZ"[formIndex];
		const target = {};

		switch (formType) {
			case "I":
				target.blocks = [
					[0, 0, 0, 0],
					[1, 1, 1, 1],
					[0, 0, 0, 0],
					[0, 0, 0, 0],
				];
				break;

			case "J":
				target.blocks = [
					[0, 0, 0],
					[2, 2, 2],
					[0, 0, 2],
				];	
				break;

			case "L":
				target.blocks = [
					[3, 0, 0],
					[3, 0, 0],
					[3, 3, 0],
				];
				break;

			case "O":
				target.blocks = [
					[0, 0, 0, 0],
					[0, 4, 4, 0],
					[0, 4, 4, 0],
					[0, 0, 0, 0],
				];				
				break;
			
			case "S":
				target.blocks = [
					[0, 0, 0],
					[0, 5, 5],
					[5, 5, 0],
				];	
				break;
			
			case "T":
				target.blocks = [
					[0, 0, 0],
					[6, 6, 6],
					[0, 6, 0],
				];	
				break;

			case "Z":
				target.blocks = [
					[0, 0, 0],
					[7, 7, 0],
					[0, 7, 7],
				];
				break;
		
			default:
				throw new Error("Undefined type of figure")
		}
		target.x = Math.floor((10 - target.blocks[0].length) / 2);
		target.y = -1;

		return target;
	};

	getState() {
		const playfield = this.createPlayField(20, 10);
		const {y: targetY, x: targetX, blocks} = this.active_target;

		for (let y = 0; y < this.play_field.length; y++) {
			playfield[y] = [];
			
			for (let x = 0; x < this.play_field[y].length; x++) {
				playfield[y][x] = this.play_field[y][x];
			};
		};

		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (blocks[y][x]) {
					playfield[targetY + y][targetX + x] = blocks[y][x];
				};
			};
		};

		return {
			level: this.level,
			score: this.score,
			lines: this.lines,
			next_target: this.next_target,
			playfield,
		};
	};

	updateTargets() {
		this.active_target = this.next_target;
		this.next_target = this.createTarget();
	};
//!!!!!!!!!!!!!!!!!
	updateScore(clearedLines) {
		if (clearedLines > 0) {
			this.score += Game.points[clearedLines] * (this.level + 1);
			this.lines += clearedLines;
		}
	}

	clearLines() {
		const rows = 20;
		const columns = 10;
		let lines = [];

		for (let y = rows - 1; y >= 0; y--) {
			let numberOfBlocks = 0;

			for (let x = 0; x < columns; x++) {
				if (this.play_field[y][x]) {
					numberOfBlocks += 1;
				};
			};

			if (numberOfBlocks === 0) {
				break;
			} else if (numberOfBlocks < columns) {
				continue;
			} else if (numberOfBlocks === columns) {
				lines.unshift(y);
			}
		};

		for (let index of lines) {
			this.play_field.splice(index, 1);
			this.play_field.unshift(new Array(columns).fill(0));
		};

		return lines.length;
	};
}