<script>
	// @ts-nocheck
	// @ts-ignore
	import Key from './Key.svelte';
	import uniq from 'lodash/uniq';
    import {limits} from './Line'

	export let collisions = [];
	export let canPlay;

	const notes = ['C1', 'D', 'E', 'F', 'G', 'A', 'B', 'C2', 'C3'];
    const volumes = [0,0,0,0,0,0,0,0,0];

	let activeKeys = [];

    let volumeCap = 1;

    $:{
        let ratio = 1 / activeKeys.length;
        volumeCap = limits(ratio, 0,1);

    }

	$: {
		activeKeys = uniq(
			collisions
				.map((collision) => {
					return collision.labels;
				})
				.flat()
		);
	}
</script>

<div class="piano-container">
	{#each notes as note, i}
		<Key note={i} key={note} bind:volume={volumes[i]}  active={activeKeys.includes(note)} {canPlay} volumeCap={volumeCap} />
	
        <div class="volume-marker" style="right: {15 * i}px; ">
            {volumes[i]}
            <div style="height:{(volumes[i]) * 100}%" >
            </div>
        </div>
    {/each}
   
</div>

<style>
	.piano-container {
		height: 200px;
        left: 15px;
        width: calc(100% - 30px);
		position: absolute;
		bottom: 0;
	}

    .volume-marker {
		position: absolute;
		height: 100%;
		width: 15px;
		bottom: 0px;
        background-color: magenta;

	}
	.volume-marker > div {
		width: 100%;
		height: 50px;
		position: absolute;
		bottom: 0;
         border: solid 1px white;
        background-color: rgba(0, 0, 0, 1);
        margin-right: 1px;
		/* background-color: rgba(0, 0, 0, 0.05); */
	}

	.volume-marker > div.dec {
		background-color: red;
	}
	.volume-marker > div.inc {
		background-color: green;
	}
</style>
