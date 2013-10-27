QCache
======

* Under Construction, mind your coding
 

A modern era Session Based Memory Cache using nodejs technology

## What is it?

QCache is a project that stumbled upon my mind when I got fed up of old lame memcache technique and there were none availaible that stands different.
It is a more advance caching server which caters both client as well as server.

## How it do things?

Qcache uses 2 communications:

* Client: It uses an HTTP server to cater the client requests
* [BETA Framework] Server: A TCP server to manage the server and data on it

For client the QCache replies with JSON response while for the application server it uses a normal TCP byte level transmission.

* Client
 - A Client communicates through the URL that is then parsed i.e.

 ```
  http://xyz.com:6000/get/friends
 ```
- The above will be mapped to the friend key in the session object of the client and is then fetched back. i.e.
- The QCache holds the entries for each and every session independently, those are mapped therefore/

* Server [BETA Framework]
 - Server communicates in simple new line character termiated commands

 ```
  add 86cebfv40Dklfly friends {"007": {"name": "Christian"}, "001": {"name": "Robert"}}
 ```

 - The above is then parsed as:
 
 ```
  {command} {sessionKey} {key} {value(optional)}
 ```
 - The {value} can be a simple string, or an objecct or an array.

* Sessions, but how?
  Currently QCache supports php and JSP(under dev) but I will extend its support to other languages too. For php, it looks for the session file under ```/tmp``` directory and then maps the valid session keys into the file. Whereas in JSP, you need to slighly modify your session handling procedure i.e. You need to incorportate a custom session module into your application, who in turn will create session files similar to the php one.

* Using QCache from the server

To use QCache from your application server as a replacement of the existing memCache is simply by using the API provided in the folder ```/API/``` you can pick the one that belongs to your platform and can simple plug and play it
Like, in php

```
require_once('/QCache.php');
session_start();   // Must thing!!

/*
   Connect to the node
*/
$memCache = new QCache("127.0.0.1", 8080);

/*
   Login into the QCache server, the password is sent as a md5
*/
$memCache->connect("root", "Aja*|ra");

/*
   Now you can add/remove/modify the enteries
*/
$memCache->add("name", "dronRathore");

```

Now on the client end, the valid session client can access the data using a simple call as

```
http://myserver.com:81/get/name
```
The above will return the below JSON
```
{data={
    name: "dronRathore"
}}
```
