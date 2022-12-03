<script>
	// @ts-nocheck
	// @ts-ignore
	export let collisions;
	import Key from './Key.svelte';
	const notes = ['C1', 'D', 'E', 'F', 'G', 'A', 'B', 'C2'];
    export let canPlay;
</script>

<div class="piano-container">
	{#each notes as note, i}
		<Key note={i} active={collisions.includes(note)} {canPlay} />
	{/each}
</div>

<style>
    .piano-container{
        height: 200px;
        position: absolute;
        top:0;
    }

</style>