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