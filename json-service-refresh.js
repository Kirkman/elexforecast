load('json-client.js');
load('sbbsdefs.js');                            // K_*
load('uifcdefs.js');                            // WIN_*
// some of the custom functions I'm using
// load(js.exec_dir + 'helper-functions.js');

var db;

var server = 'localhost';
var port = '10088';
// sysop user
var u = new User(1);

function wait(func) {
	var start = Date.now();
	do {
		var packet = db.receive();
		if(!packet)
			continue;
		else if(packet.func == func) 
			return packet.data;
		else 
			db.updates.push(packet.data);
	} while(Date.now() - start < db.settings.SOCK_TIMEOUT);
	throw("timed out waiting for server response");
}


if(!db) {
	db = new JSONClient(server,port);
}
if(!db.socket.is_connected)
	db.connect();

// connect to db using sysop credentials
db.ident('ADMIN', u.alias, u.security.password);

var trash = wait("OK");

// tell db to reload sportsstats data
db.send({scope:'elexforecast',func:'RELOAD'});

