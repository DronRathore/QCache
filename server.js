/*
	The Server for QCache
*/
var http = require("http");
var config = require("./config/config.js").config;
var parser = require("parser").parser;
var cooker = require("cooker").cooker;
var database = require("database").database;
var server = require("server").server;
console.log("\n QTCache ver 1rev0.1\n\n [*] Starting Server...");

/*
	The HTTP Request Handlers for Clients
*/
http.createServer(function(request, response){
	response.writeHead( 200, {"Content-Type":"application/json;charset=UTF-8"} );
	/*
		Lets check for the session ID and validate with
		the session lists in the session dir we have in our base
	*/
	if (_key = extractCookie(request.headers.cookie, config.sessionName)) {
		console.log(" [+] Request from session "+_key.substr(0, 4)+"");
		if (cooker.checkSession(_key)) {
			/*
				We have a valid session running, lets go!
				Read the command and execute it :)
			*/
			var command = parseURL(request.url);
			 if ( command.command == "get" ) {
				var data = database.get(_key, command.data);
				if ( typeof(data) == "object" )
					data = data.toString();
				response.end("{data={\n\t"+command.data+":"+data+"\n}}", "utf-8");
			}
			
			response.end("{data={\n\tsuccess:1\n}}", "utf-8");
			console.log(" [=] serving ends for "+_key.substr(0, 4)+"");
		} else {
			/*
				This is a bad time to handle this request.
			*/
			response.end("{data={\n\terror:404\n}}","utf-8");
			console.log(" [!] Bad Session "+_key.substr(0, 4)+"");
		}
	}
	response.end("{data={\n\terror:502\n}}","utf-8");
}).listen(config.port);

/*
	The listener for server sockets
	A Simple TCP listener
*/

server.init(function(data, socket){
		/*
			Parse Commands and perform the action
		*/
		var parse = new parser();
		var parts = parse.explode(data, " ");
		console.log(parts);
	try{
		switch (parts[0]) {
			case "add": database.add(parts[1], parts[2], parts[3]);socket.write("200");break;
			case "delete": database.remove(parts[1], parts[2]);socket.write("200");break;
			case "update": database.update(parts[1], parts[2], parts[3]);socket.write("200");break;
			case "get": var data = (database.get(parts[1], parts[2])).toString()+"\0";socket.write(data);break;
		}
	}catch(e){
		/*
			Wanna Do Something? Then add here. :P
		*/
		
	}
}, 8080);


console.log(" [*] Running at port "+config.port+"\n [*] to shutdown press CTRL+c\n++++++++++++++++++++++++++++++++++++++++++++++++++\n");

function extractCookie(header, name){
	var _p = new parser();
	if (header) {
	var cookies = _p.explode(header, "=");
	if ( cookies ) {
	var gtg = false;
		for ( i=0; i<cookies.length; i++) {
			if ( cookies[i].indexOf(name) !=-1 && cookies[i].substr( cookies[i].indexOf(name)+name.length ) == "") {
				if ( cookies[i+1].indexOf(";") ) {
					return cookies[i+1].substr( cookies[i+1].indexOf(";") + 1 );
				} else {
					return cookies[i+1];
				}
			}
		}
	}
	}
	return false;
}
function parseURL(url){
	var _p = new parser();
	if ( url != "/" ) {
		var parts = _p.explode(url, "/");
		parts.shift();
		if (parts) {
			if ( object = isGet(parts) ) {
				return object;
			}
			if ( object = isAdd(parts) ) {
				return object;
			}
			if ( object = isModify(parts) ) {
				return object;
			}
		}
	}
	return false;
}

function isModify( parts ){
if ( parts[0] == "update" ) {
	if ( parts[1] ) {
		if ( parts[2] ) {
			if ( parts[2] == "of" )
				if ( parts[3] )
					return {command:"update", data: parts[1], of: parts[3]};
			} else {
				return {command:"update", data: parts[1]};
			}
	}
}
return false;
}

function isAdd( parts ){
if ( parts[0] == "add" ) {
	if ( parts[1] ) {
		if ( parts[2] ) {
			if ( parts[2] == "of" )
				if ( parts[3] )
					return {command:"add", data: parts[1], of: parts[3]};
			} else {
				return {command:"add", data: parts[1]};
			}
	}
}
return false;
}

function isGet( parts ){
if ( parts[0] == "get" ) {
	if ( parts[1] ) {
		if ( parts[2] ) {
			if ( parts[2] == "of" )
				if ( parts[3] )
					return {command:"get", data: parts[1], of: parts[3]};
			} else {
				return {command:"get", data: parts[1]};
			}
	}
}
return false;
}
