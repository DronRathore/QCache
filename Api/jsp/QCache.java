import java.net.*;
import java.util.*;

class QCache{
Socket QScoket;
String data;
boolean state;
	public QCache( String ip, int port) {
		this.QSocket = new Socket(ip, port);
		this.state = false;
		String data = new String("");
	}
	public int connect( String username, String password ) {
		this.QSocket.connect();
		this.QSocket.write("login "+username+" "+password);
		String data = this.QSocket.read(3);
		if ( data == "200" ) {
			/*
				Valid Login, set the flag for further data retrieval
			*/
			this.state = true;
			return true;
		} else {
			return false;
		}
	}
	public int add(String sessionKey, String key, String value) {
		this.QSocket.write("add "+sessionKey+" "+key+" "+ value);
	}
	public String get(String sessionKey, String key) {
		this.QSocket.write("get "+sessionKey+" "+key);
		String temp = new String("");
		while ( temp = this.QSocket.read(4) ) {
			if ( temp == "\r\n\r\n") {
				break;
			} else {
				this.data += temp;
			}
		}
		return this.data;
	}
	public int delete(String sessionKey, String key) {
		this.QSocket.write("delete "+sessionKey+" "+key);
	}
}