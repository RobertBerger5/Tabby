$(document).ready(() => {
	$('#pageTitle').html("INFO");
	loadShares();
});

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
	if(isOwner){
		let remove=document.createElement("th");
		remove.innerHTML="Remove";
		document.getElementById("shareTableHead").appendChild(remove);

		let makeOwner=document.createElement("th");
		makeOwner.innerHTML="Make Owner";
		document.getElementById("shareTableHead").appendChild(makeOwner);
	}

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
			removeButton.setAttribute("onclick","remove("+i+",'"+shares[i].username+"')");
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
	ajaxCall("/ajaxFiles/changeEditPriv.php","id="+tab_id+"&user="+username+"&edit="+allow,onSuccess=()=>{
		
	},onFail=()=>{

	});
}
function removeUser(index,username){
	console.log(username);
}
function makeOwner(username){
	console.log(username);
}