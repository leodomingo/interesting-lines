<script>
	// @ts-nocheck
	// @ts-ignore

	import Matter from 'matter-js';
	import Piano from './Piano.svelte';

	import { onMount } from 'svelte';
	import { addLine, getRandomVector } from './Line';
	import uniq from 'lodash/uniq';
	let canvas;

	const lineAmountMax = 9;

	let lines = [];
	let collisions = [];
	let ghostIndex = 0;
	let ghostInterval;
	let innerWidth;
	let innerHeight;
	let showlines = false;
	let canPlay = false;

	const Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Events = Matter.Events,
		MouseConstraint = Matter.MouseConstraint,
		Mouse = Matter.Mouse,
		Composite = Matter.Composite,
		Bodies = Matter.Bodies,
		Body = Matter.Body;

	Matter.Resolver._restingThresh = 0.1; // default is 4

	const handleCollisionStart = (event) => {

		let eventCollisions = event.pairs.map((pair)=>{
			let a_label = pair.bodyA.label;
			let b_label = pair.bodyB.label;
			let labels = uniq([a_label,b_label])

			return {
				id: pair.id,
				labels: labels
			}
		})

		eventCollisions = eventCollisions.filter((collision)=>{
			return collision.labels.length != 1 // && !collision.labels.includes('WALL')
		});

		collisions = [...collisions, ...eventCollisions.flat()]

	};

	const handleCollisionEnd = (event)=>{
		let eventCollisions = event.pairs.map((pair)=>{
			let a_label = pair.bodyA.label;
			let b_label = pair.bodyB.label;
			let labels = uniq([a_label,b_label])

			return {
				id: pair.id,
				labels: labels
			}
		})

		let removeIds = eventCollisions.map((collision)=>{
			return collision.id
		})

		let updatedCollisions = collisions.filter((collision)=>{
			return !removeIds.includes(collision.id);
		})
		collisions =  updatedCollisions.flat();

	}


	let engine = Engine.create(),
		world = engine.world;

	// create renderer
	let render;


	Events.on(engine, 'collisionStart', handleCollisionStart);
	Events.on(engine, 'collisionEnd', handleCollisionEnd)


	const runBounce = () => {
		render = Render.create({
			element: canvas,
			engine: engine,

			options: {
				background: 'transparent',
				width: innerWidth < 800 ? innerWidth : 800,
				height: innerHeight < 600 ? innerHeight : 600,
				showAngleIndicator: false,
				wireframes: false
			}
		});
		// create engine

		world.gravity.x = 0;
		world.gravity.y = 0;
		world.restitution = 1;
		world.fillStyle = 'white';

		Render.run(render);

		// create runner
		let runner = Runner.create();
		Runner.run(runner, engine);

		// add bodies
		let rows = 10,
			yy = 600 - 25 - 40 * rows;

		// let stack = Composites.stack(400, yy, 5, rows, 0, 0, function (x, y) {
		// 	return Bodies.rectangle(x, y, 40, 40);
		// });

		const frictionOptions = {
			isStatic: true,
			restitution: 1,
			inertia: Infinity,
			friction: 0,
			frictionAir: 0,
			frictionStatic: 0,
			density: 2,
			render: {
				fillStyle: 'transparent',
				strokeStyle: 'black',
				lineWidth: 4
			},

		};

		Composite.add(world, [
			// walls
			Bodies.rectangle(innerWidth / 2, -25, innerWidth, 50, {
				...frictionOptions,
				...{ label: 'WALL' }
			}),
			Bodies.rectangle(innerWidth / 2, innerHeight + 25, innerWidth, 50, {
				...frictionOptions,
				...{ label: 'WALL' }
			}),
			Bodies.rectangle(innerWidth +25, innerHeight / 2, 50, innerHeight, {
				...frictionOptions,
				...{ label: 'WALL' }
			}),
			Bodies.rectangle(-25, innerHeight / 2, 50, innerHeight, {
				...frictionOptions,
				...{ label: 'WALL' }
			})
		]);

		let i = 0;

		// adding that first line
		let firstLine = addLine(world, 0, innerWidth, innerHeight);
		let firstPushVector = getRandomVector(innerWidth);
		Body.applyForce(firstLine, { x: 0, y: 0 }, firstPushVector);
		lines = [...lines, firstLine];



		// add mouse control
		let mouse = Mouse.create(render.canvas),
			mouseConstraint = MouseConstraint.create(engine, {
				mouse: mouse,
				constraint: {
					stiffness: 0.2,
					render: {
						visible: false
					}
				}
			});

		Composite.add(world, mouseConstraint);

		// keep the mouse in sync with rendering
		render.mouse = mouse;

		// fit the render viewport to the scene
		Render.lookAt(render, {
			min: { x: 0, y: 0 },
			max: { x: innerWidth < 800 ? innerWidth : 800, y: innerHeight < 600 ? innerHeight : 600 }
		});

		// context for MatterTools.Demo
		return {
			engine: engine,
			runner: runner,
			render: render,
			canvas: render.canvas,
			stop: function () {
				Matter.Render.stop(render);
				Matter.Runner.stop(runner);
			}
		};
	};

	onMount(() => {
		runBounce();
		window.addEventListener('resize', resetCanvas);
		ghostInterval = setInterval(() => {
			ghostIndex = (ghostIndex + 1) % 3;
		}, 3000);
		resetCanvas();

		showlines = true;
		return () => {
			window.removeEventListener('resize', resetCanvas);
			clearInterval(ghostInterval);
		};
	});

	const resetCanvas = () => {
		if (render) {
			render.bounds.max.x = innerWidth;
			render.bounds.max.y = innerHeight;
			render.options.width = innerWidth;
			render.options.height = innerHeight;
			render.canvas.width = innerWidth;
			render.canvas.height = innerHeight;
		}
	};

	$: {
		lines.forEach((line, i) => {

			if (i % (ghostIndex + 1) == 0) {
				Body.set(line, 'isSensor', true);
				let pushVector = getRandomVector(innerWidth);
				Body.applyForce(line, { x: 0, y: 0 }, pushVector);
			} else {
				line.render.fillStyle = 'black';
				Body.set(line, 'isSensor', false);
			}
		});
	}
	$:{
		if(canPlay && lines.length == 1){
				const addLineInterval = setInterval(()=>{
					if(lines.length < lineAmountMax){
						let newLine = addLine(world, lines.length, innerWidth, innerHeight);
						lines = [...lines, newLine];
						let pushVector = getRandomVector(innerWidth);
						Body.applyForce(newLine, { x: 0, y: 0 }, pushVector);
					}else{
						clearInterval(addLineInterval);
					}
				}, 2000)
			
		}
	}




	resetCanvas();

