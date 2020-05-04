let renderedTabs = null;

$(document).ready(() => {
	$('#pageTitle').html("BROWSE");
	//renderTabs();
	sortTabs();
});

//sort loadedTabs by criterea, reversed or not
function sortTabs(render=true) {
	let sortBy = $('#sortBy').val();
	let desc = $('#descending').prop("checked");

	if (desc) {
		switch (sortBy) {
			case "title":
				renderedTabs = loadedTabs.sort(compareTitleDesc);
				break;
			case "owner":
				renderedTabs = loadedTabs.sort(compareOwnerDesc);
				break;
			case "likes":
				renderedTabs = loadedTabs.sort(compareLikesDesc);
				break;
			default:
				console.log("sortBy val not found");
				renderedTabs = loadedTabs.sort(compareTitleDesc);
		}
	} else {
		switch (sortBy) {
			case "title":
				renderedTabs = loadedTabs.sort(compareTitleAsc);
				break;
			case "owner":
				renderedTabs = loadedTabs.sort(compareOwnerAsc);
				break;
			case "likes":
				renderedTabs = loadedTabs.sort(compareLikesAsc);
				break;
			default:
				throw Error("sortBy val "+sortBy+" not found");
				//console.log("sortBy val not found");
				//renderedTabs = loadedTabs.sort(compareTitleAsc);
		}
	}
	if(render){
		renderTabs();
	}
}
function compareTitleAsc(a, b) {
	if(a==b){return 0;}
	return ((a.title > b.title) ? 1 : -1);
}
function compareTitleDesc(a, b) {
	if(a==b){return 0;}
	return ((a.title < b.title) ? 1 : -1);
}
function compareOwnerAsc(a, b) {
	if(a==b){return 0;}
	return ((a.username > b.username) ? 1 : -1);
}
function compareOwnerDesc(a, b) {
	if(a==b){return 0;}
	return ((a.username < b.username) ? 1 : -1);
}
function compareLikesAsc(a, b) {
	if(a==b){return 0;}
	return ((a.likes < b.likes) ? 1 : -1);
}//> and < are reversed here because the "reversed" behavior should be to find ones with less likes, "normal" behavior should be to find most liked
function compareLikesDesc(a, b) {
	if(a==b){return 0;}
	return ((a.likes > b.likes) ? 1 : -1);
}

//search the sorted tabs for some value
/*function searchTabs(val) {
	sortTabs(false);
	if(val==""){
		renderTabs();
		return;
	}
	console.log("search for "+val);
	let ret=[];
	//TODO: find first and last occurrences of search criteria, put first-last in ret
	let first=null;
	let last=null;
	if($('#descending').prop("checked")){
		first=binsearchFirst(renderedTabs,0,renderedTabs.length-1,val);
		last=binsearchLast(renderedTabs,0,renderedTabs.length-1,val);
	}else{
		first=binsearchLast(renderedTabs,0,renderedTabs.length-1,val);
		last=binsearchFirst(renderedTabs,0,renderedTabs.length-1,val);
	}
	console.log(first+" and "+last);
	//renderedTabs=ret;
	renderTabs();
}*/

function renderTabs() {
	document.getElementById("tabTable").innerHTML = "";
	/*create element in the form:
	<tr>
		<td><strong>Bleed</strong> - <i>Meshuggah</i> <span class="text-muted">#metal,technical,...</span></td>
		<td>20</td>
	</tr>
	*/
	for (let i = 0; i < renderedTabs.length; i++) {
		let tab = renderedTabs[i];
		let tr = document.createElement("tr");

		let td = document.createElement("td");
		td.innerHTML = i + 1;
		tr.appendChild(td);

		td = document.createElement("td");
		let tagsString = "";
		for (let j = 0; j < tab.tags.length; j++) {
			tagsString += "#" + tab.tags[j] + ", ";
		}
		td.innerHTML = "<b>" + tab.title + "</b> - <i>" + tab.username + "</i> <span class='text-muted'>" + tagsString + "</span>";
		tr.appendChild(td);

		td = document.createElement("td");
		td.innerHTML = tab.likes;
		tr.appendChild(td);

		document.getElementById("tabTable").appendChild(tr);
	}
	//TODO: say query used at the bottom? or maybe at the top
}


//TODO: something about these has gone horribly wrong
/*function binsearchFirst(arr,low,high,val){
	if(high>=low){
		let mid=Math.floor(low+((high-low)/2));
		let current=null;
		let prev=null;
		console.log(mid);
		console.log(arr[mid]);
		switch($('#sortBy').val()){
			case "title":
				current=arr[mid].title;
				prev=(mid==0)? null : arr[mid-1].title;
				break;
			case "owner":
				current=arr[mid].username;
				prev=(mid==0)? null : arr[mid-1].username;
				break;
			case "likes":
				current=arr[mid].likes;
				prev=(mid==0)? null : arr[mid-1].likes;
				break;
			default:
				throw Error("sortBy val "+sortBy+" not found");
		}
		console.log("compare "+current+" and maybe "+prev+" for "+val);
		if((mid==0 || val>prev) && current==val){
			return mid;
		}else if(val>current){
			return binsearchFirst(arr,(mid+1),high,val);
		}else{
			return binsearchFirst(arr,low,(mid-1),val);
		}
	}else{
		return -1;
	}
}
function binsearchLast(arr,low,high,val){
	if(high>=low){
		let mid=Math.floor(low+((high-low)/2));
		let current=null;
		let next=null;
		console.log(mid);
		console.log(arr[mid]);
		switch($('#sortBy').val()){
			case "title":
				current=arr[mid].title;
				next=(mid==arr.length-1)? null : arr[mid+1].title;
				break;
			case "owner":
				current=arr[mid].username;
				next=(mid==arr.length-1)? null : arr[mid+1].username;
				break;
			case "likes":
				current=arr[mid].likes;
				next=(mid==arr.length-1)? null : arr[mid+1].likes;
				break;
			default:
				throw Error("sortBy val "+sortBy+" not found");
		}
		console.log("compare "+current+" and maybe "+next+" for "+val);
		if((mid==arr.length-1 || val<next) && current==val){
			return mid;
		}else if(val<current){
			return binsearchFirst(arr,low,(mid-1),val);
		}else{
			return binsearchFirst(arr,(mid+1),high,val);
		}
	}else{
		return -1;
	}
}*/
