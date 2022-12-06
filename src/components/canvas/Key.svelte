<script>
	// @ts-nocheck
	// @ts-ignore
	import { onDestroy, onMount } from 'svelte';
	import { limits } from './Line';
	export let active;
	export let note;
	export let canPlay;
	export let volumeCap;

    let hasPlayed = false;

	export let volume;
    let volumeTicker;




	let audioCtrl;


    const fadeKey = ()=>{
        if(audioCtrl.paused){
            audioCtrl.play();
        }
         volumeTicker =  setInterval(() => {
            if(active && volume < volumeCap){
                let inc = volume +=0.05
                    inc = limits(inc,0,1)
					volume = inc;
            }else if(!active && volume > 0) {
                let dec = volume -=0.05
                    dec = limits(dec,0,1)
					volume = dec;
            }
        },50);
    }

    const resetAudio = ()=>{
        if(audioCtrl.currentTime > 7){
                audioCtrl.currentTime = 0;
            }
    }

    onMount(() => {
     //   audioCtrl.volume = 0;
        audioCtrl.addEventListener('timeupdate',resetAudio);

        return ()=>{
            clearInterval(volumeTicker);
            audioCtrl.removeEventListener('timeupdate', resetAudio)
        }

    });


	$: {
		if (canPlay) {
            fadeKey();
            hasPlayed = true;
		}
	}

	$: {
		if (audioCtrl) {
            if(volume == 0){
                audioCtrl.currentTime = 0.5;
            }
			audioCtrl.volume = limits(volume, 0, 1);
		}
	}

</script>

<div>
	<audio bind:this={audioCtrl} controls={false} preload="all" loop>
		<source src="{note}.wav" type="audio/mpeg" />
		Your browser does not support the audio element.
	</audio>
</div>



<style>

</style>
