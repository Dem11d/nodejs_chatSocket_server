var http = require('http'),
  express = require('express'),
  bodyParser = require('body-parser'),
  io = require('socket.io');
var net = require('net');

var app = express();
var httpServer = http.createServer(app);
let sock;
// io = io.listen(server);
//
//
// io.on('connection', function (socket) {
// 	console.log("connected client");
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

function dataController(data){
  let str = data.toString();
	let obj = JSON.parse(str);
	// console.log(`status = ${obj.status}`);
  console.dir(obj);
	switch (obj.status) {
		case "bye":
			let response = {status: "bye"}
			console.log("sending answer bye");
			sock.write(JSON.stringify(response) + "\n");
			break;
		case "output":
			send(obj);
			break;
	}
};
var server = net.createServer(function(socket) {
  sock = socket;
  console.log("one more client");
  socket.on("data", dataController);
});

//setting view engine
app.set('views', './views');
app.set('view engine', 'pug');




function send(obj) {
	console.log("sending cassetes");
  let response = {
    "status": "stack",
    "error_code": {
      "message": "",
      "code": ""
    },
    "cassettes": {
      "cassette_1": {
        "status": "31",
        "exits": obj.cassette_1,
        "reject": 0,
        "chks": 0,
        "error": "38",
        "type": "45"
      },
      cassette_2: {
        "status": "31",
        "exits": obj.cassette_2,
        "reject": 0,
        "chks": 0,
        "error": "38",
        "type": "45"
      }
    },
    // banknote: {
    //   value: 50,
    //   valute: 'UAH',
    //   hash: 'somehash'
    // }
  }
  sock.write(JSON.stringify(response) + "\n");
  // io.sockets.emit("STACK",response);
}

function getMoney() {
  let response = {
    status: 'stack',
    banknote: {
      value: 50,
      valute: 'UAH',
      hash: 'somehash'
    }
  };
  sock.write(JSON.stringify(response) + "\n");
}

function idle() {
  let response = {
    status: 'idle',
  };
  sock.write(JSON.stringify(response) + "\n");
}

//routes
app.get("/", function(req, res) {
  res.render('index', {
    text: "server is waiting"
  });
});
app.get("/idle", function(req, res) {
  idle();
  res.render('index', {
    text: "server is sent idle"
  });
});
app.get("/send", function(req, res) {
  console.log("sending money");
  res.render('index', {
    text: "sending money"
  });
  send();
});
app.get("/stop", function(req, res) {
  console.log("stop sending money");
  res.render('index', {
    text: "stop sending money"
  });
});
app.get("/get", function(req, res) {
  console.log("getting money");
  getMoney();
  res.render('index', {
    text: "getting money"
  });
});


server.listen(6565, () => console.log("socket is runing on the port 6565"));
httpServer.listen(6566, () => console.log("httpServer is running on port 6566"));
