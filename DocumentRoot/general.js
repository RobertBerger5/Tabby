$(document).ready(()=>{
	$('#sidebarCollapse').on('click',()=>{
		$('#sidebar').toggleClass('active');
	});
});

//execute other PHP file via AJAX, takes callbacks for what to do on failure and on success (with response text)
function ajaxCall(url,params,onSuccess=null,onFail=null){
	ajaxStatusShow();
	let xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange=function(){
		if(this.readyState==XMLHttpRequest.DONE){
			console.log(this)
			if(this.status!=200){//some kinda error
				ajaxStatusUpdate(false,this.responseText);
				if(onFail){
					onFail(this.responseText);
				}
			}else{
				ajaxStatusUpdate(true,this.responseText);
				if(onSuccess){
					onSuccess(this.responseText);
				}
			}
		}
	};
	xhttp.open("POST",url,true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(params);
}

function ajaxStatusShow(message="Updating"){
	document.getElementById('ajaxStatus-text').innerHTML=message;
	document.getElementById('ajaxStatus').style.opacity="75%";//display="block";
}
function ajaxStatusUpdate(success,message="Success"){
	document.getElementById("ajaxStatus-text").innerHTML=message;
	let loader=document.getElementById("ajaxStatus-loader");
	loader.style.borderWidth="2vh";
	if(success){
		loader.style.borderColor="#0f0";
	}else{
		loader.style.borderColor="#f00";
	}
	//show updated status for 3 seconds, then hide again
	setTimeout(()=>{
		document.getElementById('ajaxStatus').style.opacity="0%";//display="none";
		loader.style.borderWidth="1vh";
		loader.style.borderColor="#eee";
		loader.style.borderTopColor="#3ae";
	},3000);
}