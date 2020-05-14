<!doctype html>
<html language="en">

<head>
	<title>Tabby: View</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<!--Bootstrap 4 CSS-->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
		integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
	<!--jQuery 3.2.1-->
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
		integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous">
	</script>
	<!--Popper.js-->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
		integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous">
	</script>
	<!--Bootstrap 4 JS-->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
		integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous">
	</script>

	<!--my own stuff-->
	<link rel="stylesheet" href="/stylesheet.css">
	<link rel="stylesheet" href="view.css" />
	<!--specific for tab rendering-->
	<link rel="stylesheet" href="tab.css" />

	<script src="/general.js"></script>
	<script src="view.js"></script>
	<!--class for drawing the tab-->
	<script src="Drawer.js"></script>
	<!--class for editing the tab-->
	<script src="Editor.js"></script>
	<!--class for playing the tab-->
	<script src="Player.js"></script>
	<!--contains functions to handle user input-->
	<script src="userInput.js"></script>
</head>

<body>
	<?php
		$doc=new DOMDocument();
		$doc->loadHTMLFile("../header.html");
		echo $doc->saveHTML();
	?>
	<div id="drawDiv">
		<svg id="draw" height="1000">
			<!--the whole tab is dynamically loaded in here-->
		</svg>
	</div>
	<div id="userInterface">
		<div id="ui-durations">
			<button onclick="changeRhythm(1)">whole</button>
			<button onclick="changeRhythm(2)">half</button>
			<button onclick="changeRhythm(4)">quarter</button>
			<button onclick="changeRhythm(8)">8th</button>
			<button onclick="changeRhythm(16)">16th</button>
			<button onclick="changeRhythm(32)">32nd</button>
			<button onclick="changeRhythm(64)">64th</button>
		</div>
		<div id="ui-measure-info">
			<input type="number" placeholder="new tempo" onchange="changeTempo(this.value);this.value='';this.blur()">
			<br />
			<input type="text" placeholder="new time signature"
				onchange="changeTimeN(this.value);this.value='';this.blur()">
			<br />
			<input type="text" placeholder="new time signature"
				onchange="changeTimeD(this.value);this.value='';this.blur()">
			<br />
		</div>
		<div id="ui-measure-buttons">
				<button onclick="clearTrackMeasure()">Clear</button>
				<button onclick="addMeasure()">Add Measure</button>
				<button onclick="deleteMeasure()">Delete Measure</button>
				<button>Copy</button>
				<button>Paste</button>
				<input type="number"  placeholder="# to paste"/>
		</div>
		<div id="ui-track-panel">
			<div id="ui-track-collapse">
			</div>
			<p>Current Track:
				<select id="trackSelector" onchange="changeTrack()">
					<!--loads dynamically-->
				</select>
				<p>TRACK TODO: name, voice, and strings (note/octave and delete), add string
			</p>
		</div>
	</div>
	<!--<div id="userInterface">
		<!--TODO: make this part prettier--
		<p>Note duration:
			<button onclick="changeRhythm(1)">whole</button>
			<button onclick="changeRhythm(2)">half</button>
			<button onclick="changeRhythm(4)">quarter</button>
			<button onclick="changeRhythm(8)">8th</button>
			<button onclick="changeRhythm(16)">16th</button>
			<button onclick="changeRhythm(32)">32nd</button>
			<button onclick="changeRhythm(64)">64th</button>
			<!--<br /> for dotted rhythms, which don't quite work yet, TODO
				<button onclick="changeRhythm(.75)">. whole</button>
				<button onclick="changeRhythm(1.5)">. half</button>
				<button onclick="changeRhythm(3)">. quarter</button>
				<button onclick="changeRhythm(6)">. 8th</button>
				<button onclick="changeRhythm(12)">. 16th</button>
				<button onclick="changeRhythm(24)">. 32th</button>
				<button onclick="changeRhythm(48)">. 64nd</button>--
		</p>
		<p>Current Track:
			<select id="trackSelector" onchange="changeTrack()">
			</select>
			<!--loads dynamically below, TODO: way to change the track (name, voice, and strings)--
		</p>
		<button onclick="clearTrackMeasure()">Clear Track Measure</button>
		<button onclick="addMeasure()">Add Measure</button>
		<button onclick="deleteMeasure()">Delete Measure</button>
		<br />
		<!--TODO: copy/paste measure buttons--
		<input type="number" placeholder="new tempo" onchange="changeTempo(this.value);this.value='';this.blur()">
		<br />
		<input type="text" placeholder="new time signature"
			onchange="changeTimeN(this.value);this.value='';this.blur()">
		<br />
		<input type="text" placeholder="new time signature"
			onchange="changeTimeD(this.value);this.value='';this.blur()">
		<br />
		<!--let this stand as a testament to how disgusting weakly-typed languages are. I just spent about 3 hours trying to track down why it was saying 16<8, and it turns out that "16"<"8". >:( --
		<!--<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="1">1</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="2">2</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="4">4</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="8">8</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="16">16</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="32">32</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="64">64</input>--
		<button onclick="showJSON()">Give me the tab!</button>
	</div>-->

	<script>
	/*STRUCTURE OF THE TAB OBJECT:

			info (for general metadata):
				title: string for the title
			tracks (list of objects):
				name: string for name
				voice: what effects the Player object should use
				strings (list of objects detailing all strings each track has):
					note: string for which note to play (C,C#,Db,D,D#, etc.)
					octave: int for which octave it is
			measures (list of objects detailing info about measures and which notes each track plays at which times):
				timeN: int for numerator of time signature
				timeD: int for denomicator of time signature
				tempo: number for bpm of the measure
				tracks (list, one element for each track):
					(list, one element for each rhythm/beat):
						duration: int for how long to play the note (16->16th note)
						notes (list of objects):
							string: int for which string to play
							fret: int for which fret to play (or '=' for a hold)
							//TODO: might add techniques here (like palm mutes or bends?)
			*/

	//TODO: read from file, this is gross
	hardcodedTab = JSON.parse("\
{\"info\":{\"title\":\"(title)\"},\"tracks\":[{\"name\":\"lead guitar\",\"voice\":\"guitar_distort\",\"strings\":[{\"note\":\"D#\",\"octave\":4},{\"note\":\"A#\",\"octave\":3},{\"note\":\"F#\",\"octave\":3},{\"note\":\"C#\",\"octave\":3},{\"note\":\"G#\",\"octave\":2},{\"note\":\"D#\",\"octave\":2}]},{\"name\":\"bass guitar\",\"voice\":\"bass_picked\",\"strings\":[{\"note\":\"F#\",\"octave\":2},{\"note\":\"C#\",\"octave\":2},{\"note\":\"G#\",\"octave\":1},{\"note\":\"D#\",\"octave\":1}]}],\"measures\":[{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":6}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":5}]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":6}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":5}]}],[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":6}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":3}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":10}]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]}],[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":6}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":3}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":150,\"tracks\":[[{\"duration\":1,\"notes\":[]}],[{\"duration\":8,\"notes\":[{\"string\":1,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":1,\"fret\":5}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":2}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":5}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":7}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":9}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":10}]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":150,\"tracks\":[[{\"duration\":8,\"notes\":[{\"string\":5,\"fret\":1}]},{\"duration\":8,\"notes\":[{\"string\":5,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":4,\"fret\":0}]},{\"duration\":8,\"notes\":[{\"string\":4,\"fret\":1}]},{\"duration\":8,\"notes\":[{\"string\":4,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":8,\"notes\":[{\"string\":3,\"fret\":2}]},{\"duration\":8,\"notes\":[{\"string\":3,\"fret\":3}]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":200,\"tracks\":[[{\"duration\":2,\"notes\":[{\"string\":5,\"fret\":3},{\"string\":4,\"fret\":2},{\"string\":3,\"fret\":0},{\"string\":2,\"fret\":0},{\"string\":1,\"fret\":3},{\"string\":0,\"fret\":3}]},{\"duration\":2,\"notes\":[]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":60,\"tracks\":[[{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":\"=\"}]},{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":2}]},{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":3}]}],[{\"duration\":1,\"notes\":[]}]]}]}\
				");
	</script>
</body>

</html>