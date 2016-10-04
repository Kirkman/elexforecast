load('sbbsdefs.js');
load('json-client.js');
load('frame.js');
load('js-date-format.js');

// some of the custom functions I'm using
load(js.exec_dir + "helper-functions.js");



var f = new File(js.exec_dir + "server.ini");
f.open("r");
var serverIni = f.iniGetObject();
f.close();


// CHARACTER SET NOTE:
// I edit this document in BBedit on the Mac. I've found I only get the right characters 
// if I save it in Western (Mac OS Roman) encoding. 

// COLORS
var lowWhite = 'NW0';
var highWhite = 'HW0';
var lowCyan = 'NC0';
var highCyan = 'HC0';
var highBlack = 'HK0';
var highYellowDarkBlue = 'HY4';
var highWhiteDarkCyan = 'HW6';

var lowWhiteHighRed = 'HR7';
var lowWhiteHighBlue = 'HB7';

var highRed = 'HR0';
var highBlue = 'HB0';

var lowRed = 'NR0';
var lowBlue = 'NB0';

var lowRedHighWhite = 'NW1';
var lowBlueHighWhite = 'NW4';

var lowRedLowWhite = 'HW1';
var lowBlueLowWhite = 'HW4';


// CHARACTERS
var charHorizSingle = ascii(196);
var charHorizSingleDownDouble = ascii(210);
var charVertDouble = ascii(186);
var frac12 = ascii(171);

var shade1 = ascii(176);
var shade2 = ascii(177);
var shade3 = ascii(178);
var solid = ascii(219);

// Frame for the whole app
var frame = new Frame(1, 1, 80, 24, 0);
frame.putmsg( lowWhite + 'hi' );




