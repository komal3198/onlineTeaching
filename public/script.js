const socket = io('/')
const videoGrid=document.getElementById('videoGrid');
const messageContainer = document.getElementById('message-container')
const messagebox=document.getElementById('message-box')
const userlogin=document.getElementById('userlogin').value;
 const adminlog=document.getElementById('adminlog').value;
 const endcallmsg=document.getElementById('endcallmsg');
 endcallmsg.style.display="none";
 const mainLeft=document.getElementById('mainLeft');
 //const clientName=document.getElementById('username').value;
 
// const clientName=prompt('What is your name?')
 /// alert(clientName)
  appendMessage1('You Joined video chat')
 // socket.emit('new-user',clientName,RoomId)
 //sessionStorage.clear();
 document.getElementById("result").value = sessionStorage.getItem("Username");
 const clientName=document.getElementById('result').value;
  //===================================================================
// const mypeer=new Peer(undefined,{
//     host:'/',
//     port:'5001'
// })
const mypeer=new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
//========================================================================
const myvideo=document.createElement('video');
myvideo.muted=true;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream=stream;
    addVideostream(myvideo,stream)
  
    mypeer.on('call',call=>{
        
        call.answer(stream)
       
        const video=document.createElement('video')
        
       // video.id=socket.id
       
		call.on('stream',userVideostream =>{
		addVideostream(video,userVideostream)
		   
			
		})
    })


    socket.on('user-connected',(userId,clientName) =>{
        console.log("user connected " +userId)
        connectToNewUser(userId,stream,clientName)
        appendMessage(`${clientName} connected`)
        //socket.emit('new-user',userId,clientName)
    })
})
// socket.on('chat-message', data => {
//     appendMessage(`${data.name}: ${data.message}`)
//   })
//disconnect user
// socket.on('user-disconnected', (userId,clientName) => {
//     if (mypeer[userId]){ mypeer[userId].close()}
//        // console.log("you ar remove:" +userId)
//        appendMessage(`${clientName} Disconnected`)
//    // console.log("disconnected user:" + userId); 
    
// })
 
//============================================================================
mypeer.on('open',id =>{
  
socket.emit('join-room',RoomId,id,clientName)
})

//==========================================================================
 

socket.on('client-connected', clientName =>{
    appendMessage(`${clientName} connected`)
   // alert(`${clientName} connected`)
})

socket.on('client-disconnected', clientName => {
    appendMessage(`${clientName} disconnected`)
  })
  socket.on('hey', massage =>{
    appendMessage1(massage)
   // console.log(massage)
  })
//=============================================

function addVideostream(video,stream){
    video.srcObject=stream
    //video.id=clientName
    video.addEventListener('loadedmetadata', () =>{
        video.play()
    })
    videoGrid.append(video)
}
function connectToNewUser(userId,stream,clientName){
    const call=mypeer.call(userId,stream)
    const video=document.createElement('video')
    video.setAttribute("id",userId);
    video.setAttribute("name",clientName)

    const userlogin=document.getElementById('userlogin').value;
const adminlog=document.getElementById('adminlog').value;
     
 if(adminlog=="true" && userlogin=="")
 {
     alert("admin logg")
     displayDiv(userId,clientName);
  }
  else if(adminlog=="true" && userlogin=="false"){
     alert("userLogin")
     messageContainer.style.display = "none";
    
     if(clientName==""){
      // alert("no")
        //alert(userId)
      document.getElementById(userId).remove();
   }
  }
  call.on('stream',userVideostream => {
        //addVideostream(video,userVideostream)
        addVideostream(video,userVideostream)
    })
    call.on('close',()=>{
     video.remove()
 })
 mypeer[userId] = call;
}
function appendMessage(message) {
    document.getElementById('clientName').value= message;
    const messageElement = document.createElement('div')
    messageElement.innerText = message
   
    messageContainer.append(messageElement)
    const v=document.getElementById('clientName').value;
    //console.log(v);

  }
  function  appendMessage1(message){
    const messageElement = document.createElement('div')
    messageElement.innerText = message
   
    messagebox.append(messageElement)
  }
  function displayDiv(userId,clientName){
    // btnadd=button;
//   socket.on('client-name',clientName =>{
//       var a=clientName;
//    if(a==""){
//        var b=clientName;
//    }else{
//        var b="client";
//    }
  //var z=document.getElementById('clientName').value;
  //alert(z);
  if(clientName==""){
     // alert("no")
     alert(userId)
     document.getElementById(userId).remove();
  }else{
    var btn = document.createElement("BUTTON");   // Create a <button> element
      //  btn.innerHTML = "remove";
        btn.innerHTML = clientName;
        btn.setAttribute("id",userId);
        btn.setAttribute("value",clientName)
        // button.setAttribute("class", "BUTTON");
    //  var n=document.getElementById(userId);
       
    //  alert(n)

    btn.onclick = function() 
    {
       //  alert(this.id);
      
         userid=this.id;
         var x = document.getElementById(userid).value;
       //alert(x)
          if (mypeer[userid]) mypeer[userid].close()
          document.getElementById('txtnode').value="buttonclicled";
          var bb=document.getElementById('txtnode').value;
         // alert(bb)
         var message= x +  "  Is disconnected By you";
         appendMessage(message)
          if(bb=="buttonclicled"){
             // alert("okk")
              document.getElementById(userid).remove();
              socket.emit('send-msg',userid,clientName)
              
          }
      }
    //addbtn.append(btnadd);
    var element = document.createElement("div");
    element.setAttribute("id","divelement");

   
    element.append(btn);
    videoGrid.appendChild(element);

//  });
    }
}  
// function saveuser(RoomId){
//     const clientName=prompt('What is your name?')
//     //alert(clientName)
//     socket.emit('new-user',clientName,RoomId)
// }
function saveuser(){
    var username=document.getElementById('username').value
    //sessionStorage.setItem("Username", username);
    //(username)
    sessionStorage.setItem("Username", username);
}
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true
    }
}
const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.mainVideoButton').innerHTML = html
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.mainVideoButton').innerHTML = html
}

function endCall(){
  var a=confirm("you want to Leave Meeting ?");
 // alert(a)
var b=a;
 
  if(b !="false"){
    //window.close();
    //alert("close")
    const x=document.getElementById('formcard');
    socket.emit('endcall');
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false
        // alert("play")
    }
    var elem = document.getElementById("videoGrid");
      elem.remove();
      x.style.display="none";
      messagebox.style.display="none";
      endcallmsg.style.display="block";
      mainLeft.style.display="none";

  }
  else{
     alert("no end ")
  }
}