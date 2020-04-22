<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<script src="Drawer.js"></script><!--class for drawing the tab-->
		<script src="Editor.js"></script><!--class for editing the tab-->
		<script src="Player.js"></script><!--class for playing the tab-->
		<script src="userInput.js"></script><!--contains functions to handle user input-->
		<link rel="stylesheet" href="tab.css" />
		<link rel="stylesheet" href="userInterface.css" />
	</head>
	<body>
		<div id="userInterface">
			<!--TODO: make this part prettier-->
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
				<button onclick="changeRhythm(48)">. 64nd</button>-->
			</p>
			<p>Current Track:
				<select id="trackSelector" onchange="changeTrack()">
				</select> <!--loads dynamically below, TODO: way to change the track (name, voice, and strings)-->
			</p>
			<button onclick="clearTrackMeasure()">Clear Track Measure</button>
			<button onclick="addMeasure()">Add Measure</button>
			<button onclick="deleteMeasure()">Delete Measure</button>
			<br /><!--TODO: copy/paste measure buttons-->
			<input type="number" placeholder="new tempo" onchange="changeTempo(this.value);this.value='';this.blur()">
			<br />
			<input type="text" placeholder="new time signature" onchange="changeTimeN(this.value);this.value='';this.blur()">
			<br />
			<input type="text" placeholder="new time signature" onchange="changeTimeD(this.value);this.value='';this.blur()">
			<br />
			<!--let this stand as a testament to how disgusting weakly-typed languages are. I just spent about 3 hours trying to track down why it was saying 16<8, and it turns out that "16"<"8". >:( -->
			<!--<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="1">1</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="2">2</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="4">4</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="8">8</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="16">16</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="32">32</input>
			<input type="radio" name="noteDurations" onchange="this.checked=false; changeRhythm(this.value)" value="64">64</input>-->
			<button onclick="showJSON()">Give me the tab!</button>
		</div>

		<svg id="draw" height="1000">
			<!--the whole tab is dynamically loaded in here-->
		</svg>
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
			hardcodedTab=JSON.parse("\
{\"info\":{\"title\":\"(title)\"},\"tracks\":[{\"name\":\"lead guitar\",\"voice\":\"guitar_distort\",\"strings\":[{\"note\":\"D#\",\"octave\":4},{\"note\":\"A#\",\"octave\":3},{\"note\":\"F#\",\"octave\":3},{\"note\":\"C#\",\"octave\":3},{\"note\":\"G#\",\"octave\":2},{\"note\":\"D#\",\"octave\":2}]},{\"name\":\"bass guitar\",\"voice\":\"bass_picked\",\"strings\":[{\"note\":\"F#\",\"octave\":2},{\"note\":\"C#\",\"octave\":2},{\"note\":\"G#\",\"octave\":1},{\"note\":\"D#\",\"octave\":1}]}],\"measures\":[{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":6}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":5}]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":2},{\"string\":5,\"fret\":0}]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":6}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":32,\"notes\":[{\"string\":5,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":5}]}],[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":6}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":3}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":10}]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":105,\"tracks\":[[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":8}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":4,\"fret\":7}]}],[{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":6}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":5}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":3}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]},{\"duration\":16,\"notes\":[{\"string\":2,\"fret\":7}]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":150,\"tracks\":[[{\"duration\":1,\"notes\":[]}],[{\"duration\":8,\"notes\":[{\"string\":1,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":1,\"fret\":5}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":2}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":5}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":7}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":9}]},{\"duration\":8,\"notes\":[{\"string\":0,\"fret\":10}]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":150,\"tracks\":[[{\"duration\":8,\"notes\":[{\"string\":5,\"fret\":1}]},{\"duration\":8,\"notes\":[{\"string\":5,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":4,\"fret\":0}]},{\"duration\":8,\"notes\":[{\"string\":4,\"fret\":1}]},{\"duration\":8,\"notes\":[{\"string\":4,\"fret\":3}]},{\"duration\":8,\"notes\":[{\"string\":3,\"fret\":0}]},{\"duration\":8,\"notes\":[{\"string\":3,\"fret\":2}]},{\"duration\":8,\"notes\":[{\"string\":3,\"fret\":3}]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":200,\"tracks\":[[{\"duration\":2,\"notes\":[{\"string\":5,\"fret\":3},{\"string\":4,\"fret\":2},{\"string\":3,\"fret\":0},{\"string\":2,\"fret\":0},{\"string\":1,\"fret\":3},{\"string\":0,\"fret\":3}]},{\"duration\":2,\"notes\":[]}],[{\"duration\":1,\"notes\":[]}]]},{\"timeN\":4,\"timeD\":4,\"tempo\":60,\"tracks\":[[{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":0}]},{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":\"=\"}]},{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":2}]},{\"duration\":4,\"notes\":[{\"string\":5,\"fret\":3}]}],[{\"duration\":1,\"notes\":[]}]]}]}\
				");
		</script>
		<script>
			let tab; //the tab, big ol js object (currently hardcoded above)
			var drawer; //class for working with svg elements
			var editor; //class for handling user input and affecting the "tab" object
			var player; //class for playing the notes back to the user

			let inDraw=false; //boolean for if the mouse is in the <svg></svg> area
			let currTrack=0;//start with the first by default

			$(function(){
				let windowWidth=document.body.clientWidth;
				$("#draw").width(windowWidth);
				tab=loadTab();
				window.AudioContext=window.AudioContext || window.webkitAudioContext; //play in Firefox
				drawer=new Drawer(tab,document.getElementById("draw"),windowWidth);
				editor=new Editor(tab,currTrack);
				player=new Player(tab);
				drawer.drawTab(currTrack);
			});

			function loadTab(){
				let loadedTab=hardcodedTab;

				//load dropdown of tracks
				for(let i=0;i<loadedTab.tracks.length;i++){
					let input=document.createElement("option");
					input.setAttribute("value",i);
					input.textContent=loadedTab.tracks[i].name;
					document.getElementById("trackSelector").appendChild(input);
				}

				return loadedTab;
			}

			$("#draw").mouseenter(()=>{inDraw=true});
			$("#draw").mouseleave(()=>{inDraw=false});
			$("body").keydown((event)=>{
				if([32,37,38,39,40].indexOf(event.keyCode)>-1){
						//prevent arrow keys and space from scrolling the page
						event.preventDefault();
					}
				if(inDraw){ //don't use the editor if they pressed a key outside the editor
					if(event.keyCode==32){
						if(!player.playing){
							player.play(editor.measure());
						}else{
							player.playing=false; //flag var to false player will notice before playing next measure
						}
					}
					editor.handleKey(event.which);
					drawer.drawTab(currTrack);
					drawer.drawSelector(editor.selected);
				}
			});
		</script>
	</body>
</html>