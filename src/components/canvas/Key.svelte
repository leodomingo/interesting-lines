<script>
	// @ts-nocheck
	// @ts-ignore
	import { onDestroy, onMount } from 'svelte';
	import { limits, checkIsMobile } from './Line';
	export let active;
	export let note;
	export let canPlay;
	export let volumeCap;


	let hasPlayed = false;
	let time = 0;
	export let volume;
	let volumeTicker;
	let isMobile;
	let tickInterval = 50;
	let wasPlaying = 0;
	let waitingForPause = false;

	let audioCtrl;

	const fadeKey = () => {
		volumeTicker = setInterval(() => {
			if (!isMobile) {
				if (active && volume < volumeCap) {
					let inc = (volume += 0.05);
					inc = limits(inc, 0, 1);
					volume = inc;
				} else if (!active && volume > 0) {
					let dec = (volume -= 0.05);
					dec = limits(dec, 0, 1);
					volume = dec;
				}
				if (volume == 0) {
					audioCtrl.currentTime = 0;
					audioCtrl.pause();
				} else if (audioCtrl.paused) {
					audioCtrl.play();
				}
				audioCtrl.volume = limits(volume, 0, 1);
			} else {
				audioCtrl.volume = 0.7;
				if (active) {
					audioCtrl.play();
				} else {
					audioCtrl.pause();
				}
			}
		},tickInterval);
	};
	const resetAudio = () => {
		if (audioCtrl.currentTime > 7.5) {
			// console.log("you know what the hell goin on")
			// audioCtrl.currentTime = 0.5;
		}
		time = audioCtrl.currentTime;
	};

	onMount(() => {
		//   audioCtrl.volume = 0;
		audioCtrl.addEventListener('timeupdate', resetAudio);
		isMobile = checkIsMobile();

		if (isMobile) {
			audioCtrl.volume = 0.8;
			tickInterval = 200;
		}

		return () => {
			clearInterval(volumeTicker);
			audioCtrl.removeEventListener('timeupdate', resetAudio);
		};
	});

	$: {
		if (canPlay && !hasPlayed) {
			if (audioCtrl.paused) {
				audioCtrl.volume = 0;
				audioCtrl.play();
			}
			fadeKey();
			hasPlayed = true;
		}
	}

	// $: {
	// 	if (audioCtrl) {
	// 		if (volume == 0) {
	// 			audioCtrl.currentTime = 0.5;
	// 		}
	// 		audioCtrl.volume = limits(volume, 0, 1);
	// 	}
	// }
</script>

<div>
	<audio bind:this={audioCtrl} controls={false} preload="auto" loop>
		<source src="{note}.wav" type="audio/wav" />
		Your browser does not support the audio element.
	</audio>
</div>

<style>
</style>
