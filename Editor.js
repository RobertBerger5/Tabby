//THIS FILE CONTAINS ALL CODE FOR EDITING THE TAB OBJECT

class Editor{
	constructor(tab,track){
		this.tab=tab;
		this.track=track; //track we're currently editing
		this.selected=null; //measure, beat, string
	}
	select(newSelect){
		//console.log(newSelect);
		this.selected=newSelect;
		//console.log("now selected "+this.selected);
		//console.log(this.getNote());
	}
	changeTrack(track){
		this.track=track;
		this.selected=null;
	}
	//makes things more readable
	measure(){return ((this.selected!=null)?this.selected[0]:null);}
	beat(){return ((this.selected!=null)?this.selected[1]:null);}
	string(){return ((this.selected!=null)?this.selected[2]:null);}

	getBeat(){ //returns the currently selected beat
		if(this.selected==null){
			return null;
		}
		return this.tab.measures[this.measure()].tracks[this.track][this.beat()];
	}
	//returns whatever is at this.selected, makes a new object if there's nothing currently played at that string
	getNote(){
		var notes=this.getBeat().notes;
		for(const note of notes){
			if(note.string==this.string()){
				return note;
			}
		}
		var note={string: this.string(), fret: -1};
		notes.push(note);
		return note;
	}
	changeFret(fretNum){ //changes the fret at this.selected
		if(this.selected==null){
			return;
		}
		this.getNote().fret=fretNum;
	}
	deleteSelected(){
		if(this.selected==null){
			return;
		}
		const notes=this.getBeat().notes;
		for(var i=0;i<notes.length;i++){
			if(notes[i].string==this.string()){
				notes.splice(i,1);
			}
		}
		//(if nothing's at selected, nothing is removed, as it should be)
	}

	handleKey(key){
		//console.log("Editor will handle keypress "+key);
		if(key>=48 && key<=57){
			//number key pressed
			//TODO: if 1 or 2, maybe wait .1 seconds for another number?? currently can't have any frets beyond the 9th because no double digits
			this.changeFret(key-48);
		}else if(key==8){
			this.deleteSelected();
		}else if(key>=37 && key<=40){//arrow key pressed
			if(this.selected==null){
				return;
			}
			switch(key){
				case 37: //left
					if(this.beat()>0){
						this.selected[1]--; //go left one beat
					}else{
						if(this.selected[0]==0){
							//at first beat in the song
						}else{
							this.selected[0]--;
							this.selected[1]=this.tab.measures[this.measure()].tracks[this.track].length-1;
						}
					}
					break;
				case 39: //right
					if(this.beat()<this.tab.measures[this.measure()].tracks[this.track].length-1){
						this.selected[1]++;
					}else{
						if(this.measure()<this.tab.measures.length-1){
							this.selected[0]++;
							this.selected[1]=0;
						}else{
							//at last beat in song
						}
					}
					break;
				case 38: //up
					if(this.string()>0){
						this.selected[2]--;
					}
					break;
				case 40: //down
					if(this.string()<this.tab.tracks[this.track].strings.length-1){
						this.selected[2]++;
					}
					break;
			}

		}else{
			console.log("Editor: no defined behavior for key "+key);
		}
	}

	clearTrackMeasure(measure,trackN){
		if(measure==null){
			alert("no measure selected");
			return;
		}
		//assert: they have a track selected
		measure.tracks[trackN]=[];

		//TODO: push the largest thing we can until the measure's full
		//measure.tracks[trackN].push({duration:1,notes:[]});
		var space=measure.timeN;
		var units=measure.timeD;
		var biggest=1/1; //start by trying to push whole notes
		console.log("units: "+units);
		while(space>0){
			console.log("space: "+space+"\tbiggest: "+biggest);
			if(space/units >= biggest){
				console.log("\tpushed");
				measure.tracks[trackN].push({duration:1/biggest,notes:[]});
				space-=units/(1/biggest); //aka units*biggest, but this makes more sense in my head
			}else{
				console.log("\ttoo big");
				biggest/=2;
			}
		}

		if(this.selected!=null){
			this.selected[1]=0; //set to first note in measure
		}
	}

	addMeasure(){
		var m={};
		console.log(this.tab.measures.length);
		const currM=(this.selected==null)? this.tab.measures[this.tab.measures.length-1] : this.tab.measures[this.measure()];
		m.timeN=currM.timeN;
		m.timeD=currM.timeD;
		m.tempo=currM.tempo;
		m.tracks=[];
		for(var i=0;i<this.tab.tracks.length;i++){
			this.clearTrackMeasure(m,i); //start as empty measure for all tracks
		}
		//insert into measures array
		this.tab.measures.splice((this.measure()==null)?this.tab.measures.length:this.measure()+1,0,m);
		if(this.selected!=null){
			this.selected[0]++;
		}
	}

	deleteMeasure(){
		if(this.selected==null){
			return;
		}
		this.tab.measures.splice(this.measure(),1);
	}

	changeTimeN(measureN,timeN){
		this.tab.measures[measureN].timeN=timeN;
		this.clearTrackMeasure(this.tab.measures[measureN],this.track);
	}
	changeTimeD(measureN,timeD){
		this.tab.measures[measureN].timeD=timeD;
		this.clearTrackMeasure(this.tab.measures[measureN],this.track);
	}
	changeTempo(measureN,tempo){
		this.tab.measures[measureN].tempo=tempo;
	}
}