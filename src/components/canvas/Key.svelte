<script>
	// @ts-nocheck
	// @ts-ignore
     import { getIntervalNumber} from './Line'
	export let active;
	export let note;
    export let canPlay;

	let audioCtrl;

    const play = ()=>{
        audioCtrl.volume = getIntervalNumber(6,10)/10;
        audioCtrl.currentTime = 0.2;
        audioCtrl.play()
    }

    const pause  = ()=>{
        if(audioCtrl.currentTime > 1){
            audioCtrl.volume = 0;
            audioCtrl.currentTime = 0.2;
            audioCtrl.pause()
        }
    }


	$: {

        if(canPlay){
           // active? fadeIn(): fadeOut();
           active? play(): pause();
        }
	}
</script>

<div>

	<audio bind:this={audioCtrl} controls={false} preload="all" loop>
		<source src="{note}.mp3" type="audio/mpeg" />
		Your browser does not support the audio element.
	</audio>
</div>
