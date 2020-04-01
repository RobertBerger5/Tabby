class Player{
	constructor(tab){
		this.tab=tab;
	}

	/*
		for each measure, asynchronously play all tracks (so the overall song stays in sync)
	*/
	async play(){
		for(var measureN=0;measureN<this.tab.measures.length;measureN++){
			const measure=this.tab.measures[measureN];
			for(var trackN=0;trackN<measure.tracks.length;trackN++){
				new Promise(()=>this.playTrackMeasure(trackN,measure));
			}
			const beat=60/measure.tempo;
			const duration=measure.timeN*beat;
			await sleep(duration); //sleep for the rest of the measure
			//TODO: slight improvement would be to time how long it takes to run the code above and subtract that from how long to wait
		}
	}
	//each track plays this measure in parallel (to make sure they never get too out of sync)
	async playTrackMeasure(trackN,measure){
		//TODO: different volumes for each track?
		console.log("playing measure from track "+trackN);
		const track=this.tab.tracks[trackN];
		const beat=60/measure.tempo; //this many seconds for each note
		for(const note of measure.tracks[trackN]){
			//set up all notes to be played
			var sounds=[];
			for(const pitch of note.notes){
				var sound=new Audio("440hz.mp3");
				sound.preservesPitch=true;
				//var playback=(pitch.string*5+pitch.fret)/10;
				sound.playbackRate=this.getPitch(track,pitch.string,pitch.fret);
				sounds.push(sound);
			}
			//start them at the same time
			for(sound of sounds){
				sound.play();
			}
			//beat=60/tempo		that many seconds for each note of duration timeD
			//so each note is played for ((timeD/noteDuration)*beat) seconds
			//example: 8th notes are played for .25 seconds in 4/4 at 120 bpm
			//beat is 60/120, so each quarter note gets .5 seconds
			//an 8th note is played ((4/8)*.5)=.25 seconds
			const duration=(measure.timeD/note.duration)*beat;
			//wait a bit
			await sleep(duration);
			//end them at the same time
			for(sound of sounds){
				sound.pause();
			}
		}
	}

	getPitch(track,string,fret){
		//TODO: get pitch from track's string tunings, combine with fret number
		//return some amount relative to 440hz? Not super sure how to go about this
		return 1;
	}

}

const sleep=(sec)=>{
	return new Promise(resolve=>setTimeout(resolve,sec*1000));
}
