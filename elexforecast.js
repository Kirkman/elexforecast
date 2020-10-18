load('sbbsdefs.js');
load('json-client.js');
load('frame.js');
load('js-date-format.js');

// some of the custom functions I'm using
load(js.exec_dir + 'helper-functions.js');


// Screen size
var termRows = console.screen_rows;
var termCols = console.screen_columns;


var f = new File(js.exec_dir + 'server.ini');
f.open('r');
var serverIni = f.iniGetObject();
f.close();


// https://stackoverflow.com/a/31687097
function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

// Adapted Bresenham JS routine
function line(x0, y0, x1, y1){
	var points = [];
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = dx-dy;

	while(true){
		points.push( [x0,y0] );
		if ((x0==x1) && (y0==y1)) break;
		var e2 = 2*err;
		if (e2 >-dy){ err -= dy; x0  += sx; }
		if (e2 < dx){ err += dx; y0  += sy; }
	}
	return points;
}



// CHARACTER SET NOTE:
// I edit this document in BBedit on the Mac. I've found I only get the right characters 
// if I save it in Western (Mac OS Roman) encoding. 

// COLORS
var lowWhite = 'NW0';
var highWhite = 'HW0';

var lowGreen = 'NG0';
var highGreen = 'HG0';
var lowBrown = 'NY0';
var highBrown = 'HY0';

var lowCyan = 'NC0';
var highCyan = 'HC0';
var lowBlack = 'NK0';
var highBlack = 'HK0';
var highYellowDarkBlue = 'HY4';
var highWhiteDarkCyan = 'HW6';

var lowWhiteHighRed = 'HR7';
var lowWhiteHighBlue = 'HB7';

var highRed = 'HR0';
var highBlue = 'HB0';

var lowRed = 'NR0';
var lowBlue = 'NB0';

var lowRedLowBlue = 'NR4';

var lowRedHighWhite = 'NW1';
var lowBlueHighWhite = 'NW4';

var lowRedLowWhite = 'HW1';
var lowBlueLowWhite = 'HW4';


// CHARACTERS
var charHorizSingle = ascii(196);
var charHorizSingleDownSingle = ascii(197);
var charHorizSingleDownDouble = ascii(210);
var charVertDouble = ascii(186);
var charVertSingle = ascii(179);
var frac12 = ascii(171);

var shade1 = ascii(176);
var shade2 = ascii(177);
var shade3 = ascii(178);
var solid = ascii(219);

var blockUpper = ascii(223);
var blockLower = ascii(220);
var blockMid = ascii(254);

var upTriangle = ascii(30);
var downTriangle = ascii(31);


// Frame for the whole app
var frame = new Frame(1, 1, termCols, termRows, 0);
frame.putmsg( lowWhite + 'hi' );


function sortByFirstElem(a, b) {
	if (a[0] === b[0]) {
		return 0;
	}
	else {
		return (a[0] < b[0]) ? -1 : 1;
	}
}