function getStateInfo( abbr ) {
	var states = [
		{ "nbrL":"me", "nbrR":"me", "nbrU":"hi", "nbrD":"hi", "abbr":"ak","long":"Alaska", "x":6, "y":1 },
		{ "nbrL":"ms", "nbrR":"ga", "nbrU":"nc", "nbrD":"wi", "abbr":"al","long":"Alabama", "x":48, "y":19 },
		{ "nbrL":"ks", "nbrR":"tn", "nbrU":"mo", "nbrD":"la", "abbr":"ar","long":"Arkansas", "x":36, "y":16 },
		{ "nbrL":"dc", "nbrR":"nm", "nbrU":"ut", "nbrD":"id", "abbr":"az","long":"Arizona", "x":18, "y":16 },
		{ "nbrL":"de", "nbrR":"ut", "nbrU":"or", "nbrD":"wa", "abbr":"ca","long":"California", "x":12, "y":13 },
		{ "nbrL":"ut", "nbrR":"ne", "nbrU":"wy", "nbrD":"nm", "abbr":"co","long":"Colorado", "x":24, "y":13 },
		{ "nbrL":"nj", "nbrR":"or", "nbrU":"ri", "nbrD":"de", "abbr":"ct","long":"Connecticut", "x":66, "y":10 },
		{ "nbrL":"sc", "nbrR":"az", "nbrU":"md", "nbrD":"ny", "abbr":"dc","long":"Washington D.C.", "x":60, "y":16 },
		{ "nbrL":"md", "nbrR":"ca", "nbrU":"ct", "nbrD":"vt", "abbr":"de","long":"Delaware", "x":66, "y":13 },
		{ "nbrL":"tx", "nbrR":"hi", "nbrU":"dc", "nbrD":"ny", "abbr":"fl","long":"Florida", "x":60, "y":22 },
		{ "nbrL":"al", "nbrR":"ok", "nbrU":"sc", "nbrD":"mi", "abbr":"ga","long":"Georgia", "x":54, "y":19 },
		{ "nbrL":"fl", "nbrR":"tx", "nbrU":"ak", "nbrD":"ak", "abbr":"hi","long":"Hawaii", "x":6, "y":22 },
		{ "nbrL":"sd", "nbrR":"in", "nbrU":"mn", "nbrD":"mo", "abbr":"ia","long":"Iowa", "x":36, "y":10 },
		{ "nbrL":"wa", "nbrR":"mt", "nbrU":"az", "nbrD":"nv", "abbr":"id","long":"Idaho", "x":18, "y":7 },
		{ "nbrL":"mn", "nbrR":"wi", "nbrU":"ms", "nbrD":"in", "abbr":"il","long":"Illinois", "x":42, "y":7 },
		{ "nbrL":"ia", "nbrR":"oh", "nbrU":"il", "nbrD":"ky", "abbr":"in","long":"Indiana", "x":42, "y":10 },
		{ "nbrL":"nm", "nbrR":"ar", "nbrU":"ne", "nbrD":"ok", "abbr":"ks","long":"Kansas", "x":30, "y":16 },
		{ "nbrL":"mo", "nbrR":"wv", "nbrU":"in", "nbrD":"tn", "abbr":"ky","long":"Kentucky", "x":42, "y":13 },
		{ "nbrL":"ok", "nbrR":"ms", "nbrU":"ar", "nbrD":"mn", "abbr":"la","long":"Louisiana", "x":36, "y":19 },
		{ "nbrL":"ri", "nbrR":"wa", "nbrU":"nh", "nbrD":"me", "abbr":"ma","long":"Massachusetts", "x":72, "y":7 },
		{ "nbrL":"va", "nbrR":"de", "nbrU":"nj", "nbrD":"dc", "abbr":"md","long":"Maryland", "x":60, "y":13 },
		{ "nbrL":"ak", "nbrR":"ak", "nbrU":"ma", "nbrD":"nh", "abbr":"me","long":"Maine", "x":72, "y":1 },
		{ "nbrL":"wi", "nbrR":"ny", "nbrU":"ga", "nbrD":"pa", "abbr":"mi","long":"Michigan", "x":54, "y":7 },
		{ "nbrL":"nd", "nbrR":"il", "nbrU":"la", "nbrD":"ia", "abbr":"mn","long":"Minnesota", "x":36, "y":7 },
		{ "nbrL":"ne", "nbrR":"ky", "nbrU":"ia", "nbrD":"ar", "abbr":"mo","long":"Missouri", "x":36, "y":13 },
		{ "nbrL":"la", "nbrR":"al", "nbrU":"tn", "nbrD":"il", "abbr":"ms","long":"Mississippi", "x":42, "y":19 },
		{ "nbrL":"id", "nbrR":"nd", "nbrU":"nm", "nbrD":"wy", "abbr":"mt","long":"Montana", "x":24, "y":7 },
		{ "nbrL":"tn", "nbrR":"sc", "nbrU":"wv", "nbrD":"al", "abbr":"nc","long":"North Carolina", "x":48, "y":16 },
		{ "nbrL":"mt", "nbrR":"mn", "nbrU":"tx", "nbrD":"sd", "abbr":"nd","long":"North Dakota", "x":30, "y":7 },
		{ "nbrL":"co", "nbrR":"mo", "nbrU":"sd", "nbrD":"ks", "abbr":"ne","long":"Nebraska", "x":30, "y":13 },
		{ "nbrL":"vt", "nbrR":"vt", "nbrU":"me", "nbrD":"ma", "abbr":"nh","long":"New Hampshire", "x":72, "y":4 },
		{ "nbrL":"pa", "nbrR":"ct", "nbrU":"ny", "nbrD":"md", "abbr":"nj","long":"New Jersey", "x":60, "y":10 },
		{ "nbrL":"az", "nbrR":"ks", "nbrU":"co", "nbrD":"mt", "abbr":"nm","long":"New Mexico", "x":24, "y":16 },
		{ "nbrL":"or", "nbrR":"wy", "nbrU":"id", "nbrD":"ut", "abbr":"nv","long":"Nevada", "x":18, "y":10 },
		{ "nbrL":"mi", "nbrR":"ri", "nbrU":"dc", "nbrD":"nj", "abbr":"ny","long":"New York", "x":60, "y":7 },
		{ "nbrL":"in", "nbrR":"pa", "nbrU":"wi", "nbrD":"wv", "abbr":"oh","long":"Ohio", "x":48, "y":10 },
		{ "nbrL":"ga", "nbrR":"la", "nbrU":"ks", "nbrD":"tx", "abbr":"ok","long":"Oklahoma", "x":30, "y":19 },
		{ "nbrL":"ct", "nbrR":"nv", "nbrU":"wa", "nbrD":"ca", "abbr":"or","long":"Oregon", "x":12, "y":10 },
		{ "nbrL":"oh", "nbrR":"nj", "nbrU":"mi", "nbrD":"va", "abbr":"pa","long":"Pennsylvania", "x":54, "y":10 },
		{ "nbrL":"ny", "nbrR":"ma", "nbrU":"vt", "nbrD":"ct", "abbr":"ri","long":"Rhode Island", "x":66, "y":7 },
		{ "nbrL":"nc", "nbrR":"dc", "nbrU":"va", "nbrD":"ga", "abbr":"sc","long":"South Carolina", "x":54, "y":16 },
		{ "nbrL":"wy", "nbrR":"ia", "nbrU":"nd", "nbrD":"ne", "abbr":"sd","long":"South Dakota", "x":30, "y":10 },
		{ "nbrL":"ar", "nbrR":"nc", "nbrU":"ky", "nbrD":"ms", "abbr":"tn","long":"Tennessee", "x":42, "y":16 },
		{ "nbrL":"hi", "nbrR":"fl", "nbrU":"ok", "nbrD":"nd", "abbr":"tx","long":"Texas", "x":30, "y":22 },
		{ "nbrL":"ca", "nbrR":"co", "nbrU":"nv", "nbrD":"az", "abbr":"ut","long":"Utah", "x":18, "y":13 },
		{ "nbrL":"wv", "nbrR":"md", "nbrU":"pa", "nbrD":"sc", "abbr":"va","long":"Virginia", "x":54, "y":13 },
		{ "nbrL":"nh", "nbrR":"nh", "nbrU":"de", "nbrD":"ri", "abbr":"vt","long":"Vermont", "x":66, "y":4 },
		{ "nbrL":"ma", "nbrR":"id", "nbrU":"ca", "nbrD":"or", "abbr":"wa","long":"Washington", "x":12, "y":7 },
		{ "nbrL":"il", "nbrR":"mi", "nbrU":"al", "nbrD":"oh", "abbr":"wi","long":"Wisconsin", "x":48, "y":7 },
		{ "nbrL":"ky", "nbrR":"va", "nbrU":"oh", "nbrD":"nc", "abbr":"wv","long":"West Virginia", "x":48, "y":13 },
		{ "nbrL":"nv", "nbrR":"sd", "nbrU":"mt", "nbrD":"co", "abbr":"wy","long":"Wyoming", "x":24, "y":10 }
	];
	for (var i=0; i<states.length; i++) {
		if ( states[i]['abbr'].toLowerCase() == abbr.toLowerCase() ) {
			return states[i];
		}
	}
	return false;
}






