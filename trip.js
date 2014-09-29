'use strict';

(function(){
	function encode_utf8( s ) {
	  return unescape( encodeURIComponent( s ) );
	}
	function toArray(str) {
		var array = [];
		var istr = encode_utf8(str);
		var mx=istr.length;
		for(var i=0;i<mx;i++) {
			array.push(istr.charCodeAt(i));
		}
		return array;
	}
	function toSjisArray(str) {
		var array = [];
		var istr = encode_utf8(str);
		var mx=istr.length;
		for(var i=0;i<mx;i++) {
			array.push(istr.charCodeAt(i));
		}
		return Encoding.convert(array, 'SJIS', 'UTF8');
	}
	function makeTrip(str) {
		var replaced = (str+"H.").replace(/[^\.-z]/g, ".").replace(/[:;<=>?@\[\\\]^_`]/g, function (m) {
		    return {
		        ':': 'A',
		        ';': 'B',
		        '<': 'C',
		        '=': 'D',
		        '>': 'E',
		        '?': 'F',
		        '@': 'G',
		        '[': 'a',
		        '\\': 'b',
		        ']': 'c',
		        '^': 'd',
		        '_': 'e',
		        '`': 'f'
		    }[m];
		});
		var key = toSjisArray(replaced).slice(1,3);
		var pass = toSjisArray(str).slice(0,8);
		var trip = Crypt(pass, key);
		return trip.slice(trip.length-10,trip.length);
	}
	function analyze(str){
		var r = $("#result");
		var trip = makeTrip(str);
		r.text(trip);
	}
	$(document).ready(function(){
		$("#form")[0].action=window.location.href;
		var qs = window.location.search;
		var vs=decode(qs.substr(1));
		if ( vs.hasOwnProperty("t") && vs.t != "" ) {
			analyze(vs.t);
			$("#input").val(vs.t);
		}
	});
})();
