export default class Game {
	score = 0;
	lines = 0;
	level = 0;
	play_field = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	];

	// Target property
	active_target = {
		x: 0,
		y: 0,
		get blocks() {
			return this.rotations[this.rotationIndex];
		},
		rotationIndex: 0,
		rotations: [
			[
				[0, 1, 0],
				[1, 1, 1],
				[0, 0, 0],
			],
			[
				[0, 1, 0],
				[0, 1, 1],
				[0, 1, 0],
			],
			[
				[0, 0, 0],
				[1, 1, 1],
				[0, 1, 0],
			],
			[
				[0, 1, 0],
				[1, 1, 0],
				[0, 1, 0],
			],
		],
	};

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
		};
	};

	rotateTarget() {
		this.active_target.rotationIndex = this.active_target.rotationIndex < 3 ? this.active_target.rotationIndex + 1 : 0;

		if (this.hasCollision()) {
			this.active_target.rotationIndex = this.active_target.rotationIndex > 0 ? this.active_target.rotationIndex - 1 : 3;
		}

		return this.active_target.blocks;
	};

	hasCollision() {
		const {x: targetX, y: targetY, blocks} = this.active_target;

		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (
					// check if there is a block in our picture
					blocks[y][x] &&
					// check if the block goes out of the playing field
					((this.play_field[targetY + y] === undefined || this.play_field[targetY + y][targetX + x] === undefined) ||
					// check if the field has free place
					this.play_field[targetY + y][targetX + x])
 				) return true;
			};
		};

		return false;
	};

	lockTarget() {
		const {x: targetX, y: targetY, blocks} = this.active_target;
 
		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (blocks[y][x]) this.play_field[targetY + y][targetX + x] = blocks[y][x];
			};
		};
	};
	
}