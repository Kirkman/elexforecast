function debug(debugText) {
	var debugFile = new File( js.exec_dir + '/debug.txt' );
	debugFile.open("a");
	debugFile.write( '\n' + debugText + '\n' );
	debugFile.close();
}



// Make transparent the parts of a frame that match a given char and attr
function maskFrame(theFrame,maskChar,maskAttr) {
	var x, y, xl, yl;
	xl = theFrame.data.length;
	for (x=0; x<xl; x++) {
		yl = theFrame.data[x].length;
		for (y=0; y<yl; y++) {
			var theChar = theFrame.data[x][y];
			// If this character matches, then delete the character attributes 
			// in order to make it act as transparent.
			if (theChar.ch == maskChar && theChar.attr == maskAttr) {
				theFrame.data[x][y].ch = undefined;
				theFrame.data[x][y].attr = undefined;
			}
		}
	}
}

// Make frame completely transparent
function emptyFrame(theFrame) {
	var x, y, xl, yl;
	xl = theFrame.data.length;
	for (x=0; x<xl; x++) {
		yl = theFrame.data[x].length;
		for (y=0; y<yl; y++) {
			theFrame.data[x][y].ch = undefined;
			theFrame.data[x][y].attr = undefined;
		}
	}
}


// String repeat
// From: http://snipplr.com/view/699/stringrepeat/
String.prototype.repeat = function( num ) {
	for( var i = 0, buf = ''; i < num; i++ ) buf += this;
	return buf;
}

// Text left justify, right justify, and center
// From: http://snipplr.com/view/709/stringcenter-rjust-ljust/
String.prototype.ljust = function( width, padding ) {
	padding = padding || ' ';
	padding = padding.substr( 0, 1 );
	if ( this.length < width ) {
		return this + padding.repeat( width - this.length );
	}
	else {
		return this;
	}
}
String.prototype.rjust = function( width, padding ) {
	padding = padding || ' ';
	padding = padding.substr( 0, 1 );
	if( this.length < width ) {
		return padding.repeat( width - this.length ) + this;
	}
	else {
		return this;
	}
}
String.prototype.center = function( width, padding ) {
	padding = padding || ' ';
	padding = padding.substr( 0, 1 );
	if( this.length < width ) {
		var len		= width - this.length;
		var remain	= ( len % 2 == 0 ) ? '' : padding;
		var pads	= padding.repeat( parseInt( len / 2 ) );
		return pads + this + pads + remain;
	}
	else {
		return this;
	}
}


// Split an array into a chunks of a certain size
// (turn one array into an array of smaller arrays, no longer than LEN)
// http://stackoverflow.com/a/11764168

function chunk(arr, len) {
	var chunks = [], i = 0, n = arr.length;
	while (i < n) {
		chunks.push(arr.slice(i, i += len));
	}
	return chunks;
}



// Get distinct values from an array of objects
// http://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
function uniqueBy(arr, fn) {
  var unique = {};
  var distinct = [];
  arr.forEach(function (x) {
    var key = fn(x);
    if (!unique[key]) {
      distinct.push(key);
      unique[key] = true;
    }
  });
  return distinct;
}


// Sort an array of objects by a key
// Adapted to sort in reverse order
// http://stackoverflow.com/a/8837505/566307
function sortByKey(array, key) {
	return array.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	});
}


function hasDecimal(num) {
	return (num % 1 != 0);
}

function isOdd(num) { return num % 2 == 1; }


// It's better to construct dates this way than `new Date("2015-01-01")`
// because the new Date() method leaves things off by 1 day (thanks to
// time zones)
function parseDate(input) {
	var parts = input.split('-');
	// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
	return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}
