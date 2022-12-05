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

	let isFadingOut = false;
	let isFadingIn = false;
    let volumeTicker;



	let time = 0;

	let audioCtrl;


    const fadeKey = ()=>{
         volumeTicker =  setInterval(() => {
            if(active && volume < volumeCap){
                let inc = volume +=0.01
                    inc = limits(inc,0,1)
					volume = inc;
            }else if(!active && volume > 0) {
                let dec = volume -=0.01
                    dec = limits(dec,0,1)
					volume = dec;
            }else{
            //    console.log("not doing anything good god")
            }
        },25);

    }


    onMount(() => {
        audioCtrl.volume = 0;
        audioCtrl.addEventListener('timeupdate', () => {
            if(audioCtrl.currentTime > 7){
                console.log("new shit new shit!")
                audioCtrl.currentTime = 0;
            }
        });


    });

    onDestroy(()=>{
        clearInterval(volumeTicker);
    })

	$: {
		if (canPlay && !hasPlayed) {
			audioCtrl.play();
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
