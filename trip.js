'use strict';

(function(){
	function encode_utf8( s ) {
	  return unescape( encodeURIComponent( s ) );
	}
	function analyze(str){
		var array = [];
		var istr = encode_utf8(str);
		var mx=istr.length;
		for(var i=0;i<mx;i++) {
			array.push(istr.charCodeAt(i));
		}
		var sjisArray = Encoding.convert(array, 'SJIS', 'UTF8');  
		var r = $("#result");
		r.text(Encoding.urlEncode(sjisArray));
	}
	$(document).ready(function(){
		$("#form")[0].action=window.location.href;
		var qs = window.location.search;
		var vs=decode(qs.substr(1));
		if ( vs.hasOwnProperty("t") && vs.t != "" ) {
			analyze(vs.t);
		}
	});
})();

