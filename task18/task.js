var arr = [10,3,7,12,11,30];
function renderArr(arr){
	var result = document.getElementById("result");
	result.innerHTML = "";
	arr.forEach(function(item){
		result.innerHTML += "<li>"+item+"</li>";
	})
	var len = result.childElementCount;
	
	if(len>0){//如果有子元素
		for(var i=0; i<len; i++){
			result.children[i].style.cssText = 
			"list-style:none; display:inline-block; width:30px;height:30px;line-height:30px;text-align:center;background:red;color:#fff;margin-right:5px";
				
		}
	}
}
function getData(){
	var reg = new RegExp("^[0-9]*$");
	var input = document.getElementById("inputNum").value.trim();
	if(reg.test(input)){
		return input;
	}else {
		alert("请输入数字");
		return ;
	}
}

document.getElementById("inputWrapper").addEventListener("click",function(event){
	var style =event.target.dataset.style;
	console.log(style);
	console.log(typeof style);
	var data = getData();
	if(data){
		
		if(style === "pop"){
			alert(arr[arr.length-1]);
		}
		if(style === "shift"){
			alert(arr[0]);
		}
		arr[style](data);
	}
	
	renderArr(arr);
})
document.getElementById("result").addEventListener("click",function(event){
	// document.getElementById("result").removeChild(event.target);
	// arr=[];
	// for(var i=0,len=document.getElementById("result").childElementCount; i<len; i++){
	// 	arr.push(Number(document.getElementById("result").childNodes[i].innerHTML));
	// }
	arr.splice(getIndex(event),1);
	renderArr(arr);
})
function getIndex(e){
	var node = e.target;
	return [].indexOf.call(node.parentNode.childNodes,node)
}

renderArr(arr);