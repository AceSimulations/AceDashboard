window.onload = function() {
  var can = document.getElementById('canvas'),
      spanProcent = document.getElementById('procent'),
       c = can.getContext('2d');
 
  var posX = can.width / 2,
      posY = can.height / 2,
      fps = 1000 / 200,
      procent = 0,
      oneProcent = 360 / 100,
      result = oneProcent * 96;
  
  c.lineCap = 'square';
  arcMove();
  
  function arcMove(){
    var deegres = 0;
    var acrInterval = setInterval (function() {
      deegres += 1;
      c.clearRect( 0, 0, can.width, can.height );
      procent = deegres / oneProcent;

      spanProcent.innerHTML = procent.toFixed();

      c.beginPath();
      c.arc( posX, posY, 70, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
      c.strokeStyle = '#b1b1b1';
      c.lineWidth = '10';
      c.stroke();

      c.beginPath();
      c.strokeStyle = '#e60f0f';
      c.lineWidth = '10';
      c.arc( posX, posY, 70, (Math.PI/180) * 270, (Math.PI/180) * (270 + deegres) );
      c.stroke();
      if( deegres >= result ) clearInterval(acrInterval);
    }, fps);
    
  }
}

function overview() {
  if (document.getElementById('overview').style.display == 'block') {
    document.getElementById('resources').style.display = 'none';
    document.getElementById('no-info').style.display = 'block';
    console.log('Already Opened');
    document.getElementById('overviewClick').classList.remove('nav');
    document.getElementById('usersClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.remove('nav-active');
    document.getElementById('overviewClick').classList.add('nav-active');
    document.getElementById('usersClick').classList.add('nav');
    document.getElementById('flightsClick').classList.add('nav');
  }
  else if (document.getElementById('users').style.display == 'block') {
    document.getElementById('resources').style.display = 'none';
    document.getElementById('no-info').style.display = 'block';
    document.getElementById('users').style.animation = 'slide 2s forwards';
    document.getElementById('overview').style.animation = 'slidein 2s forwards';
    document.getElementById('overview').style.display = 'block';
    document.getElementById('overviewClick').classList.remove('nav');
    document.getElementById('usersClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.remove('nav-active');
    document.getElementById('overviewClick').classList.add('nav-active');
    document.getElementById('usersClick').classList.add('nav');
    document.getElementById('flightsClick').classList.add('nav');
    setTimeout(function() {
      document.getElementById('users').style.display = 'none';
    }, 1500)
  }
  else if (document.getElementById('flights').style.display == 'block') {
    document.getElementById('resources').style.display = 'none';
    document.getElementById('no-info').style.display = 'block';
    document.getElementById('flights').style.animation = 'slide 2s forwards';
    document.getElementById('overview').style.animation = 'slidein 2s forwards';
    document.getElementById('overview').style.display = 'block';
    document.getElementById('overviewClick').classList.remove('nav');
    document.getElementById('usersClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.remove('nav-active');
    document.getElementById('overviewClick').classList.add('nav-active');
    document.getElementById('usersClick').classList.add('nav');
    document.getElementById('flightsClick').classList.add('nav');
    setTimeout(function() {
      document.getElementById('flights').style.display = 'none';
    }, 1500)
  }
}

function users() {
  if (document.getElementById('users').style.display == 'block') {
    document.getElementById('resources').style.display = 'none';
    document.getElementById('no-info').style.display = 'block';
    console.log('Already Opened');
    document.getElementById('usersClick').classList.remove('nav');
    document.getElementById('overviewClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.remove('nav-active');
    document.getElementById('usersClick').classList.add('nav-active');
    document.getElementById('overviewClick').classList.add('nav');
    document.getElementById('flightsClick').classList.add('nav');
  }
  else if (document.getElementById('overview').style.display == 'block') {
    document.getElementById('resources').style.display = 'none';
    document.getElementById('no-info').style.display = 'block';
    document.getElementById('overview').style.animation = 'slide 2s forwards';
    document.getElementById('users').style.animation = 'slidein 2s forwards';
    document.getElementById('users').style.display = 'block';
    document.getElementById('usersClick').classList.remove('nav');
    document.getElementById('overviewClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.remove('nav-active');
    document.getElementById('usersClick').classList.add('nav-active');
    document.getElementById('overviewClick').classList.add('nav');
    document.getElementById('flightsClick').classList.add('nav');
    setTimeout(function() {
      document.getElementById('overview').style.display = 'none';
    }, 1500)
  }
  else if (document.getElementById('flights').style.display == 'block') {
    document.getElementById('resources').style.display = 'none';
    document.getElementById('no-info').style.display = 'block';
    document.getElementById('flights').style.animation = 'slide 2s forwards';
    document.getElementById('users').style.animation = 'slidein 2s forwards';
    document.getElementById('users').style.display = 'block';
    document.getElementById('usersClick').classList.remove('nav');
    document.getElementById('overviewClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.remove('nav-active');
    document.getElementById('usersClick').classList.add('nav-active');
    document.getElementById('overviewClick').classList.add('nav');
    document.getElementById('flightsClick').classList.add('nav');
    setTimeout(function() {
      document.getElementById('flights').style.display = 'none';
    }, 1500)
  }
}

function flights() {
  if (document.getElementById('flights').style.display == 'block') {
    console.log('Already Opened');
    document.getElementById('resources').style.display = 'block';
    document.getElementById('no-info').style.display = 'none';
    document.getElementById('flightsClick').classList.remove('nav');
    document.getElementById('overviewClick').classList.remove('nav-active');
    document.getElementById('usersClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.add('nav-active');
    document.getElementById('overviewClick').classList.add('nav');
    document.getElementById('usersClick').classList.add('nav');
  }
  else if (document.getElementById('users').style.display == 'block') {
    document.getElementById('resources').style.display = 'block';
    document.getElementById('no-info').style.display = 'none';
    document.getElementById('users').style.animation = 'slide 2s forwards';
    document.getElementById('flights').style.animation = 'slidein 2s forwards';
    document.getElementById('flights').style.display = 'block';
    document.getElementById('flightsClick').classList.remove('nav');
    document.getElementById('overviewClick').classList.remove('nav-active');
    document.getElementById('usersClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.add('nav-active');
    document.getElementById('overviewClick').classList.add('nav');
    document.getElementById('usersClick').classList.add('nav');
    setTimeout(function() {
      document.getElementById('users').style.display = 'none';
    }, 1500)
  }
  else if (document.getElementById('overview').style.display == 'block') {
    document.getElementById('resources').style.display = 'block';
    document.getElementById('no-info').style.display = 'none';
    document.getElementById('overview').style.animation = 'slide 2s forwards';
    document.getElementById('flights').style.animation = 'slidein 2s forwards';
    document.getElementById('flights').style.display = 'block';
    document.getElementById('flightsClick').classList.remove('nav');
    document.getElementById('overviewClick').classList.remove('nav-active');
    document.getElementById('usersClick').classList.remove('nav-active');
    document.getElementById('flightsClick').classList.add('nav-active');
    document.getElementById('overviewClick').classList.add('nav');
    document.getElementById('usersClick').classList.add('nav');
    setTimeout(function() {
      document.getElementById('overview').style.display = 'none';
    }, 1500)
  }
}

function help() {
    document.getElementById('home').style.animation = 'slidedown 2s forwards';
    document.getElementById('side-bar').style.animation = 'slidedown 2s forwards';
    document.getElementById('help').style.animation = 'slidein 2s forwards';
    document.getElementById('help').style.display = 'block';
    document.getElementById('homeClick').classList.remove('nav-content-active');
    document.getElementById('helpClick').classList.remove('nav-content');
    document.getElementById('homeClick').classList.add('nav-content');
    document.getElementById('helpClick').classList.add('nav-content-active');
    setTimeout(function() {
      document.getElementById('home').style.display = 'none';
      document.getElementById('slide-bar').style.display = 'none';
    }, 1500)
}

function home() {
  document.getElementById('help').style.animation = 'slidedown 2s forwards';
  document.getElementById('home').style.animation = 'slidein 2s forwards';
  document.getElementById('side-bar').style.animation = 'slidein 2s forwards';
  document.getElementById('home').style.display = 'block';
  document.getElementById('side-bar').style.display = 'block';
  document.getElementById('helpClick').classList.remove('nav-content-active');
  document.getElementById('homeClick').classList.remove('nav-content');
  document.getElementById('helpClick').classList.add('nav-content');
  document.getElementById('homeClick').classList.add('nav-content-active');
  setTimeout(function() {
    document.getElementById('help').style.display = 'none';
  }, 1500)
}

var t = setInterval(startTime, 1000);

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();

  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML =
  h + ":" + m + ":" + s;
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function displayFlight() {
  document.getElementById('no-info').style.display = 'none';
  document.getElementById('flight-detail').style.display = 'block';
}