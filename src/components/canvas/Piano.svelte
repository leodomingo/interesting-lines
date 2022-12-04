<script>
	// @ts-nocheck
	// @ts-ignore
	import Key from './Key.svelte';
	import uniq from 'lodash/uniq';

	export let collisions = [];
	export let canPlay;

	const notes = ['C1', 'D', 'E', 'F', 'G', 'A', 'B', 'C2'];
	let activeKeys = [];

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
		<Key note={i} active={activeKeys.includes(note)} {canPlay} volumeCap={1 / activeKeys.length} />
	{/each}
</div>

<style>
	.piano-container {
		height: 200px;
		position: absolute;
		top: 0;
	}
</style>