// Get statistics from JSON database
function getData() {
	try {
		var jsonClient = new JSONClient(serverIni.host, serverIni.port);
		var data = jsonClient.read("ELEXFORECAST", "ELEXFORECAST", 1);
		if (data === undefined) {
			debug("JSON client error: jsonClient returned undefined");
			jsonClient.disconnect();
			return false;
		}
		else {
			jsonClient.disconnect();
			return data;
		}
	}
	catch(err) {
		debug("JSON client error: " + err);
		return false;
	}
}

function displayTitle() {
	console.clear();
	frame.open();
	frame.cycle();
	var titleFrame = new Frame(1, 1, 80, 24, 0);
	titleFrame.load( js.exec_dir + 'graphics/elexforecast-title.bin');
	titleFrame.draw();
	var userInput = '';
	while( ascii(userInput) != 27 && ascii(userInput) != 81 && ascii(userInput) != 13) {
		userInput = console.getkey( K_UPPER );
	}
	titleFrame.close();
	titleFrame.delete();
}



function displayInfo ( data, abbr ) {
	var state;
	var stateName = 'NATIONAL'.center(14,' ');
	if ( abbr == 'us' ) {
		state = data[abbr];
	}
	else {
		for ( var s=0; s < data['states'].length; s++) {
			if ( data['states'][s]['abbr'].toLowerCase() == abbr.toLowerCase() ) {
				state = data['states'][s];
				stateName = getStateInfo( abbr )['long'].toUpperCase().center(14,' ');
			}
		}
	}

	var dem, rep;
	if ( state['candidates'][0]['party'] == 'D' ) {
		dem = state['candidates'][0];
		rep = state['candidates'][1];
	}
	else {
		dem = state['candidates'][1];
		rep = state['candidates'][0];
	}

	dWinProbStr = ( dem['winprob'].toString() + '%' ).ljust(5,' ');
	rWinProbStr = ( rep['winprob'].toString() + '%' ).rjust(5,' ');


	infoFrame.gotoxy(17,2);
	infoFrame.putmsg( highBlack + stateName );

	infoFrame.gotoxy(3,4);
	infoFrame.putmsg( highBlue + dWinProbStr );
	infoFrame.gotoxy(38,4);
	infoFrame.putmsg( highRed + rWinProbStr );

	dRepeat = Math.round( ( dem['winprob'] * 40) / 100 );
	rRepeat = 40 - dRepeat;

	var pctBar = highBlue + solid.repeat( dRepeat ) + highRed + solid.repeat( rRepeat );
	infoFrame.gotoxy(3,3);
	infoFrame.putmsg( pctBar );

	infoFrame.draw();
}



