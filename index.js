const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

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
let number = {'uevrxb': 'yazuUdT97yVzGFiYAAAC', 'xtmpob': '3KbakAHeUgkWNlgbAAAD'};
	console.log("number1="+number)


io.on("connection", (socket) => {
	const socketId = socket.id;
	let ayush;
	const key = Math.random().toString(36).substring(7)+"@gmail.com";
	const value = socketId;
	number[key]=value
	console.log(number)
	 console.log("number="+number)
	 
	socket.emit("KeyVal",number);

	socket.emit("gmailkey",key);
	console.log("key="+key);
	
	socket.emit("gmailvalue",value);
	console.log("value="+value);

	socket.emit("me", socket.id);
	console.log("socket.id:- "+socket.id)

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
	socket.on("message",(zoom)=>{
		socket.broadcast.emit('message',zoom)
		console.log("its Work for sending",zoom)
	})
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