function getStateInfo( abbr ) {
	var states = [
		{ "nbrL":"me", "nbrR":"me", "nbrU":"hi", "nbrD":"hi", "abbr":"ak","long":"Alaska", "x":6, "y":1 },
		{ "nbrL":"ms", "nbrR":"ga", "nbrU":"nc", "nbrD":"wi", "abbr":"al","long":"Alabama", "x":48, "y":19 },
		{ "nbrL":"ks", "nbrR":"tn", "nbrU":"mo", "nbrD":"la", "abbr":"ar","long":"Arkansas", "x":36, "y":16 },
		{ "nbrL":"dc", "nbrR":"nm", "nbrU":"ut", "nbrD":"id", "abbr":"az","long":"Arizona", "x":18, "y":16 },
		{ "nbrL":"de", "nbrR":"ut", "nbrU":"or", "nbrD":"wa", "abbr":"ca","long":"California", "x":12, "y":13 },
		{ "nbrL":"ut", "nbrR":"ne", "nbrU":"wy", "nbrD":"nm", "abbr":"co","long":"Colorado", "x":24, "y":13 },
		{ "nbrL":"nj", "nbrR":"or", "nbrU":"ri", "nbrD":"de", "abbr":"ct","long":"Connecticut", "x":66, "y":10 },
		{ "nbrL":"sc", "nbrR":"az", "nbrU":"md", "nbrD":"fl", "abbr":"dc","long":"Washington DC", "x":60, "y":16 },
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
		{ "nbrL":"mi", "nbrR":"ri", "nbrU":"fl", "nbrD":"nj", "abbr":"ny","long":"New York", "x":60, "y":7 },
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
	while( ascii(userInput) != 27 && ascii(userInput) != 81 && ascii(userInput) != 13 ) {
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
			if ( dem['winprob'] > 88 ) {
				output = lowWhiteHighBlue + solid + solid + solid + solid;
			}
			else if ( dem['winprob'] > 75 ) {
				output = lowWhiteHighBlue + shade3 + shade3 + shade3 + shade3;
			}
			else if ( dem['winprob'] > 63 ) {
				output = lowWhiteHighBlue + shade2 + shade2 + shade2 + shade2
			}
			else if ( dem['winprob'] > 50 ) {
				output = lowWhiteHighBlue + shade1 + shade1 + shade1 + shade1;
			}
		}
		else {
			if ( rep['winprob'] > 88 ) {
				output = lowWhiteHighRed + solid + solid + solid + solid;
			}
			else if ( rep['winprob'] > 75 ) {
				output = lowWhiteHighRed + shade3 + shade3 + shade3 + shade3;
			}
			else if ( rep['winprob'] > 63 ) {
				output = lowWhiteHighRed + shade2 + shade2 + shade2 + shade2;
			}
			else if ( rep['winprob'] > 50 ) {
				output = lowWhiteHighRed + shade1 + shade1 + shade1 + shade1;
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


	var creditFrame = new Frame( 12, 23, 18, 2, BG_BLACK, frame);
	creditFrame.gotoxy(1,1);
	creditFrame.putmsg( highBlack + 'Data source:' );
	creditFrame.gotoxy(1,2);
	creditFrame.putmsg( highBlack + 'FiveThirtyEight' );
	creditFrame.draw();

	var instructFrame = new Frame( 38, 23, 18, 2, BG_BLACK, frame);
	instructFrame.gotoxy(1,1);
	instructFrame.putmsg( highBlack + 'Arrows: browse map' );
	instructFrame.gotoxy(1,2);
	instructFrame.putmsg( highBlack + 'Enter: next screen' );
	instructFrame.draw();



	// Keep running as long as the user hasn't hit [esc] or [q]
	var currentState = 'ak'
	var userInput = '';
	while( ascii(userInput) != 27 && ascii(userInput) != 81 && ascii(userInput) != 13 ) {
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

	for (var i=0; i < states.length; i++) {
		states[i]['frame'].delete();
	}
	creditFrame.delete();
	infoFrame.delete();
	instructFrame.delete();
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




// CHANGES TO MAKE: 
// Change green/brown color scheme to red/blue
// Need to add party info
// Need to re-scale x-axis


function displayLineChart( data ) {
	console.clear();
	frame.open();
	frame.cycle();

	// Supporting frames
	var lineFrame = new Frame(1, 1, termCols, termRows, undefined, frame);
	var chartFrame = new Frame(1, 1, termCols, termRows, undefined, frame);
	var labelFrame = new Frame(1, 1, termCols, termRows, undefined, frame);

	lineFrame.transparent = true;
	chartFrame.transparent = true;
	labelFrame.transparent = true;

	emptyFrame( lineFrame );
	emptyFrame( chartFrame );
	emptyFrame( labelFrame );

	var candidates = [];
	for (var key in data['history']) {
		candidates.push(key);
	}

	// Trim the data to most recent 80 days
	var overset = data['history'][candidates[0]].length - termCols;
	if (overset > 0) {
		data['history'][candidates[0]] = data['history'][candidates[0]].slice(-80);
		data['history'][candidates[1]] = data['history'][candidates[1]].slice(-80);
	}

	// Get dates for labels
	var startDate = new Date( data['history'][candidates[0]][0][0] );
	var endDate = new Date( data['history'][candidates[0]][termCols-1][0] );

	// Extract the data into separate arrays
	var cand_1_data = data['history'][candidates[0]].map(function(a) { return a[1] });
	var cand_2_data = data['history'][candidates[1]].map(function(a) { return a[1] });

	// Combine two arrays into one so we can get min, max
	var all_data = cand_1_data.concat( cand_2_data );

	// Get min, max
	// var dataMax = all_data.reduce(function(a, b) { return Math.max(a, b); });
	// var dataMin = all_data.reduce(function(a, b) { return Math.min(a, b); });

	// Let's use 0 and 100 to keep chart clear
	var dataMax = 100;
	var dataMin = 0;

	// Iterate over each series, convert each value into a Y-coordinate
	var cand_1_scaled = cand_1_data.map( function(a) { return parseInt( scaleBetween( a, (termRows-2)*2, 1, dataMin, dataMax ) ) });
	var cand_2_scaled = cand_2_data.map( function(a) { return parseInt( scaleBetween( a, (termRows-2)*2, 1, dataMin, dataMax ) ) });

	// Construct a Chart object
	var chart = [
		{ 'name': candidates[0], 'series': cand_1_scaled },
		{ 'name': candidates[1], 'series': cand_2_scaled }
	];

	// Build the chart background
	for (var y=0; y<termRows-1; y++) {
		var text;
		if (y == 0) {
			text = highBlack + charHorizSingleDownSingle + charHorizSingle + ' ' + (parseInt(dataMax).toString() + '%').ljust(3,' ') + charHorizSingle.repeat( termCols-7 ) + charHorizSingleDownSingle;
		}
		else if (y == parseInt(termRows-2)/2) {
			text = highBlack + charHorizSingleDownSingle + charHorizSingle + ' ' + (parseInt(50).toString() + '%').ljust(3,' ') + charHorizSingle.repeat( termCols-7 ) + charHorizSingleDownSingle;
		}
		else if (y == termRows-2) {
			text = highBlack + charHorizSingleDownSingle + charHorizSingle + ' ' + (parseInt(dataMin).toString() + '%').ljust(3,' ') + charHorizSingle.repeat( termCols-7 ) + charHorizSingleDownSingle;
		}
		else {
			text = highBlack + charVertSingle + ' '.repeat( termCols-2 ) + charVertSingle;
		}
		lineFrame.gotoxy(1,y+1);
		lineFrame.putmsg( text );
	}




	// Label begin date
	lineFrame.gotoxy(1,termRows);
	text = highBlack + upTriangle + ' ' + startDate.format('MMM D').ljust(12, ' ');
	lineFrame.putmsg( text );

	// Label end date
	lineFrame.gotoxy(termCols-14,termRows);
	text = highBlack + endDate.format('MMM D').rjust(12, ' ') + ' /';
	lineFrame.putmsg( text );

	// Legend
	lineFrame.gotoxy(13,termRows);
	text = lowWhite + 'How the forecast has changed'.ljust(34,' ') + highBlue + blockMid + lowWhite + ' ' + candidates[0].ljust(11,' ') + highRed + blockMid + lowWhite + ' ' + candidates[1];
	lineFrame.putmsg( text );

	lineFrame.draw();

	// Create array to hold pixels
	var pixel_array = [];
	for (var i = 0; i < termRows*2; i++) {
		var row = [];
		for (var j = 0; j < termCols; j++) {
			row[j] = 0;
		}
		pixel_array[i] = row;
	}

	// Iterate over data points and draw lines from point to point
	for (var p=0; p < chart.length; p++ ) {
		var values = chart[p].series;
		for (var v=0; v<values.length; v++ ) {

			var this_y = values[v];
			var this_x = v;
			var points = [];

			// if this is not the last coordinate, then compute a line from present coordinate to next coordinate
			if ( v<values.length-1 ) {
				var next_y = values[v+1];
				var next_x = v+1;
				points = line( this_x, this_y, next_x, next_y );
			}
			// if this is the last coordinate, just use this single coordinate. no lines.
			else {
				points = [ [this_x, this_y] ];
			}

			// Now that we've computed all points to be plotted, actually plot them within our pixel array.
			for (var pt=0; pt<points.length; pt++) {
				// debug ('p: ' + p + ' | v: ' + v + ' | pt: ' + pt);
				// debug ('pt: ' + pt);
				// debug ( points[pt] );
				try {
					pixel_array[ points[pt][1] ][ points[pt][0] ] = p+1;
				}
				catch(e) {
					debug('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
					debug(e);
					debug( points[pt][1] );
					debug( pixel_array );
				}

			}

		}
	}

	// for (var i = 0; i < pixel_array.length; i++) {
	// 	debug(pixel_array[i]);
	// }

	var attrs = [undefined, highBlue, highRed];
	// debug( 'pixel_array.length (Y): ' + pixel_array.length );
	// debug( 'pixel_array[0].length (x): ' + pixel_array[0].length );

	// Render pixel array to ANSI screen
	for (var i = 0; i < pixel_array.length; i+=2) {
		var y = (i+2)/2 - 1;
		for (var x = 0; x< pixel_array[i].length; x++) {
			var top = pixel_array[i][x];
			var bot = pixel_array[i+1][x];
			var theCh = undefined, theAttr = undefined;

			// Determine how to color this block

			// Solid block, same color
			if ( top == bot && top > 0 ) {
				theCh = solid;
				theAttr = attrs[top];
			}
			// Empty cell, set to transparent
			else if ( top == bot ) {
				theCh = undefined;
				theAttr = undefined;
			}
			// Half block, only top has color
			else if ( bot == 0 ) {
				theCh = blockUpper;
				theAttr = attrs[top];
			}
			// Half block, only bottom has color
			else if ( top == 0 ) {
				theCh = blockLower;
				theAttr = attrs[bot];
			}

			// I'M IGNORING THIS PART. I want to use high colors, and obviously can't use high Red and high Blue together.
			// But the lines on this chart will never intersect in 2020, so it doesn't matter.

			// // Half blocks, two colors. Green top, brown bottom
			// else if ( top == 1 && bot == 2 ) {
			// 	theCh = blockUpper;
			// 	theAttr = 'NG3';
			// }
			// // Half blocks, two colors. Brown top, green bottom
			// else if ( top == 2 && bot == 1 ) {
			// 	theCh = blockLower;
			// 	theAttr = 'NG3';
			// }

			// Not implemented yet. Probably shouldn't get here.
			else {
			}

			if (theCh || theAttr) {
				try {
					chartFrame.setData(x,y, theCh, theAttr);
				}
				catch(e) {
					debug('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
					debug(e);
					debug('top: ' + top +  ' | bot: ' + bot);
					debug('theCh: ' + theCh +  ' | theAttr: ' + theAttr);
					debug('i: ' + i +  ' | x: ' + x + ' | y: ' + y);
					debugFrame(chartFrame);
				}

			}
		}

	}


	// Attach labels
	for (var c=0; c<2; c++) {
		var ly = chart[c]['series'][termCols-1] / 2;

		if ( parseInt(ly) != ly ) { 
			ly = parseInt(ly) - 1;
		}
		else {
			ly = ly + 2;	
		}
		labelFrame.gotoxy( 72, ly);
		labelFrame.putmsg( attrs[c+1] + candidates[c] );
		labelFrame.gotoxy( 72, ly+1);
		if (c==0) {
			labelFrame.putmsg( attrs[c+1] + (cand_1_data[termCols-1]) + '%' );
		}
		else {
			labelFrame.putmsg( attrs[c+1] + (cand_2_data[termCols-1]) + '%' );
		}
	}



	lineFrame.open();
	lineFrame.top();
	chartFrame.open();
	chartFrame.top();
	labelFrame.open();
	labelFrame.top();

	frame.cycle();
	// frame.screenShot( js.exec_dir + '/graph.bin' );

	var userInput = '';

	while( ascii(userInput) != 27 && ascii(userInput) != 81 && ascii(userInput) != 13 ) {
		userInput = console.getkey( K_UPPER );
	}
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

displayLineChart( data );

// When done, remove all the frames
cleanUp();

// Quit
exit();
