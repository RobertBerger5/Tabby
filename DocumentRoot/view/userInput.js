//when a fret is dynamically added by the Drawer class, it has a call to this function with the correct arguments
//structure of the "note" variable: [measure,beat,string]
function selectNote(id) {
	//console.log(id);
	drawer.drawSelector(id);
	editor.select(id);
}

function saveTab(){
	ajaxCall("/ajaxFiles/saveTab.php","id="+tab_id+"&data="+JSON.stringify(tab));
}

//called by the dropdown "trackSelector" <select> element
function changeTrack() {
	currTrack = document.getElementById("trackSelector").value;
	editor.changeTrack(currTrack);
	drawer.drawTab(currTrack);
	loadTrack();
	//console.log("changed track");
}
function changeTrackName(name) {
	editor.changeTrackName(name);
	loadTrackNames();
}
function changeTrackVoice(voice) {
	editor.changeTrackVoice(voice);
}
function addTrackString() {
	editor.addTrackString();
	drawer.drawTab(currTrack);
	loadTrackStrings();
}
function deleteTrackString(index) {
	alert("TODO: this is more complicated");
	//TODO: just have a way to rearrange strings, involves rearranging all notes on that entire string.
	//maybe just a "swap strings" function that swaps two strings? Then swap the index all the way to the bottom, and just remove the last element and all associated notes? not the fastest method by far, but this won't be called often, so it's not the end of the world
	//but also, it'll be doing SO MUCH for each measure SO MANY times, annoying when this is clearly not the right solution
	return;
	editor.deleteTrackString(index);
	drawer.drawTab(currTrack);
	loadTrackStrings();
}
function changeTrackString(index) {
	let note = document.getElementById("trackStringNote" + index).value;
	let octave = parseInt(document.getElementById("trackStringOctave" + index).value);
	if (!editor.changeString(index, note, octave)) {
		document.getElementById("trackString" + index).style.backgroundColor = "#f00";
	} else {
		document.getElementById("trackString" + index).style.backgroundColor = "transparent";
		player.playSingleSound(currTrack, index, 0);
	}
}
function loadTrackNames() {
	//load dropdown of tracks
	let trackSelector = document.getElementById("trackSelector");
	trackSelector.innerHTML = '';
	for (let i = 0; i < tab.tracks.length; i++) {
		let input = document.createElement("option");
		input.setAttribute("value", i);
		input.textContent = tab.tracks[i].name;
		trackSelector.appendChild(input);
	}
}
function loadTrackStrings() {
	document.getElementById('ui-track-strings').innerHTML = '';
	for (let i = 0; i < tab.tracks[currTrack].strings.length; i++) {
		let s = tab.tracks[currTrack].strings[i];
		let parent = document.createElement('div');
		parent.setAttribute('class', 'track-string');
		parent.setAttribute('id', ('trackString' + i));

		let note = document.createElement('select');
		note.setAttribute('id', ('trackStringNote' + i));
		note.setAttribute('onchange', 'changeTrackString(' + i + ');this.blur();');

		//TODO: add all notes in Player.notes
		for (let n of Player.notes) {
			let option = document.createElement('option');
			option.setAttribute('value', n);
			option.innerHTML = n;
			if (n == s.note) {
				option.setAttribute('selected', '');
			}
			note.appendChild(option);
		}
		parent.appendChild(note);

		let octave = document.createElement('input');
		octave.setAttribute('id', ('trackStringOctave' + i));
		octave.setAttribute('type', 'text');
		octave.setAttribute('maxlength', '1');
		octave.setAttribute('onchange', ('changeTrackString(' + i + ');this.blur();'));
		octave.setAttribute('value', s.octave);
		parent.appendChild(octave);

		document.getElementById('ui-track-strings').appendChild(parent);
	}
}
function loadTrack() {
	let t = tab.tracks[currTrack];
	document.getElementById("trackName").value = t.name;
	document.getElementById("trackVoice").value = t.voice;
	loadTrackStrings();
}

function clearTrackMeasure() {
	if (!confirm("Clear This Measure? (won't apply to other tracks)")) {
		return;
	}
	editor.clearTrackMeasure(tab.measures[editor.measure()], editor.track);
	drawer.drawTab(currTrack);
}
function addMeasure() {//adds a measure after the currently selected one (same time signatue and tempo by default)
	editor.addMeasure();
	drawer.drawTab(currTrack);
}

function deleteMeasure() {//delete currently selected measure
	if (!confirm("Delete This Measure?")) {
		return; //destructive options should prompt to make sure
	}
	editor.deleteMeasure();
	drawer.drawTab(currTrack);
}

//these two are called by simple text inputs
function changeTimeN(timeN) {
	if (editor.selected == null) {
		alert("no measure selected");
		return;
	}
	timeN = parseInt(timeN);
	if (timeN > 0) {
		if (!confirm("This will clear the current measure")) {
			return; //destructive options should prompt to make sure
		}
		editor.changeTimeN(editor.measure(), timeN);
		drawer.drawTab(currTrack);
	} else {
		alert("what kinda time signature is that");
	}
}
function changeTimeD(timeD) {
	if (editor.selected == null) {
		alert("no measure selected");
		return;
	}
	timeD = parseInt(timeD);
	if ([1, 2, 4, 8, 16, 32, 64].includes(timeD)) {
		if (!confirm("This will clear the current measure")) {
			return; //destructive options should prompt to make sure
		}
		editor.changeTimeD(editor.measure(), timeD);
		drawer.drawTab(currTrack);
	} else {
		alert("invalid time signature");
	}
}
function changeTempo(tempo) {
	if (editor.selected == null) {
		alert("no measure selected");
		return;
	}
	tempo = parseFloat(tempo); //if anyone wants to play something at 123.4bpm, feel free
	if (tempo > 0) { //should I set an upper bound? nah, let the speed freaks have their 1000bpm music. shred.
		editor.changeTempo(editor.measure(), tempo);
		drawer.drawTab(currTrack);
	} else {
		alert("yo what");
	}
}

function changeRhythm(rhythm) {
	if (editor.selected == null) {
		alert("no note selected");
		return;
	}
	editor.changeRhythm(editor.measure(), editor.beat(), rhythm);
	drawer.drawTab(currTrack);
}

function showJSON() {
	//replace quotes with double slashes
	console.log(JSON.stringify(tab).replace(/\"/g, "\\\""));
	alert("See console output.");
}