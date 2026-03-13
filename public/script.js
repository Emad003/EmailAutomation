const slider=document.getElementById("delaySlider");
const number=document.getElementById("delay");

slider.addEventListener("input",()=>{

number.value=slider.value;

});

number.addEventListener("input",()=>{

slider.value=number.value;

});

document.getElementById("csv").addEventListener("change",function(){

const fileName=this.files[0]?.name || "No file selected";

document.getElementById("fileName").innerText=fileName;

});

async function start(){

const file=document.getElementById("csv").files[0];
const delay=document.getElementById("delay").value;
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

if(!file || !delay || !email || !password){

alert("Please fill all fields");
return;

}

const form=new FormData();

form.append("csv",file);
form.append("delay",delay);
form.append("email",email);
form.append("password",password);

document.getElementById("status").innerHTML="Starting campaign...";

await fetch("/start",{

method:"POST",
body:form

});

monitor();

}

async function stop(){

await fetch("/stop",{method:"POST"});

document.getElementById("status").innerHTML="Campaign stopped";

}

async function monitor(){

const interval=setInterval(async()=>{

const progressRes=await fetch("/progress");
const progressData=await progressRes.json();

const logsRes=await fetch("/logs");
const logsData=await logsRes.json();

if(progressData.total===0) return;

const percent=(progressData.sent/progressData.total)*100;

document.getElementById("bar").style.width=percent+"%";

let html="";

logsData.forEach(log=>{

if(log.status==="success"){

html+=`<div style="color:#00ff9d">✔ Sent: ${log.email}</div>`;

}else{

html+=`<div style="color:#ff5252">❌ Failed: ${log.email}</div>`;

}

});

document.getElementById("status").innerHTML=html;

if(progressData.sent>=progressData.total){

clearInterval(interval);

}

},2000);

}