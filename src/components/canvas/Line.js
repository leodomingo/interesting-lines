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
	restitution: 0.8,
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
	const radius = width < 500 ? 4 : 5;
	const randomAngle = getIntervalNumber(1,179);
	let randomWidth =
		width < 500
			? getIntervalNumber(innerWidth / 4,( innerWidth) / 2)
			: getIntervalNumber(innerWidth / 4, (innerWidth  )/ 2);
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

export const checkIsMobile  = () => {
	var check = false;
	(function(a){
	  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
		check = true;
	})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };