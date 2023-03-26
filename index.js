var fs = require('fs');
var https = require('https');
const app = require("express")();
var privateKey  = fs.readFileSync('../private.key', 'utf8');
var certificate = fs.readFileSync('../primary.crt', 'utf8');
// const cluster=require("cluster");
// const io_redis = require('socket.io-redis');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
// const numCPUs = require("os").cpus().length;
const bodyParser=require("body-parser");

// =======REDIS===================================
// const Redis = require('redis');
// const client = Redis.createClient({
//     // url: 'redis://redis:6380',
//     host: '127.0.0.1',
//     port: 6380,
//     password: ''
// });
// client.connect('connect', function() {
//     console.log('Connected to Redis');
// });

// client.set('mykey', 'myvalue', Redis.print);

// client.get('mykey', function(error, result) {
//     if (error) {
//         console.log("ERROR= "+error);
//         throw error;
//     }
//     console.log('GET result ->' + result);
// });
// ================================================

const cors = require("cors");

const io = require("socket.io")(httpsServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});
app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
	res.send('Running');
});
let Step_Count
app.get('/StepCount', (req, res) => {
	const value = req.query.data;
	Step_Count=value;
	res.send(`StepCount_Node_value= ${value}`);
	console.log(`Received_Node_value: ${value}`);
	console.log(`Step_Count_Node_value: ${Step_Count}`);
	// res.status(200).send('Value received');
});
app.get('/SocketIds',(req, res)=>{
	console.log("SocketIds=="+number)
	res.send(`SocketIds= ${number}`);
})
console.log("Step_Count_Send:- "+ Step_Count)

//----------------Store In Array Formate------------------------
//----------------Store In Dictionary Formate-------------------
// const number = new Map();
let number = {'uevrxb': 'yazuUdT97yVzGFiYAAAC', 'xtmpob': '3KbakAHeUgkWNlgbAAAD'};
	console.log("number1="+number)
	
io.on("connection", (socket) => {
	const socketId = socket.id;
	let ayush;
	
// //----------------Store In Array Formate------------------------
// 	// number.push(socket.id);
// 	// console.log(number);
// //----------------Store In Array Formate END--------------------

// //----------------Store In Dictionary Formate-------------------
// if (!map.has(socketId)) {
// 	// for (let i = 0; i < 5; i++) {
	//   const key = Math.random().toString(36).substring(7);
	  const key = Math.random().toString(36).substring(7)+"@gmail.com";
	  const value = socketId;
	  number[key]=value
	  console.log(number)
	  console.log("number="+number)
	  
	//   ayush=JSON.stringify(number)
	//   console.log("AYush="+ayush)

	socket.emit("KeyVal",number);

	socket.emit("gmailkey",key);
	console.log("key="+key);
	
	socket.emit("gmailvalue",value);
	console.log("value="+value);

// 	// }
//   }
//   console.log("keys=",Object.keys(number));

// //   for (let i = 0; i < number.; i++) {}
// //   const keyToFind = 'uevrxb';
// //   const jaiHind = number[keyToFind];
// //   console.log("jaiHind="+jaiHind);
// newId="Ayush";
//----------------Store In Dictionary Formate END---------------
  	// socket.join(newId);
	socket.emit('me',socket.id);
	socket.emit('step_count',Step_Count);
	console.log("Step_Count_Send:- "+ Step_Count)
	
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name}) => {
		// console.log("callUser"+userToCall+" SignalData:-"+signalData+" from:-"+from+" name:-"+name)
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		// console.log("data:-"+data +" data.signal:-"+data.signal)
		io.to(data.to).emit("callAccepted", data.signal)
	});

// =========Start Socket=====================================================
	socket.on("socketId",(id)=>{
		// socket.broadcast.emit('socketId',id)
		io.to(id).emit(socket.id);
		// console.log("Socket:- "+ socket.id)
	});

let Rec_id_check=[];
let Rec_id_Doctor=[];
console.log(" Me:- "+ Rec_id_check+" Rec_id_Doctor:- "+ Rec_id_Doctor)
	socket.on("Rec_socketId",({Rec_id,Value})=>{
		// socket.broadcast.emit('socketId',id)
		io.to(Rec_id).emit('rec_message', {caller_id:socket.id, Val:Value});
		Rec_id_check=socket.id;
		Rec_id_Doctor=Rec_id;

		// console.log("Mecheck ",Rec_id +" Me:- "+ Rec_id_check+" Value:- "+ Value)
	});
// =========End Socket=====================================================

// socket.on("Step_count_Id",({Doc_id,Step_Count})=>{
// 		io.to(Rec_id_Doctor).to(socket.id).emit('Step_count_value_rec', {scount:Step_Count});
// 		console.log("Doc_id:- "+ Doc_id, "STep_count= "+Step_Count)
// 	})

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
	httpsServer.listen(5000, () => console.log(`Server is running on port 5000`));
	console.log(`Worker ${process.pid} started in last`);



