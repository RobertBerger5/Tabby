
$(document).ready(() => {
	renderTabs();
});

function renderTabs() {
	document.getElementById("tabTable").innerHTML="";
	/*create element in the form:
	<tr>
		<td><strong>Bleed</strong> - <i>Meshuggah</i> <span class="text-muted">#metal,technical,...</span></td>
		<td>20</td>
	</tr>
	*/
	for(let i=0;i<loadedTabs.length;i++){
		let tab=loadedTabs[i];
		let tr=document.createElement("tr");

		let td=document.createElement("td");
		td.innerHTML=i+1;
		tr.appendChild(td);

		td=document.createElement("td");
		let tagsString="";
		for(let j=0;j<tab.tags.length;j++){
			tagsString+="#"+tab.tags[j]+", ";
		}
		td.innerHTML="<b>"+tab.title+"</b> - <i>"+tab.user+"</i> <span class='text-muted'>"+tagsString+"</span>";
		tr.appendChild(td);

		td=document.createElement("td");
		td.innerHTML="lik";
		tr.appendChild(td);

		document.getElementById("tabTable").appendChild(tr);
	}
}

//TODO: when the sort button is clicked, sort em and re-render em