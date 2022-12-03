<script>
	// @ts-nocheck
	// @ts-ignore

	import Matter from 'matter-js';

	import { onMount } from 'svelte';
	let canvas, engine, render;

	let boxA, boxB, ground;

	// module aliases
	var Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Bodies = Matter.Bodies,
		Composite = Matter.Composite;

	onMount(() => {
		// create an engine
		engine = Engine.create();

		// create a renderer
		render = Render.create({
			element: canvas,
			engine: engine
		});

		// create two boxes and a ground
		boxA = Bodies.rectangle(400, 10, 150, 1);
		boxB = Bodies.rectangle(480, 50, 150, 150);
		ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

		// add all of the bodies to the world
		Composite.add(engine.world, [boxA, boxB, ground]);

		// run the renderer
		Render.run(render);

		// create runner
		var runner = Runner.create();

		// run the engine
		Runner.run(runner, engine);
	});
</script>

<div class="canvas-wrapper" bind:this={canvas} >

</div>

<style>
	.canvas-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: calc(100vw - 120px);
		height: calc(100vh - 120px);
	}
</style>
