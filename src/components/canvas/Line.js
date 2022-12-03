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

export const getIntervalNumber = (min,max)=>{
    return Math.floor(Math.random() * (max-min + 1) +  min )
}

export const getRandomVector = (width)=>{

    let intensity = [-0.3,0,0.3]
	if(width < 600){
		intensity = [-0.1,0,0.1]
	}
    let xval = getIntervalNumber(0,2);
    let yval =getIntervalNumber(0,2);

    return {
        x: intensity[xval],
        y: intensity[yval]
    }
}
export const notes = ["C1",'D','E','F','G','A','B','C2']


const ballOptions = {
	restitution: 1,
	friction: 0,
	frictionAir: 0,
	frictionStatic: 0,
    density: 1,

    render:{
        fillStyle: 'white',
        strokeStyle:'black',
        lineWidth: 1,
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

export const addLine = (world, lineWidth, index, width, height) => {

	const spawnPositionX = getIntervalNumber(width/4, (width/4 * 3))
	const spawnPositionY = getIntervalNumber(height/4, (height/4 * 3))

	let pointA = Bodies.polygon(spawnPositionX - (lineWidth/2),spawnPositionY, 50, 5, {
		...ballOptions,
		...{label: notes[index]}
	});
	let pointB = Bodies.polygon(spawnPositionX + (lineWidth/2),spawnPositionY, 50, 5, {
		...ballOptions,
		...{label: notes[index]}
	});

	let line = Bodies.rectangle(spawnPositionX, spawnPositionY, lineWidth, 1, {
		...rectOptions,
		...{label: notes[index]}
	});

    Composite.add(world, [pointA,pointB,line])

	let boundA = Constraint.create({
		bodyA: pointA,
		bodyB: line,
		length: 0,
		// pointA: 0,
		pointB: { x: -(lineWidth/2 + 5), y: 0 },
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
		pointB: { x: (lineWidth/2 + 5), y: 0 },
		render: {
			strokeStyle: 'transparent',
			lineWidth: 1,
			anchors: false
		}
	});

	Composite.add(world, [boundA, boundB]);
    return line;
};
