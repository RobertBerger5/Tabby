class Player{
	constructor(tab){
		this.tab=tab;
	}
	play(){
		//beat=60/tempo		that many seconds for each note of duration timeD
		//so each note is played for ((timeD/noteDuration)*beat) seconds
		//example: 8th notes are played for .25 seconds in 4/4 at 120 bpm
		//beat is 60/120, so each quarter note gets .5 seconds
		//an 8th note is played ((4/8)*.5)=.25 seconds
	}
}