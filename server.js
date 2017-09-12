let http = require('http'),
  express = require('express'),
  bodyParser = require('body-parser'),
  net = require('net');

let app = express();
let httpServer = http.createServer(app);

let sockets = [];


function dataController(data){
myData = JSON.parse(data.toString());
console.log(myData);
  switch (myData.type) {
    case "message":
    // console.log("sending message");
      sendMessage(myData);
      break;
    default:

  }

};
function sendMessage(data){
  let userName = data.name?data.name:"default_name";
  let message = data.value?data.value:data.message;
  console.log(`data.value? - ${data.value}`);
  console.log(`data.value? - ${data.message}`);
  console.log(`data.value? - ${data.type}`);

  let message_to_send = {
    type: "message",
    value: message,
    name: userName
  };
  console.log(`message to send ${JSON.stringify(message_to_send)}`);
  sockets.forEach((socket)=>{
    socket.write(JSON.stringify(message_to_send)+"\n");
  });

}
let server = net.createServer(function(socket) {
  sockets.push(socket);
  console.log("one more client");
  socket.on("data", dataController);
});

//setting view engine
app.set('views', './views');
app.set('view engine', 'pug');

//use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.get("/", function(req, res) {
  res.render('index', {
    data: sockets
  });
});
app.post("/", function(req, res){
  console.log(req.body);
  res.render('index', {
    data: sockets
  });
  let message = req.body.message+"\n";
  sendMessage(req.body);
});


server.listen(6060, () => console.log("socket is runing on the port 6060"));
httpServer.listen(8080, () => console.log("httpServer is running on port 8080"));
