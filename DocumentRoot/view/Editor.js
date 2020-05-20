//THIS FILE CONTAINS ALL CODE FOR EDITING THE TAB OBJECT

class Editor {
	constructor(tab, track) {
		this.tab = tab;
		this.track = track; //track we're currently editing
		this.selected = null; //measure, beat, string
		this.twoDigitFret = false; //flag to see if the user's trying to enter two digits
		this.firstDigit = null;//goes with this.twoDigitFret, the first digit the user entered
	}
	select(newSelect) { //TODO: rewrite handleKey to use this function, then update the noteDurations buttons to whatever the duration of the newly selected note is
		this.selected = newSelect;
		this.twoDigitFret = false;
	}
	changeTrack(track) {
		this.track = track;
		this.selected = null;
		this.twoDigitFret = false;
	}
	//makes things more readable
	measure() { return ((this.selected != null) ? this.selected[0] : null); }
	beat() { return ((this.selected != null) ? this.selected[1] : null); }
	string() { return ((this.selected != null) ? this.selected[2] : null); }
	getTrack() { return this.tab.tracks[this.track] }

	getBeat() { //returns the currently selected beat
		if (this.selected == null) {
			return null;
		}
		return this.tab.measures[this.measure()].tracks[this.track][this.beat()];
	}
	//returns whatever is at this.selected, makes a new object if there's nothing currently played at that string
	getNote() {
		let notes = this.getBeat().notes;
		for (const note of notes) {
			if (note.string == this.string()) {
				return note;
			}
		}
		let note = { string: this.string(), fret: -1 };
		notes.push(note);
		return note;
	}
	changeFret(fretNum) { //changes the fret at this.selected
		if (this.selected == null) {
			return;
		}
		this.getNote().fret = fretNum;
	}
	deleteSelected() {
		if (this.selected == null) {
			return;
		}
		const notes = this.getBeat().notes;
		for (let i = 0; i < notes.length; i++) {
			if (notes[i].string == this.string()) {
				notes.splice(i, 1);
			}
		}
		//(if nothing's at selected, nothing is removed, as it should be)
	}

	handleKey(key) {
		//console.log("Editor will handle keypress "+key);
		if (key >= 48 && key <= 57) {
			//number key pressed
			let fret = key - 48;
			if (this.twoDigitFret) {
				//console.log("second digit: "+fret);
				this.changeFret((this.firstDigit * 10) + fret);
				this.twoDigitFret = false;
			} else {
				if (fret == 1 || fret == 2) {
					//console.log("first digit: "+fret);
					this.twoDigitFret = true;
					this.firstDigit = fret;
					setTimeout(() => {
						this.twoDigitFret = false;
					}, 1000);
				}
				this.changeFret(fret);
			}
			player.playSingleSound(this.track, this.string(), fret);
		} else {
			this.twoDigitFret = false;
		}

		if (key == 187) {
			this.changeFret('=');
		} else if (key == 8) {
			this.deleteSelected();
		} else if (key >= 37 && key <= 40) {//arrow key pressed
			if (this.selected == null) {
				return;
			}
			switch (key) {
				case 37: //left
					if (this.beat() > 0) {
						this.selected[1]--; //go left one beat
					} else {
						if (this.selected[0] == 0) {
							//at first beat in the song
						} else {
							this.selected[0]--;
							this.selected[1] = this.tab.measures[this.measure()].tracks[this.track].length - 1;
						}
					}
					break;
				case 39: //right
					if (this.beat() < this.tab.measures[this.measure()].tracks[this.track].length - 1) {
						this.selected[1]++;
					} else {
						if (this.measure() < this.tab.measures.length - 1) {
							this.selected[0]++;
							this.selected[1] = 0;
						} else {
							//at last beat in song
						}
					}
					break;
				case 38: //up
					if (this.string() > 0) {
						this.selected[2]--;
					}
					break;
				case 40: //down
					if (this.string() < this.tab.tracks[this.track].strings.length - 1) {
						this.selected[2]++;
					}
					break;
			}

		} else {
			//console.log("Editor: no defined behavior for key "+key);
		}
	}

	clearTrackMeasure(measure, trackN) {
		if (measure == null) {
			alert("no measure selected");
			return;
		}
		//assert: they have a track selected
		measure.tracks[trackN] = [];

		//basic idea: push the largest rhythm we can until the measure's full
		let space = measure.timeN;
		let units = measure.timeD;
		let biggest = 1 / 1; //start by trying to push whole notes
		//console.log("units: "+units);
		while (space > 0) {
			//console.log("space: "+space+"\tbiggest: "+biggest);
			if (space / units >= biggest) {
				//console.log("\tpushed");
				measure.tracks[trackN].push({ duration: 1 / biggest, notes: [] });
				space -= units / (1 / biggest); //aka units*biggest, but this makes more sense in my head
			} else {
				//console.log("\ttoo big");
				biggest /= 2;
			}
		}

		if (this.selected != null) {
			this.selected[1] = 0; //set to first note in measure
		}
	}

