// @ts-nocheck
// @ts-ignore

import Matter from 'matter-js';
const groundCollisionCat = 0x0001,
	rectCategory = 0x0002, // red circles
	ballCategory = 0x0004; // yellow circles

const Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Composites = Matter.Composites,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Composite = Matter.Composite,
	Constraint = Matter.Constraint,
	Bodies = Matter.Bodies,
	Body = Matter.Body;

//  const lineWidth = 400

let lineWidth = Math.floor(Math.random() * 201 + 200);

export const getIntervalNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomVector = (width) => {
	let intensity = [-0.3, 0, 0.3];
	if (width < 500) {
		intensity = [-0.05, 0, 0.05];
	}
	let xval = getIntervalNumber(0, 2);
	let yval = getIntervalNumber(0, 2);

	return {
		x: intensity[xval],
		y: intensity[yval]
	};
};
export const notes = ['F', 'C2', 'C1', 'D', 'G', 'C3', 'E', 'B', 'A'];

const ballOptions = {
	restitution: 1,
	friction: 0,
	frictionAir: 0,
	frictionStatic: 0,
	density: 1,

	render: {
		fillStyle: 'transparent',
		strokeStyle: 'transparent',
		lineWidth: 1
	},
	collisionFilter: {
		category: ballCategory,
		mask: ballCategory | groundCollisionCat
	}
};
const rectOptions = {
	restitution: 1,
	friction: 0,
	frictionAir: 0,
	frictionStatic: 0,
	density: 0.7,

	// angle: 0.6,
	render: { fillStyle: 'black' }
};

export const addLine = (world, index, width, height) => {
	const radius = width < 500 ? 1 : 2;
	const randomAngle = getIntervalNumber(1,179);
	let randomWidth =
		width < 500
			? getIntervalNumber(innerWidth / 4,( innerWidth*4) / 5)
			: getIntervalNumber(innerWidth / 4, (innerWidth *3 )/ 4);
	let lineWidth = randomWidth < 450 ? randomWidth : 450;

	const spawnPositionX = getIntervalNumber(width / 5, (width / 5) * 4);
	const spawnPositionY = getIntervalNumber(height / 4, (height / 4) * 3);

	let pointA = Bodies.polygon(spawnPositionX - lineWidth / 2, spawnPositionY, 50, radius, {
		...ballOptions,
		...{ label: notes[index] }
	});
	let pointB = Bodies.polygon(spawnPositionX + lineWidth / 2, spawnPositionY, 50, radius, {
		...ballOptions,
		...{ label: notes[index] }
	});

	let line = Bodies.rectangle(spawnPositionX, spawnPositionY, lineWidth, 1, {
		...rectOptions,
		...{ label: notes[index] }
	});
	Body.setAngle(line, randomAngle );


	Composite.add(world, [pointA, pointB, line]);

	let boundA = Constraint.create({
		bodyA: pointA,
		bodyB: line,
		length: 0,
		// pointA: 0,
		pointB: { x: -(lineWidth / 2 + radius), y: 0 },
		render: {
			strokeStyle: 'transparent',
			lineWidth: 1,
			anchors: false
		}
	});
	let boundB = Constraint.create({
		bodyA: pointB,
		bodyB: line,
		length: 0,
		// pointA: 0,
		pointB: { x: lineWidth / 2 + radius, y: 0 },
		render: {
			strokeStyle: 'transparent',
			lineWidth: 1,
			anchors: false
		}
	});

	Composite.add(world, [boundA, boundB]);
	return line;
};

export const limits = (target, min, max) => {
	if (target < min) {
		return min;
	} else if (target > max) {
		return max;
	}
	return target;
};

export const isBetween = (target, min, max) => {
	if (target > min && target < max) {
		return true;
	}
	return false;
};

export const isNear = (target, number, grace) =>{
	if(target > number + grace){
		return -1
	}else if(target < number - grace ){
		return 1;
	}else{
		return 0;
	}
}