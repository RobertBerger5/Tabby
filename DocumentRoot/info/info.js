$(document).ready(() => {
	$('#pageTitle').html("INFO");
	initTable();
	loadShares();
});

function initTable(){
	if(isOwner){
		let remove=document.createElement("th");
		remove.innerHTML="Remove";
		document.getElementById("shareTableHead").appendChild(remove);

		let makeOwner=document.createElement("th");
		makeOwner.innerHTML="Make Owner";
		document.getElementById("shareTableHead").appendChild(makeOwner);
	}
}

function loadShares(){
	shares.sort((a, b) => {
		//returns -.5 if a is alphabetically higher, .5 if lower
		let name = ((a.username > b.username) ? 1 : 0) - .5;
		//returns -1 if a can edit but b can't, 1 if vice versa, or 0 if same
		let edit = b.can_edit - a.can_edit;
		//combined, prioritizes if they can edit or not, but sorts by username within those two groups
		return name + edit;
	});
	displayShares();
}
function displayShares(){
	for(let i=0;i<shares.length;i++){
		//don't bother showing who has view access to public tabs, everyone has view access
		//commented out because if someone had edit access and then didn't, it could cause problems with the owner reallowing them edit access
		/*if(isPublic==1 && shares[i].can_edit=="0"){
			break;
		}*/

		let tr=document.createElement("tr");

		let name=document.createElement("td");
		name.innerHTML=shares[i].username;
		tr.appendChild(name);

		let editTD=document.createElement("td");
		let editCheck=document.createElement("input");
		editCheck.setAttribute("type","checkbox");
		if(shares[i].can_edit=="1"){
			editCheck.setAttribute("checked","");
		}
		if(!isOwner){
			editCheck.setAttribute("disabled","");
		}else{
			editCheck.setAttribute("onclick","toggleEdit('"+shares[i].username+"',this.checked)");
		}
		editTD.appendChild(editCheck);
		tr.appendChild(editTD);

		if(isOwner){
			let removeTD=document.createElement("td");
			let removeButton=document.createElement("button");
			removeButton.innerHTML="Remove";
			//just to make sure it's removing the username they clicked on, probably not necessary to pass shares[i].username but oh well
			removeButton.setAttribute("onclick","removeUser("+i+",'"+shares[i].username+"')");
			removeTD.appendChild(removeButton);
			tr.appendChild(removeTD);

			let makeOwnerTD=document.createElement("td");
			let makeOwnerButton=document.createElement("button");
			makeOwnerButton.innerHTML="Make Owner";
			makeOwnerButton.setAttribute("onclick","makeOwner('"+shares[i].username+"')");
			makeOwnerTD.appendChild(makeOwnerButton);
			tr.appendChild(makeOwnerTD);
		}

		document.getElementById("shareTableBody").appendChild(tr);
	}

	if(isOwner){
		document.getElementById("ownerButtons").style.visibility="visible";
	}
}

function toggleEdit(username,checked){
	let allow=0;
	if(checked){
		allow=1;
	}
	ajaxCall("/ajaxFiles/changeEditPriv.php","id="+tab_id+"&user="+username+"&edit="+allow);
}
function removeUser(index,username){
	if(confirm("Are you sure you want to remove "+username+"?")){
		ajaxCall("/ajaxFiles/removeUser.php","id="+tab_id+"&user="+username);
	}
}
function makeOwner(username){
	if(confirm("Are you sure you want to transfer ownership to "+username+"?")){
		ajaxCall("/ajaxFiles/makeOwner.php","id="+tab_id+"&user="+username);
	}
}

function shareWith(){
	let user=prompt("Username: ");
	if(user!=null){
		ajaxCall("/ajaxFiles/shareWith.php","id="+tab_id+"&user="+user);
	}
}
function togglePublic(){
	if(confirm("Are you sure you want to make this tab "+(isPublic?"private":"public")+"?")){
		ajaxCall("/ajaxFiles/makePublic.php","id="+tab_id+"&public="+(1-isPublic),onSuccess=()=>{
			isPublic=1-isPublic; //toggle between 0 and 1
			document.getElementById("button-public").innerHTML="Make "+(isPublic?"Private":"Public");
		});
	}
}
function deleteTab(){
	if(confirm("Are you really sure you want to delete this tab? (this can be recovered from the ID number, seen in the URL)")){
		ajaxCall("/ajaxFiles/deleteTab.php","id="+tab_id,onSuccess=()=>{
			alert("Tab successfully deleted");
			window.location.href="/browse";
		});
	}
}