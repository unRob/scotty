$(function(){

	document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });

	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'transition':'transitionend',
	      'OTransition':'oTransitionEnd',
	      'MozTransition':'transitionend',
	      'WebkitTransition':'webkitTransitionEnd'
	    };

	    for(t in transitions){
	        if(el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }
	}

	/* Listen for a transition! */
	var transitionEvent = whichTransitionEvent();
	transitionEvent && $('body').get(0).addEventListener(transitionEvent, function(evt){
		var target = evt.target;
		switch(target.tagName) {
			case 'A':
				$('h1').addClass('hidden');
				$('.active-number').removeClass('active-number');
				$('#beaming li:first-child').addClass('active-number');
				break;
			case 'BODY':
				$('body').removeClass('beaming');
				setTimeout(function(){
					$('body').removeClass('beamed');
					$('h1').removeClass('hidden');
				})
		}
	});

	var animationEvent = function whichAnimationEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var animations = {
	      'animation':'animationend',
	      'OAnimation':'oAnimationEnd',
	      'MozAnimation':'animationend',
	      'WebkitAnimation':'webkitAnimationEnd'
	    };

	    for(t in animations){
	        if(el.style[t] !== undefined ){
	            return animations[t];
	        }
	    }
	};

	$('body').get(0).addEventListener(animationEvent(), function(evt){
		switch(evt.animationName) {
			case 'rising':
				$('body').addClass('beamed');
				$('.active-number').removeClass('active-number');
				$('body').removeClass('beaming');
				break;
			case 'countdown':
				var current = evt.target;
				next = current.nextElementSibling;
				if (next && next.tagName == 'LI') {
					current.classList.remove('active-number');
					next.classList.add('active-number');
				}
				break;
			default:
				console.log(evt.animationName);
		}
	});

	var Token = function(data){
		if (data) {
			data = (typeof data === 'string') ? JSON.parse(data) : data;
			this.token = data.token;
			if (data.expires) {
				console.log('setting expires');
				this.expires = data.expires;
				setTimeout(this.gc, (new Date()-this.expires));
			}
			if (data.admin) this.admin = data.admin;
			localStorage.token = JSON.stringify({
				token: this.token,
				expires: this.expires,
				admin: this.admin
			});
		}
	};

	Token.prototype.expired = function(){
		return this.expires ? (new Date() < this.expires) : false;
	};

	Token.prototype.gc = function(){
		console.log('garbage cleaning!');
		localStorage.removeItem('token');
	};

	Token.prototype.valid = function(){
		return this.token ? !this.expired() : false;
	};

	var socket = io.connect('http://'+window.location.hostname);
	var token = new Token(localStorage.token);
	var frases = ['Hola', 'Niltze', 'Kao', 'Olá', 'Hello', 'Ciao', 'Zdravo', 'नमस्कार', 'Hallo', ['Bonjour', 'Bonsoir'], 'こんにちは', 'Γεια σας'];
	frases.random = function(){
		var greeting = this[Math.floor(Math.random()*this.length)];
		if (typeof greeting !== 'string') {
			var d = new Date();
			greeting = greeting[+(d.getHour()>12)];
		}
		return greeting;
	};

	var DOM = {
		passphrase: $('#passphrase')
	};

	socket.on('connect', function(){
		$('header').text('conectado').removeClass('offline');
	});

	socket.on('disconnect', function(){
		$('header').text('reconectando').addClass('offline');
	});

	if (token.valid()) {
		socket.emit('auth', {token: token.token});
	} else {
		console.log(token);
		if (token.token) token.gc();
	}

	socket.on('authorized', function(data){
		$('body').addClass('unlocked');
		DOM.passphrase.blur();
		console.log(data);
		token = new Token(data);
		console.log('saved');
	});

	socket.on('unauthorized', function(){
		$('body').removeClass('unlocked');
		console.log('unauthorized');
		token.gc();
	});

	var started = null;
	socket.on('beaming', function(){
		console.log("Response time: "+((new Date())-started)/1000+'s')
		console.log('done!');
	});

	socket.on('error', function(){
		console.log("Response time: "+((new Date())-started)/1000+'s')
		console.log('error');
	});

	var failed_login = function(){
		DOM.passphrase.addClass('error').focus();
		setTimeout(function(){
			DOM.passphrase.removeClass('error');
		}, 2000);
	};

	$('#login').on('submit', function(evt){
		evt.preventDefault();
		var pwd = $.trim(DOM.passphrase.val());

		if (pwd === '') {
			failed_login();
			return false;
		}

		var req = $.get('/auth/'+pwd);
		req.then(function(rs){
			DOM.passphrase.blur();
			socket.emit('auth', {token: rs.token});
		});
		req.fail(failed_login);
	});


	$('#beam').on('click', function(evt){
		evt.preventDefault();
		$('#frase').text(frases.random());
		$('body').addClass('beaming');
		socket.emit('beam');
		started = new Date();
	});

});