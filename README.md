qCache
======

* Under Construction, mind your coding
 

A modern era Memory Cache using realtime nodejs technology

## What is it?

QCache is a project that stumbled upon my mind when I got fed up of old lame memcache technique and there were none availaible that stands different.
It is a more advance caching server which caters both client as well as server.

## How it do things?

Qcache uses 2 communications:

* Client: It uses an HTTP server to cater the client requests
* [Under Prototyping] Server: A TCP server to manage the server and data on it

For client the QCache replies with JSON response while for the application server it uses a normal byte level transmission.

* Client
 - A Client communicates through the URL that is then parsed i.e.

 ```
  http://xyz.com:6000/get/friends
 ```
- The above will be mapped to the friend key in the session object of the client and is then fetched back.

* Server [Under Protyping]
 - Server communicates in simple new line character termiated commands

 ```
  add friends {"007": {"name": "Christian"}, "001": {"name": "Robert"}} 86cebfv40Dklfly
 ```

 - The above is then parsed as:
 
 ```
  {command} {key} {value(optional)} {sessionKey} {misc}
 ```
 
* Sessions, but how?
 - Currently QCache only supports php but I will extend its support to other languages too. For php, it looks for the session file under ```/tmp``` directory and then maps the valid session keys into the file.


