express = require 'express'
app = express()
server = require('http').createServer app
io = require('socket.io').listen(server)
SIPClient = require('sip-client');
util = require('util');
fs = require('fs')
mongo = require('mongodb').MongoClient
registerTimeout = null
path = require('path')
http = require 'http'  

config = JSON.parse(fs.readFileSync path.resolve(__dirname,'config.json'))
server.listen(8137)
app.use(express.static('public'))


sip = yes
sipClient = new SIPClient(config.sip);
db = null

io.set('log level', 1)

mongo.connect 'mongodb://localhost:27017/scotty', (err, dbo)->
	throw err if err
	util.log 'Mongo connected'
	db = dbo


httpOpts = 
	hostname: '10.0.1.12'
	port: 80,
	path: '/',
	method: 'GET'

beamMeUp = (cb)->
	console.log 'beaming'
	req = http.request httpOpts
	req.on 'response', (res)->
		console.log('responded')
		cb && cb(false)
	req.on 'error', (res)->
		console.log('err', res)
		cb && cb(true)

	req.end()
	return true

app.get '/', (req,res)->
	res.sendfile('index.html');

app.get '/auth/:passcode', (req, res)->
	where = {passcode: req.params.passcode}
	#console.log(where);
	db.collection('codes').findOne where, (err, token)->
		if (token)
			res.send({token: token.token})
		else
			res.send(404, {error: 'No encontré ese passcode :/'})
		return true


io.on 'connection', (socket)->
	socket.emit 'message', {status: 'connected'}

	socket.on 'auth', (data)->
		#socket.emit('unauthorized', {error: 'unauthorized'})
		db.collection('codes').findOne {token: data.token}, (err, token)->
			#console.log(err, token);
			if (token)
				data =
					expires: token.expires
		
				if token.admin
					data.admin = yes
		
				socket.set 'authorized', true, ()->
					socket.emit 'authorized', data
			else
				socket.emit('unauthorized', {error: 'unauthorized'})

		
	socket.on 'beam', ()->
		socket.get 'authorized', (err, okay)->
			if err
				socket.emit('unauthorized', {error: 'unauthorized'})
			else
				beamMeUp (err)->
					if err
						socket.emit('error')
					else
						socket.emit('beaming')
				


uri =
    schema: 'sip',
    host: config.sip.host,
    user: config.sip.user
	
headers =
    contact: "<sip:"+config.sip.host+":5060>",
    from: {
        name: 'A SIP User',
        uri: uri
        params: {tag: 'scotty'}
    },
    to: {
        name: 'A SIP User',
        uri: uri
    }
	

onInvite = (msg)=>
	console.log 'invite!'
	from = sipClient.sip.parseUri(msg.headers.from.uri).user
	console.log from
	if (config.allowed.indexOf(from) > -1)
		util.log 'beaming'
		beamMeUp()
	else
		console.log from

sipClient.on 'invite', onInvite

registerMessage = sipClient.message('register', uri, headers)
sipRegister = ()->
	registerMessage.send().on 'success', (msg)->
		util.log('SIP Registered')
		registerTimeout = setTimeout sipRegister, 45*60*1000

sipRegister() if sip

