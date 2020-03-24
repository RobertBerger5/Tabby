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
function drawTab(window,windowWidth,trackN){
	const selectedTrack=0;
	const noteWidth=25;
	const noteHeight=15;
	//keep track so we know to redraw when these change
	var currTimeN=-1;
	var currTimeD=-1;
	var currTempo=-1;
	//where the current drawhead is
	var xStart=0;
	var yStart=20;
	const stringN=tab.tracks[selectedTrack].stringN;
	drawLine(window,xStart,yStart,xStart,yStart+(stringN-1)*noteHeight);
	for(const measure of tab.measures){
		const track=measure.tracks[selectedTrack];
		//TODO: if the time signature changed, redraw that here.
		if(measure.timeN!=currTimeN || measure.timeD!=currTimeD){
			//draw strings behind it
			for(var i=0;i<stringN;i++){//draw strings
				drawLine(window,xStart,yStart,xStart+noteWidth,yStart);
				yStart+=noteHeight;
			}
			yStart-=noteHeight*stringN;
			drawTimeSignature(window,xStart,yStart+noteHeight*(stringN/2),noteHeight*stringN,measure.timeN,measure.timeD);
			currTimeN=measure.timeN;
			currTimeD=measure.timeD;
			xStart+=noteWidth;
		}
		for(const beat of track){
			//draw strings
			for(var i=0;i<stringN;i++){
				drawLine(window,xStart,yStart,xStart+noteWidth,yStart);
				yStart+=noteHeight;
			}
			//draw rhythm (last part signifies if it's a rest or not)
			drawRhythm(window,xStart+noteWidth*2/3,yStart+10,beat.duration,beat.notes.length==0);
			yStart-=noteHeight*stringN; //reset to top string
			//draw notes
			for(const note of beat.notes){
				//TODO: come up with a way to get unique id's for all of em?
				id="ass";//probably just measureNumber+beat+note in one string. don't worry about measures being deleted or whatever, these are all reassigned every single time the user changes anything.
				//every. single. time. the user changes...anything...
				//might be a more efficient way of going about this?
				drawFret(window,xStart+noteWidth/2,yStart+note.string*noteHeight+noteHeight/3,note.fret,true,id);//draw fret number on correct string
			}
			//on to the next set of notes to draw
			xStart+=noteWidth;
		}
		//new measure line
		drawLine(window,xStart,yStart,xStart,yStart+(stringN-1)*noteHeight);
		//carriage return
		if(xStart>=windowWidth.innerWidth-300){//TODO: check if next measure would run over or not
			xStart=0;
			yStart+=noteHeight*stringN*2;
			drawLine(window,xStart,yStart,xStart,yStart+(stringN-1)*noteHeight);
		}
	}
}


function drawLine(draw,x1,y1,x2,y2){
	var line=document.createElementNS("http://www.w3.org/2000/svg","line");
	line.setAttribute("x1",x1);
	line.setAttribute("y1",y1);
	line.setAttribute("x2",x2);
	line.setAttribute("y2",y2);
	line.setAttribute("style","stroke:rgb(0,0,0);stroke-width:2");
	draw.appendChild(line);
}
function drawFret(draw,x,y,txt,id=null){
	const charWidth=7;
	const charHeight=15; //align with what's in tab.css
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

	text=document.createElementNS("http://www.w3.org/2000/svg","text");
	text.setAttribute("x",x);
	text.setAttribute("y",y);
	text.textContent=txt;
	text.setAttribute("class","fret");
	if(id){
		text.setAttribute("id",id);
	}
	draw.appendChild(text);
}
function drawTimeSignature(draw,x,y,height,num,denom){
	x+=1;
	const charWidth=150;
	const charHeight=35;
	var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
	rect.setAttribute("x",x);
	rect.setAttribute("y",y-charHeight);
	//white rectangle should be the width of all chars in the text
	rect.setAttribute("width",charWidth*(1+Math.log10(max(num,denom))));
	rect.setAttribute("height",charHeight*1.2); //i dunno man
	rect.setAttribute("fill","white");
	draw.appendChild(rect);

	var text=document.createElementNS("http://www.w3.org/2000/svg","text");
	text.setAttribute("x",x);
	text.setAttribute("y",y-10);
	text.textContent=num;
	text.setAttribute("class","timeS");//TODO, also draw denominator
	draw.appendChild(text);
	text=document.createElementNS("http://www.w3.org/2000/svg","text");
	text.setAttribute("x",x);
	text.setAttribute("y",y+10);
	text.textContent=denom;
	text.setAttribute("class","timeS");//TODO, also draw denominator
	draw.appendChild(text);
}
function drawRhythm(draw,x,y,duration,rest=false){
	//TODO: draw rests differently
	const rx=2.5;
	const ry=1.5;
	const thicc=1.5;
	const topOfLine=thicc*10;
	var note=document.createElementNS("http://www.w3.org/2000/svg","ellipse");
	note.setAttribute("cx",x);
	note.setAttribute("cy",y);
	note.setAttribute("rx",rx);
	note.setAttribute("ry",ry);
	note.setAttribute("stroke-width",thicc);
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
	line.setAttribute("stroke-width",thicc);
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
		line.setAttribute("stroke-width",thicc);
		draw.appendChild(line);
	}
}

function max(a,b){
	if(a>b){
		return a;
	}else{
		return b;
	}
}