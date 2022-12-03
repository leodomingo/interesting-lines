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
		if (audioCtrl.paused) {
			audioCtrl.play();
		}
	};

	const pause = () => {
		if (audioCtrl.currentTime > 1) {
			audioCtrl.volume = 0;
			audioCtrl.pause();
            audioCtrl.currentTime = 0.2;
		}
	};

	$: {
		if (canPlay) {
			// active? fadeIn(): fadeOut();
			audioCtrl.volume = volumeCap;
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
