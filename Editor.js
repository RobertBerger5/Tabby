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
			this.changeFret(key-48);
		}else if(key==8){
			this.deleteSelected();
		}else if(key>=37 && key<=40){//arrow key pressed
			if(this.selected==null){
				return;
			}
			//TODO: update selected box somehow
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
					if(this.string()<this.tab.tracks[this.track].stringN-1){
						this.selected[2]++;
					}
					break;
			}

		}else{
			console.log("Editor: no defined behavior for key "+key);
		}
	}
}