	addMeasure() {
		let m = {};
		//console.log(this.tab.measures.length);
		const currM = (this.selected == null) ? this.tab.measures[this.tab.measures.length - 1] : this.tab.measures[this.measure()];
		m.timeN = currM.timeN;
		m.timeD = currM.timeD;
		m.tempo = currM.tempo;
		m.tracks = [];
		for (let i = 0; i < this.tab.tracks.length; i++) {
			this.clearTrackMeasure(m, i); //start as empty measure for all tracks
		}
		//insert into measures array
		this.tab.measures.splice((this.measure() == null) ? this.tab.measures.length : this.measure() + 1, 0, m);
		if (this.selected != null) {
			this.selected[0]++;
		}
	}

	deleteMeasure() {
		if (this.selected == null) {
			return;
		}
		this.tab.measures.splice(this.measure(), 1);

		this.select(this.selected[this.measure() - 1, this.beat(), this.string()])
	}

	changeTimeN(measureN, timeN) {
		this.tab.measures[measureN].timeN = timeN;
		this.clearTrackMeasure(this.tab.measures[measureN], this.track);
	}
	//TODO: these don't clear other tracks as well.
	changeTimeD(measureN, timeD) {
		this.tab.measures[measureN].timeD = timeD;
		this.clearTrackMeasure(this.tab.measures[measureN], this.track);
	}
	changeTempo(measureN, tempo) {
		this.tab.measures[measureN].tempo = tempo;
	}

	changeRhythm(measureN, beatN, duration) {
		//TODO: if I change a rhythm, sometimes it doesn't even realize that duration<beat.duration. how??
		let measure = this.tab.measures[measureN].tracks[this.track];
		let beat = measure[beatN];
		//console.log("change measure "+measureN+", beat "+beatN+" from "+beat.duration+" to "+duration);
		if (duration == beat.duration) {
			return;
		} else if (beat.duration < duration) {//new rhythm is smaller, just have to fill in the gap
			let space = (1 / beat.duration) - (1 / duration);
			//console.log("space to fill: "+space);
			let biggest = (1 / beat.duration) / 2; //start with trying to fill it with the next smallest note
			while (space > 0) {
				if (biggest <= space) {
					this.tab.measures[measureN].tracks[this.track].splice(beatN + 1, 0, { duration: 1 / biggest, notes: [] });
					space -= biggest;
					//console.log("\tpushed "+biggest);
				} else {
					//console.log("\t"+biggest+" was too big");
					biggest /= 2;
				}
			}
			beat.duration = duration;
		} else {//new rhythm is bigger, delete notes to be overwritten, then fill in potential gap
			//clear out notes to make space
			let pave = (1 / duration) - (1 / beat.duration);
			//console.log("space to be paved: "+pave);
			/*pseudocode:
				iterate through next notes, decreasing pave until it's (<= 0)
					OR until we run out of notes in that measure (alert, return)
				then, calculate how much space we have to fill in (if any)
				confirm screen before we delete them
					(might need a flag to see if any weren't rests)
				delete that many notes after current note
				fill in that amount of space
			*/
			let deleteNum = 0;//number of notes after the current one that should be deleted
			let i = 1;//how many notes past I to go
			//(flag for allrests=true, turns to false if any non-rests)
			let allRests = true;
			while (pave > 0) {
				//if there is no beat+i, alert and return
				try {
					//subtract (beat+i)'s duration from pave
					pave -= 1 / (measure[beatN + i].duration);
					//console.log("delete "+(1/(measure[beatN+i].duration)));
					if (measure[beatN + i].notes.length > 0) {
						allRests = false;
					}
					deleteNum++;
					i++;
				} catch (e) {
					alert("can't put that rhythm here, no space");
					console.log(e.message);
					return;
				}
			}
			//console.log("paved. pave is now "+pave);
			//confirm (if allrests==false), then delete
			if (!allRests && !confirm("Changing this rhythm will delete the next " + deleteNum + " notes")) {
				return;
			}
			beat.duration = duration;
			measure.splice(beatN + 1, deleteNum);
			//if pave is less than zero, there's space to fill at beat+1 (copy/pasted from working gap-fill code above, replacing space var with -pave)
			if (pave < 0) {
				pave *= -1;
				let biggest = (1 / duration) / 2; //start with trying to fill it with the next smallest note
				while (pave > 0) {
					if (biggest <= pave) {
						this.tab.measures[measureN].tracks[this.track].splice(beatN + 1, 0, { duration: 1 / biggest, notes: [] });
						pave -= biggest;
					} else {
						biggest /= 2;
					}
				}
			}
		}
		//whatever happened before, the duration of the current note should've changed
		//(unless we chickened out above and returned before deleting any notes)
		//beat.duration=duration;
	}

	//CHANGE TRACK SETTINGS
	changeString(index, note, octave) {
		if (!((note + octave) in Player.frequencies)) {
			return false;
		}
		let string = this.tab.tracks[this.track].strings[index];
		string.note = note;
		string.octave = octave;
		return true;
	}
	changeTrackName(name) {
		this.getTrack().name = name;
	}
	changeTrackVoice(voice) {
		this.getTrack().voice = voice;
	}
	addTrackString() {
		this.getTrack().strings.push({ note: "E", octave: 2 });
	}
	deleteTrackString(index) {
		this.getTrack().strings.splice(index, 1);
	}
}