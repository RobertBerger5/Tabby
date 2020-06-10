var tab = null; //the tab, big ol js object (currently hardcoded above)
var drawer = null; //class for working with svg elements
var editor = null; //class for handling user input and affecting the "tab" object
var player = null; //class for playing the notes back to the user

let inDraw = false; //boolean for if the mouse is in the <svg></svg> area
let currTrack = 0; //start with the first by default


$(document).ready(() => {
	$('#pageTitle').html("VIEW");

	//tab things:
	let windowWidth = document.body.clientWidth;
	$("#draw").width(windowWidth);
	window.AudioContext = window.AudioContext || window.webkitAudioContext; //play in Firefox
	drawer = new Drawer(tab, document.getElementById("draw"), windowWidth);
	editor = new Editor(tab, currTrack);
	player = new Player(tab);
	drawer.drawTab(currTrack);

	$("#draw").mouseenter(() => { inDraw = true });
	$("#draw").mouseleave(() => { inDraw = false });
	$("body").keydown((event) => { handleKey(event) });


	//UI things:
	$('#ui-track-collapse').on('click', () => {
		$('#ui-track-panel').toggleClass('active');
	});

	loadTrackNames();
	loadTrack();
});

function handleKey(event) {
	if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
		//prevent arrow keys and space from scrolling the page
		event.preventDefault();
	}
	if (inDraw) { //don't use the editor if they pressed a key outside the editor
		if (event.keyCode == 32) {
			if (!player.playing) {
				player.play(editor.measure());
			} else {
				player.playing = false; //flag var to false player will notice before playing next measure
			}
		}
		editor.handleKey(event.which);
		drawer.drawTab(currTrack);
		drawer.drawSelector(editor.selected);
	}
};