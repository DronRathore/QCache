<?php
/*
	QCache Talker
	TCP Socket Communication Addon for php
	@authour: Dron Rathore [dron.rathore@gmail.com]
	@version: 0.1
*/

class QCache{
	private $socket, $isValid;
	
	function __construct($ip, $port) {
		$this->isValid = true;
		$this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		$result = socket_connect($this->socket, $ip, $port);
		if ( $result === false ) {
			echo "Could'nt connect to the QCache server";
			$this->isValid = false;
		}
	}
	function connect($username, $password){
		if ( $this->isValid ) {
			$in = "login ".$username." ".md5($password)."\r\n";
			socket_write($this->socket, $in, strlen($in));
			$response = socket_read($this->socket, 3);
			if ( $response == 200 ) {
				$this->isValid = 2;
			} else {
				$this->isValid = false;
			}
		}
		echo $response;
	}
	function add($key, $value) {
		$in = "add ".session_id()." ".$key." ".base64_encode($value)."\r\n";
		socket_write($this->socket, $in, strlen($in));
		$response = socket_read($this->socket, 3);
	}
	function get($key) {
		$in = "get ".session_id()." ".$key."\r\n";
		socket_write($this->socket, $in, strlen($in));
		$data = "";
		while( $partial = socket_read($this->socket, 1) != '\0') {
			$data. = $partial;
		}
		return $data;
	}
	function delete($key){
		$in = "delete ".session_id()." ".$key."\r\n";
		socket_write($this->socket, $in, strlen($in));
	}
}