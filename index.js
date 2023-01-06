var fs = require('fs');
// var http = require('http');
var https = require('https');
const app = require("express")();
// const server = require("http").createServer(app);
// var httpServer = http.createServer(app);
var privateKey  = fs.readFileSync('../private.key', 'utf8');
var certificate = fs.readFileSync('../primary.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

const cors = require("cors");

const io = require("socket.io")(httpsServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit('me',socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		console.log("callUser"+userToCall+" SignalData:-"+signalData+" from:-"+from+" name:-"+name)
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		console.log("data:-"+data +" data.signal:-"+data.signal)
		io.to(data.to).emit("callAccepted", data.signal)
	});


// =========Start Socket=====================================================
	socket.on("socketId",(id)=>{
		// socket.broadcast.emit('socketId',id)
		io.to(id).emit(socket.id);
		console.log("Socket:- "+ socket.id)
	});

let Rec_id_check=[];
	socket.on("Rec_socketId",({Rec_id,Value})=>{
		// socket.broadcast.emit('socketId',id)
		io.to(Rec_id).emit('rec_message', {caller_id:socket.id, Val:Value});
		Rec_id_check=socket.id;
		console.log("Mecheck ",Rec_id +" Me:- "+ Rec_id_check+" Value:- "+ Value)
	});
// =========End Socket=====================================================


// =========Start ZOOM=====================================================
	// socket.on("send_message",({mecheck,Value})=>{
	// 	// socket.broadcast.emit('rec_message',Value)
	// 	io.to(mecheck).emit("rec_message",Value);
	// 	console.log("MeCheck= "+mecheck +" Value= "+ Value)
	// });
	// socket.on("rec_message",(rec_data2)=>{
	// 	// socket.broadcast.emit('socketId',id)
	// 	io.to(Rec_id).emit(rec_data2);
	// 	console.log("message ",rec_data2 +"sender_Socketmsg:- "+ socket.id+"Rec_Socketmsg:- "+ Rec_id)
	// });
// =========Start ZOOM=====================================================
});
// httpServer.listen(5001, () => console.log(`Server is running on port 5001`));
httpsServer.listen(5000, () => console.log(`Server is running on port 5000`));


