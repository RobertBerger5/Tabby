//THIS FILE SERVES TO RENDER THE TAB ONTO THE SVG CANVAS IN THE DOCUMENT

//BIG TODO: make this all be one object that draws on stuff rather than disconnected functions
class Drawer{
	constructor(tab,window,windowWidth){
		this.tab=tab; //copy by reference
		this.window=window;
		this.windowWidth=windowWidth;
	}
/*
pseudocode:
	for each measure-track pair, draw:
	for each beat (in selected track??):
		draw string lines (same width for all)
		draw fret number on correct string (white background?)
		draw rhythm note below
		TODO later: draw effects on notes
	draw end of measure
*/
	drawTab(trackN){
	//some constant vars to keep everything in line
	const selectedTrack=trackN;
	const noteWidth=30;
	const noteHeight=15; //should stay consistant with what's in tab.css
	//keep track so we know to redraw when these change, start them off at impossible values that we'll have to redraw to start with
	var currTimeN=-1;
	var currTimeD=-1;
	var currTempo=-1;
	//where the current drawhead is
	var xStart=0;
	var yStart=20;
	const stringN=this.tab.tracks[selectedTrack].stringN; //number of strings in this track
	//vertical line at the start of a measure
	this.drawLine(this.window,xStart,yStart,xStart,yStart+(stringN-1)*noteHeight);
	//for(const measure of this.tab.measures){ //needed measure index for id's
	for(var iMeasure=0;iMeasure<this.tab.measures.length;iMeasure++){//draw each measure
		const measure=this.tab.measures[iMeasure];
		const track=measure.tracks[selectedTrack];
		//if the time signature changed, redraw that now
		if(measure.timeN!=currTimeN || measure.timeD!=currTimeD){
			//draw strings behind it
			for(var i=0;i<stringN;i++){//draw strings
				//line should be exactly as long as the time signature, meaning we have to look at how many characters are in it (which is a number in base 10, so we use log10)
				this.drawLine(this.window,xStart,yStart,xStart+noteWidth*(1+Math.log10(max(measure.timeN,measure.timeD))),yStart);
				yStart+=noteHeight;
			}
			yStart-=noteHeight*stringN;
			this.drawTimeSignature(this.window,xStart,yStart+noteHeight*(stringN/2),noteHeight*stringN,measure.timeN,measure.timeD);
			//update our variables, and the 
			currTimeN=measure.timeN;
			currTimeD=measure.timeD;
			xStart+=noteWidth*(Math.log10(max(currTimeN,currTimeD)));
		}
		//for(const beat of track){ //draw every beat
		for(var iBeat=0;iBeat<track.length;iBeat++){
			const beat=track[iBeat];
			//draw strings first
			for(var i=0;i<stringN;i++){
				this.drawLine(this.window,xStart,yStart,xStart+noteWidth,yStart);
				yStart+=noteHeight;
			}
			//draw rhythm underneath (last part signifies if it's a rest or not)
			this.drawRhythm(this.window,xStart+noteWidth*2/3,yStart+10,beat.duration,beat.notes.length==0);
			yStart-=noteHeight*stringN; //reset drawhead to top string
			for(const note of beat.notes){ //draw all notes
				//TODO: come up with a way to get unique id's for all of em?
				var id=iMeasure+","+iBeat+","+note.string;
				this.drawFret(this.window,xStart+noteWidth/2,yStart+note.string*noteHeight+noteHeight/3,note.fret,id);//draw fret number on correct string
			}
			//on to the next set of things to draw, increase drawhead
			xStart+=noteWidth;
		}
		//new measure line
		this.drawLine(this.window,xStart,yStart,xStart,yStart+(stringN-1)*noteHeight);
		//carriage return if it's getting too far to the right
		if(xStart>=this.windowWidth-300){//TODO: check if next measure would run over or not
			xStart=0;
			yStart+=noteHeight*stringN*2;
			this.drawLine(this.window,xStart,yStart,xStart,yStart+(stringN-1)*noteHeight);
		}
	}
}


drawLine(draw,x1,y1,x2,y2){
	var line=document.createElementNS("http://www.w3.org/2000/svg","line");
	line.setAttribute("x1",x1);
	line.setAttribute("y1",y1);
	line.setAttribute("x2",x2);
	line.setAttribute("y2",y2);
	line.setAttribute("style","stroke:rgb(0,0,0);stroke-width:2");
	draw.appendChild(line);
}
drawFret(draw,x,y,txt,id=null){
	const charWidth=7;
	const charHeight=15; //align with what's in tab.css
	//white rectangle behind it to cover the strings
	var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
	rect.setAttribute("x",x);
	rect.setAttribute("y",y-charHeight);
	if(txt>0){
		//white rectangle should be the width of all chars in the text
		rect.setAttribute("width",charWidth*(1+Math.log10(txt)));
	}else{
		rect.setAttribute("width",charWidth);
	}
	rect.setAttribute("height",charHeight);
	rect.setAttribute("fill","white");
	draw.appendChild(rect);

	var text=document.createElementNS("http://www.w3.org/2000/svg","text");
	text.setAttribute("x",x);
	text.setAttribute("y",y);
	text.textContent=txt;
	text.setAttribute("class","fret");
	text.setAttribute("onclick","selectNote("+id+","+x+","+y+")"); //seperated by commas, adds them as individual arguments (kinda gross, TODO: probably change)
	if(id){
		text.setAttribute("id",id);
	}
	draw.appendChild(text);
}
drawTimeSignature(draw,x,y,height,num,denom){
	x+=1; //give it a little space
	const charWidth=150;
	const charHeight=35;
	//white rectangle behind it to cover the strings
	var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
	rect.setAttribute("x",x);
	rect.setAttribute("y",y-charHeight);
	//rectangle should be the width of all chars in the text (or at least the longest one...)
	rect.setAttribute("width",charWidth*(1+Math.log10(max(num,denom))));
	rect.setAttribute("height",charHeight*1.2); //i dunno man
	rect.setAttribute("fill","white");
	draw.appendChild(rect);

	var text=document.createElementNS("http://www.w3.org/2000/svg","text");
	text.setAttribute("x",x);
	text.setAttribute("y",y-charHeight/3);
	text.textContent=num;
	text.setAttribute("class","timeS");
	draw.appendChild(text);
	text=document.createElementNS("http://www.w3.org/2000/svg","text");
	text.setAttribute("x",x);
	text.setAttribute("y",y+charHeight/3);
	text.textContent=denom;
	text.setAttribute("class","timeS");//TODO, also draw denominator
	draw.appendChild(text);
}
drawRhythm(draw,x,y,duration,rest=false){
	//TODO: draw rests differently
	const rx=2.5;
	const ry=1.5;
	const stroke=1.5;
	const topOfLine=stroke*10;
	var note=document.createElementNS("http://www.w3.org/2000/svg","ellipse");
	note.setAttribute("cx",x);
	note.setAttribute("cy",y);
	note.setAttribute("rx",rx);
	note.setAttribute("ry",ry);
	note.setAttribute("stroke-width",stroke);
	note.setAttribute("stroke","black");
	if(duration>1){//fill halves and wholes with white
		note.setAttribute("fill","white");
		if(duration==3){//whole notes don't need more
		draw.appendChild(note);
		return;
		}
	}
	//vertical line on everything but whole notes
	var line=document.createElementNS("http://www.w3.org/2000/svg","line");
	line.setAttribute("x1",x+rx);
	line.setAttribute("y1",y);
	line.setAttribute("x2",x+rx);
	line.setAttribute("y2",y-topOfLine);
	line.setAttribute("stroke-width",stroke);
	line.setAttribute("stroke","black");
	draw.appendChild(line);
	draw.appendChild(note);
	for(var i=duration;i<=0;i++){//lazy coding, wanna add lines to non-quarter notes
		line=document.createElementNS("http://www.w3.org/2000/svg","line");
		line.setAttribute("x1",x+rx);
		line.setAttribute("y1",y-topOfLine+i*3*-1);
		line.setAttribute("x2",x+rx+rx*2);
		line.setAttribute("y2",ry+y-topOfLine+i*3*-1);
		//squiggles were annoying to look at, and so was the code for them.
		//line=document.createElementNS("http://www.w3.org/2000/svg","path");
		//line.setAttribute("d","m"+(x+rx)+","+(y-topOfLine+i*ry*-1.25)+"c2,-2 4,2 6,0 l0,1 c-2,2 -4,-2 -6,0 l0,-1z");
		line.setAttribute("stroke","black");
		line.setAttribute("stroke-width",stroke);
		draw.appendChild(line);
	}
}
drawSelector(draw,x,y){
	if(document.getElementById("selector")!=null){
		document.getElementById("selector").remove();
	}
	var selector=document.createElementNS("http://www.w3.org/2000/svg","rect");
	selector.setAttribute("x",x-7);
	selector.setAttribute("y",y-16);
	selector.setAttribute("width",20);
	selector.setAttribute("height",20);
	selector.setAttribute("stroke","red");
	selector.setAttribute("stroke-width",2);
	selector.setAttribute("fill-opacity","0");
	draw.appendChild(selector);
}
}

//lil helper function for my helper functions
function max(a,b){
	if(a>b){
		return a;
	}else{
		return b;
	}
}