function displayMap( data ) {
	console.clear();
	frame.open();
	frame.cycle();

	// CONSTRUCT OBJECT TO HOLD ALL STATE INFO AND FRAMES

	var states = [];

	for (var i=0; i < data['states'].length; i++) {
		var stateData = data['states'][i];
		var stateInfo = getStateInfo( stateData['abbr'] );
		states.push(
			{
				'abbr': stateInfo['abbr'],
				'long': stateInfo['long'],
				'frame': new Frame(stateInfo['x'], stateInfo['y'], 4, 3, BG_BLACK, frame),
				'votes': stateData['votes'],
				'candidates': stateData['candidates']
			}
		);
	}

	// DRAW FRAMES WITH CORRECT SHADING

	for (var i=0; i < states.length; i++) {
		var cands = states[i]['candidates'];
		var dem, rep;
		var output = '';
		if ( cands[0]['party'] == 'D' ) {
			dem = cands[0];
			rep = cands[1];
		}
		else {
			dem = cands[1];
			rep = cands[0];
		}

		if ( dem['winprob'] > rep['winprob'] ) {
			if ( dem['winprob'] > 90 ) {
				output = lowBlue + solid + solid + solid + solid;
			}
			else if ( dem['winprob'] > 80 ) {
				output = lowBlueLowWhite + shade3 + shade3 + shade3 + shade3;
			}
			else if ( dem['winprob'] > 70 ) {
				output = lowBlueLowWhite + shade2 + shade2 + shade2 + shade2;
			}
			else if ( dem['winprob'] > 60 ) {
				output = lowBlueHighWhite + shade2 + shade2 + shade2 + shade2;
			}
			else if ( dem['winprob'] > 50 ) {
				output = lowBlueHighWhite + shade1 + shade1 + shade1 + shade1;
			}
		}
		else {
			if ( rep['winprob'] > 90 ) {
				output = lowRed + solid + solid + solid + solid;
			}
			else if ( rep['winprob'] > 80 ) {
				output = lowRedLowWhite + shade3 + shade3 + shade3 + shade3;
			}
			else if ( rep['winprob'] > 70 ) {
				output = lowRedLowWhite + shade2 + shade2 + shade2 + shade2;
			}
			else if ( rep['winprob'] > 60 ) {
				output = lowRedHighWhite + shade2 + shade2 + shade2 + shade2;
			}
			else if ( rep['winprob'] > 50 ) {
				output = lowRedHighWhite + shade1 + shade1 + shade1 + shade1;
			}
		}

		states[i]['frame'].open();
		states[i]['frame'].gotoxy(1,1);
		states[i]['frame'].putmsg( output );
		states[i]['frame'].gotoxy(1,2);
		states[i]['frame'].putmsg( output );
		states[i]['frame'].gotoxy(1,3);
		states[i]['frame'].putmsg( lowWhite + ' ' + states[i]['abbr'] + ' ');
		states[i]['frame'].draw();
	}


	displayInfo( data, 'us' );


	var creditFrame = new Frame( 38, 23, 20, 2, BG_BLACK, frame);
	creditFrame.gotoxy(1,1);
	creditFrame.putmsg( highBlack + 'Data source:' );
	creditFrame.gotoxy(1,2);
	creditFrame.putmsg( highBlack + 'FiveThirtyEight.com' );
	creditFrame.draw();


	// Keep running as long as the user hasn't hit [esc] or [q]
	var currentState = 'ak'
	var userInput = '';
	while( ascii(userInput) != 27 && ascii(userInput) != 81 ) {
		userInput = console.getkey( K_UPPER );
		if ( userInput == KEY_LEFT || userInput == KEY_RIGHT ||  userInput == KEY_UP || userInput == KEY_DOWN ) {
			switch( userInput ) {
				case KEY_LEFT:
					nextState = getStateInfo( currentState )['nbrL'].slice(0);
					break;
				case KEY_RIGHT:
					nextState = getStateInfo( currentState )['nbrR'].slice(0);
					break;
				case KEY_UP:
					nextState = getStateInfo( currentState )['nbrU'].slice(0);
					break;
				case KEY_DOWN:
					nextState = getStateInfo( currentState )['nbrD'].slice(0);
					break;
			}
			move( nextState );
			currentState = nextState.slice(0);
			nextState = '';
			displayInfo( data, currentState );
		}
	}
	cleanUp();
	exit();

}


var move = function( nbr ) {
	nbrObj = getStateInfo( nbr );
	var x = nbrObj['x'] - 1;
	var y = nbrObj['y'];
	highlightFrame.moveTo(x,y);
	highlightFrame.top();
	maskFrame( highlightFrame, solid, MAGENTA );
	highlightFrame.draw();
	frame.cycle();
}


var cleanUp = function() {
	frame.close();
	console.clear();
}




var data = getData();

displayTitle();

var highlightFrame = new Frame( 5, 1, 6, 3, undefined, frame);
highlightFrame.load( js.exec_dir + 'graphics/highlight.bin', 6, 3 );
highlightFrame.transparent = true;
maskFrame( highlightFrame, solid, LIGHTMAGENTA );
highlightFrame.close();
frame.draw();

var infoFrame = new Frame( 16, 1, 44, 5, BG_BLACK, frame);
infoFrame.load(
	js.exec_dir + 'graphics/cand-info.bin',
	44,
	5
);


displayMap( data );

// When done, remove all the frames
cleanUp();

// Quit
exit();