</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Piano {collisions} {canPlay} />
<div
	class="allow-audio"
	class:hidden={canPlay}
	on:click={() => {
		canPlay = true;
	}}
>
	<div>Click anywhere to express the silence</div>
</div>
<img src="lispector.png" alt="connected lines" />
<div class="canvas-wrapper" bind:this={canvas} class:visible={showlines} />

<style>
	@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500&display=swap');

	.allow-audio {
		cursor: crosshair;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		font-family: 'EB Garamond', serif;
		font-size: 5rem;
		transition: opacity ease-in-out 0.5s;
	}
	.allow-audio.hidden {
		opacity: 0;
		pointer-events: none;
		z-index: -1;
	}
	.allow-audio > div {
		padding: 15px;
		margin-left: 45px;
	}
	img {
		max-width: 500px;
		/* position: absolute; */
		z-index: 5;
	}
	@media (max-width: 550px) {
		img {
			max-width: 100%;
		}
		.allow-audio {
			font-size: 1.7rem;
			line-height: 1.5rem;
		}
		.allow-audio > div {
			max-width: calc(100% - 30px);
			margin-bottom: 50px;
			margin-left: 0;
		}
	}
	.canvas-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		transition: opacity ease-in 3s;
	}
	.canvas-wrapper.visible {
		opacity: 1;
	}
</style>
