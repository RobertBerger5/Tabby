//when a fret is dynamically added by the Drawer class, it has a call to this function with the correct arguments
//structure of the "note" variable: [measure,beat,string]
function selectNote(id){
	//console.log(id);
	drawer.drawSelector(id);
	editor.select(id);
}

//called by the dropdown "trackSelector" <select> element
function changeTrack(){
	console.log("changed track");
	currTrack=document.getElementById("trackSelector").value;
	editor.changeTrack(currTrack);
	drawer.drawTab(currTrack);
}

function clearTrackMeasure(){
	if(!confirm("Clear This Measure? (won't apply to other tracks)")){
		return;
	}
	editor.clearTrackMeasure(tab.measures[editor.measure()],editor.track);
	drawer.drawTab(currTrack);
}
function addMeasure(){//adds a measure after the currently selected one (same time signatue and tempo by default)
	editor.addMeasure();
	drawer.drawTab(currTrack);
}

function deleteMeasure(){//delete currently selected measure
	if(!confirm("Delete This Measure?")){
		return; //destructive options should prompt to make sure
	}
	editor.deleteMeasure();
	drawer.drawTab(currTrack);
}

//these two are called by simple text inputs
function changeTimeN(timeN){
	if(editor.selected==null){
		alert("no measure selected");
		return;
	}
	timeN=parseInt(timeN);
	if(timeN>0){
		if(!confirm("This will clear the current measure")){
			return; //destructive options should prompt to make sure
		}
		editor.changeTimeN(editor.measure(),timeN);
		drawer.drawTab(currTrack);
	}else{
		alert("what kinda time signature is that");
	}
}
function changeTimeD(timeD){
	if(editor.selected==null){
		alert("no measure selected");
		return;
	}
	timeD=parseInt(timeD);
	if([1,2,4,8,16,32,64].includes(timeD)){
		if(!confirm("This will clear the current measure")){
			return; //destructive options should prompt to make sure
		}
		editor.changeTimeD(editor.measure(),timeD);
		drawer.drawTab(currTrack);
	}else{
		alert("invalid time signature");
	}
}
function changeTempo(tempo){
	if(editor.selected==null){
		alert("no measure selected");
		return;
	}
	tempo=parseFloat(tempo); //if anyone wants to play something at 123.4bpm, feel free
	if(tempo>0){ //should I set an upper bound? nah, let the speed freaks have their 1000bpm music. shred.
		editor.changeTempo(editor.measure(),tempo);
		drawer.drawTab(currTrack);
	}else{
		alert("yo what");
	}
}

function changeRhythm(rhythm){
	if(editor.selected==null){
		alert("no note selected");
		return;
	}
	editor.changeRhythm(editor.measure(),editor.beat(),rhythm);
	drawer.drawTab(currTrack);
}

function showJSON(){
	console.log(JSON.stringify(tab).replace(/\"/g,"\\\""));
}