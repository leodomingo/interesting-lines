<script>
	// @ts-nocheck
	// @ts-ignore
	import { getIntervalNumber } from './Line';
	export let active;
	export let note;
	export let canPlay;
	export let volumeCap;

	let audioCtrl;

	const play = () => {
        audioCtrl.volume = volumeCap;
        audioCtrl.currentTime = 0.5;
		// if (audioCtrl.paused) {
		// 	audioCtrl.play();
		// }
	};

	const pause = () => {
		if (audioCtrl.currentTime > 1) {
			audioCtrl.volume = 0;
			// audioCtrl.pause();
            // audioCtrl.currentTime = 0;
		}
	};

	$: {
		if (canPlay && active) {
            audioCtrl.play();
			active ? play() : pause();
		}
	}
</script>

<div>
	<audio bind:this={audioCtrl} controls={false} preload="all" loop>
		<source src="{note}.mp3" type="audio/mpeg" />
		Your browser does not support the audio element.
	</audio>
</div>
<style>
    audio{
        transition: all ease-in-out 0.3s;
    }
</style>
