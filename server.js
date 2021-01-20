const express=require('express')
const app = express()
const server=require('http').Server(app)
const io=require('socket.io')(server)
const bodyParser=require('body-parser')
const session =require('express-session')
const mysql=require('mysql')
const port=process.env.PORT || 5050
const {v4:uuidV4}=require('uuid')
//============================================================================
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : false}));
app.use(session({secret:'ssshhhhh'}));
const con=mysql.createConnection({
   
    host:"localhost",
    user:"root",
    password:"",
    database:"mydb"

});
//========================================================================================
 app.get("/",function(req,res){
     res.render("homepage")
 })
 var sessionData
 app.post("/homepage",function(req,res){
     sessionData=req.session;
     let username=req.body.username
     let roomName=req.body.roomName
     sessionData.username=username
     sessionData.roomName=roomName
     res.render('room',{roomId:`${uuidV4()}`,username:sessionData.username,roomName:sessionData.roomName,userLog:sessionData.userLog,adminlogin:sessionData.loggedin})
 })

 //post value from  roomview
 app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
    var RoomId=request.body.roomid;
    sessionData.RoomId=RoomId;
	if (username && password) {
		con.query('SELECT * FROM admintable WHERE username = ? AND password = ? AND admin_id="1"', [username, password], function(error, results, fields) {
			if (results.length > 0) {
                request.session.loggedin = true;
                sessionData.loggedin=true;
				request.session.username = username;
				response.redirect('/'+sessionData.RoomId);
			} else {
        sessionData.userLog=false;
       
      //   var sql=`INSERT INTO admintable (username,password) VALUES ("${username}","${password}")`;
      //  con.query(sql, function (err, result) {
      //     if (err) throw err;
      //     console.log("1 record inserted");
      //   });
            
                
               
                response.redirect('/'+sessionData.RoomId);
				//response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.get('/:room', (req, res) => {
      
    res.render('room', { roomId: req.params.room,username:sessionData.username,roomName:sessionData.roomName,userLog:sessionData.userLog,adminlogin:sessionData.loggedin})
});
//=================================================================================
const users={}
//peerjs and socket connection
io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId,clientName) =>{
        //console.log(roomId,userId)
        socket.join(roomId)
        //socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.to(roomId).broadcast.emit('user-connected',userId,clientName)
        socket.to(roomId).broadcast.emit('client-name',clientName)
        socket.to(roomId).broadcast.emit('user-disconnected',userId)
        //==============================================================
        //  socket.on('new-user',(clientName ,userId)=>{
        //        users[userId] = clientName
        // socket.to(roomId).broadcast.emit('client-connected', clientName)
        //  })
        // socket.on('send-msg', userId => {
        //     const message="your call disconnect by admin";
        //         socket.broadcast.emit('chat-message', { message: message, name: clientName })
        //       })
       
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('client-disconnected',clientName)
            delete users[userId]
          })
          socket.on('endcall',()=>{
            socket.to(roomId).broadcast.emit('client-disconnected',clientName)
            delete users[userId]
          })
       //======================================================
       socket.on('send-msg',(userId,clientName) =>{
               // console.log(userId)
                const message= clientName +" :your call disconnect by admin";
                //console.log(massage)
             socket.to(roomId).broadcast.emit('hey',message);
            // socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
              //socket.to(userId).emit('hey',massage);
            // socket.to(roomId).emit('hey', massage);
            
            //io.to(userId).emit('hey',massage);
             
            })
            
    })
   
    
    // socket.on('new-user',(clientName ,roomId)=>{
    //     //console.log(clientName)
    //            users[socket.id] = clientName
    //     socket.to(roomId).broadcast.emit('client-connected', clientName)
    //      })

        //  socket.on('send-msg',userId =>{
        //        // console.log(userId)
        //         const message="your call disconnect by admin";
        //         //console.log(massage)
        //      socket.to(roomId).broadcast.emit('hey',message);
        //       //socket.to(userId).emit('hey',massage);
        //     // socket.to(roomId).emit('hey', massage);
            
        //     //io.to(userId).emit('hey',massage);
             
        //     })
})
//==============================================================================================
server.listen(port,function(){
  console.log("our port is running on " +port)
});
