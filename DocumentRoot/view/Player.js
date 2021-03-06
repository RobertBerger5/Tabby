class Player {
	static notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; //so we can iterate through em to find the right pitches

	static frequencies = { //all frequencies of every possible note, courtesy of https://gist.github.com/marcgg/94e97def0e8694f906443ed5262e9cbb
		'C0': 16.35, 'C#0': 17.32, 'Db0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'Eb0': 19.45, 'E0': 20.60, 'F0': 21.83, 'F#0': 23.12, 'Gb0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'Ab0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'Bb0': 29.14, 'B0': 30.87,
		'C1': 32.70, 'C#1': 34.65, 'Db1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'Eb1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'Gb1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'Ab1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'Bb1': 58.27, 'B1': 61.74,
		'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,
		'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
		'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
		'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25, 'E5': 659.26, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
		'C6': 1046.50, 'C#6': 1108.73, 'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'Ab6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53,
		'C7': 2093.00, 'C#7': 2217.46, 'Db7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'Eb7': 2489.02, 'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'Gb7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'Ab7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'Bb7': 3729.31, 'B7': 3951.07,
		'C8': 4186.01
	}
	//TODO: why does chrome still say audio is playing at the top? all notes should've been stopped.
	constructor(tab) {
		this.tab = tab;
		this.playing = false;
		//set up audiocontext
		this.context = new AudioContext();

		//for more complex waves than just sines
		let real = [];
		let imag = [];
		for (let i = 0; i < 13; i++) {
			real.push(1 / (i + 1));
			imag.push(Math.random());
		}
		this.stringWave = this.context.createPeriodicWave(new Float32Array(real), new Float32Array(imag));

		//all amps connect to this, which then goes straight to the speakers
		this.masterVolume = this.context.createGain();
		this.masterVolume.gain.value = 10;
		this.masterVolume.connect(this.context.destination);
		this.amps = [];//different amp for each track
		for (let i = 0; i < tab.tracks.length; i++) {
			//each dynamically played note connects to their respective track's input node, where its voicing is different depending on its "voicing" (distorted guitar, picked/unpicked bass, french horn or whatever (probably won't add that, though) etc.)
			//returns an object with input and volume channels to control it
			this.amps[i] = this.getInput(tab.tracks[i].voice, this.masterVolume);
		}

		//some constant vars
		this.mute = .01;
		this.attack = .01;
		this.decay = this.attack + .02;
		this.release = .02;
	}

	/*
		for each measure, asynchronously play all tracks (so the overall song stays in sync across tracks)
	*/
	async play(startMeasure) {
		this.playing = true;
		startMeasure = (startMeasure == null) ? 0 : startMeasure;
		for (let measureN = startMeasure; measureN < this.tab.measures.length; measureN++) {
			if (this.playing == false) { //user paused playback
				return;
			}
			const measure = this.tab.measures[measureN];
			for (let trackN = 0; trackN < measure.tracks.length; trackN++) {
				new Promise(() => this.playTrackMeasure(trackN, measureN));
			}
			const beat = 60 / measure.tempo;
			const duration = measure.timeN * beat;
			await sleep(duration); //sleep for the rest of the measure
			//TODO: slight improvement would be to time how long it takes to run the code above and subtract that from how long to wait
		}
		this.playing = false;
	}
	//each track plays this measure in parallel (to make sure they never get too out of sync)
	async playTrackMeasure(trackN, measureN) {
		const measure = this.tab.measures[measureN];
		//TODO: different volumes for each track?
		//console.log("playing measure from track "+trackN);
		const track = measure.tracks[trackN];
		const beat = 60 / measure.tempo; //this many seconds for each note
		let startTime = 0;//running count of which second we're on

		for (let noteN = 0; noteN < track.length; noteN++) {
			//for (const note of measure.tracks[trackN]) {
			const note = track[noteN];
			//set up all notes to be played
			let sounds = [];
			for (const pitch of note.notes) {
				if (Number.isInteger(pitch.fret)) {
					let sound = this.getSound(trackN, pitch.string, pitch.fret);
					sounds.push(sound);
				} else { //as of now, the only other thing that could've been placed there is '=' for a hold
					//console.log('non-integer fret found');
				}
			}

			//beat=60/tempo		that many seconds for each note of duration timeD
			//so each note is played for ((timeD/noteDuration)*beat) seconds
			//example: 8th notes are played for .25 seconds in 4/4 at 120 bpm
			//beat is 60/120, so each quarter note gets .5 seconds
			//an 8th note is played ((4/8)*.5)=.25 seconds
			const duration = (measure.timeD / note.duration) * beat;
			//const duration=this.getDuration(measureN,trackN,noteN);

			//set start/stop times for all sounds
			for (let sound of sounds) {
				this.setSound(sound, startTime, duration);
			}
			startTime += duration;
		}
	}

	//set a sound to play with correct volume envelope
	setSound(sound, startTime, duration) {
		sound.note.start();
		sound.volume.gain.setValueAtTime(0, this.context.currentTime + startTime);//start at 0
		sound.volume.gain.linearRampToValueAtTime(1, this.context.currentTime + startTime + this.attack);//then ramp to volume
		//palm muting is all attack, so tone the non-attack parts waaay down when I add that decoration
		sound.volume.gain.exponentialRampToValueAtTime(.75, this.context.currentTime + startTime + this.decay);

		sound.volume.gain.setValueAtTime(.75, this.context.currentTime + startTime + duration - this.release);
		sound.volume.gain.linearRampToValueAtTime(this.mute, this.context.currentTime + startTime + duration);//then be quiet
		sound.note.stop(this.context.currentTime + startTime + duration + .01);//then cut note off entirely
	}

	getSound(trackN, stringN, fret) {
		let note = this.context.createOscillator();
		note.setPeriodicWave(this.stringWave);//note just a sine wave, but has overtones
		note.frequency.value = this.getFrequency(this.tab.tracks[trackN].strings[stringN], fret);
		let volume = this.context.createGain();
		volume.gain.value = 0;
		note.connect(volume);
		//console.log(this.amps);
		volume.connect(this.amps[trackN].input);
		return {
			note: note,
			volume: volume,
		};
	}

	//we know what the string is tuned to, and we know the fret, so we know the note being played. get its frequency
	getFrequency(string, fret) {
		let noteNumber = Player.notes.indexOf(string.note);
		//console.log("noteNumber is "+noteNumber);
		let retNote = Player.notes[(noteNumber + fret) % 12];
		let retOctave = string.octave + Math.floor((noteNumber + fret) / 12);
		//console.log(retNote+retOctave)
		return Player.frequencies[retNote + retOctave];
	}

	//each track its own input (and a compressor), which connect to the track's volume control, which all connect to a master volume control, that finally connects to this.context.destination (the user's speakers)
	getInput(voice, output) {
		//each amp gets its own volume control
		let volume = this.context.createGain(); //factory method
		volume.gain.value = 1;
		//connect to whatever the output is (should be the master volume knob)
		volume.connect(output);
		//each track has its own compressor to keep its volume in check
		let comp = new DynamicsCompressorNode(this.context, {//constructor method
			threshhold: -30,
			knee: 10,
			ratio: 20,
			attack: 0.0,
			release: .1
		});
		//connect to the track's volume knob
		comp.connect(volume);

		//whatever this happens to be, dynamically created notes in a track will go through it to get to the speakers
		let input = this.context.createAnalyser();//TODO: input into a compressor so chords don't get distorted?
		//(input) -> comp --> volume -> masterVolume -> speakers
		switch (voice) { //different sounds for different voices
			case "guitar_distort":
				volume.gain.value = .5;
				let distort = new WaveShaperNode(this.context, {
					curve: makeDistortionCurve(100),
					oversample: '4x'
				});
				/*let noTop=new BiquadFilterNode(this.context,{
					type:"lowpass",
					frequency:100000,
					Q:1,
				});*/
				let bass = new BiquadFilterNode(this.context, {
					type: "lowshelf",
					frequency: 300,
					gain: 10 //positive=more
				});
				let high = new BiquadFilterNode(this.context, {
					type: "highshelf", //anything above frequency is multiplied by gain
					frequency: 2500,
					gain: -10 //positive=??
				});
				let midcut = new BiquadFilterNode(this.context, {
					type: "peaking",
					frequency: 1000,
					Q: .9,
					gain: -10
				});

				input.connect(distort);
				distort.connect(bass);
				bass.connect(high);
				high.connect(midcut);
				distort.connect(midcut);
				midcut.connect(comp);
				//input.connect(distort);
				//distort.connect(comp);
				break;
			case "bass_picked":
				volume.gain.value = .5;
				input.connect(comp);
			default:
				volume.gain.value = .5;
				input.connect(comp);
		}

		return { //return inupt so we can send signals through it, and volume so we can change the volume later if desired. Everything else shouldn't need to be changed
			input: input,
			volume: volume
		};
	}

	//tried to get holds to work, but they're tricky
	/*getDuration(measureN,trackN,noteN){
		console.log('track '+trackN);
		let measure=this.tab.measures[measureN];
		let note=measure.tracks[trackN][noteN];
		let beat=60/measure.tempo;
		let totalDuration=0;
		do{
			//beat=60/tempo because there's that many seconds for each note of duration timeD
			//so each note is played for ((timeD/noteDuration)*beat) seconds
			//example: 8th notes are played for .25 seconds in 4/4 at 120 bpm
			//beat is 60/120, so each quarter note gets .5 seconds
			//an 8th note is played ((4/8)*.5)=.25 seconds
			const duration = (measure.timeD / note.duration) * beat;
			totalDuration++;
			console.log('add '+duration);

			//prepare to look at next note
			noteN++;
			if(noteN == measure.tracks[trackN].length){
				//onto the next measure
				measureN++;
				if(measureN==this.tab.measures.length){
					//at very last note in tab
					console.log("end of song");
					break;
				}
				noteN=0;
				measure=this.tab.measures[measureN];
				beat=60/measure.tempo;
			}
			note=measure.tracks[trackN][noteN];
		}while(note.notes[0].fret=='=');
		console.log(note);
		console.log('total duration: '+totalDuration);
		return totalDuration;
	}*/

	playSingleSound(trackN, stringN, fret) {
		let sound = this.getSound(trackN, stringN, fret);
		this.setSound(sound, 0, .25);
	}
}

function makeDistortionCurve(amount) {
	let n_samples = 44100;
	let curve = new Float32Array(n_samples);
	let deg = Math.PI / 180;
	for (let i = 0; i < n_samples; ++i) {
		let x = i * 2 / n_samples - 1;
		curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
	}
	return curve;
};

//used for async waiting
const sleep = (sec) => {
	return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
