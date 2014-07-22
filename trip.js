'use strict';

function decode(qs, sep, eq, options) {
// Copyright Joyent, Inc. and other Node contributors.
// https://github.com/Gozala/querystring/blob/master/decode.js
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!obj.hasOwnProperty(k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

function crypt(str)  {
    var data	= _f.inarea.value;
	var key     = _f.ukey.value;
	var mode    = _f.cmode[_f.cmode.selectedIndex].value;
	var iv      = des.mkIV();

    var useBase64   = _f.et[0].checked;
    var useURLstr   = _f.et[1].checked;
    var act         = _f.crypt[0].checked;
    var cryptTmp;

    if (!data.length) return;
    else if (act) // encrypt
    {
    	if (mode == 3) cryptTmp = des.tripleEnc(data, key, key.split("").reverse().join(""));
        else cryptTmp = des.encrypt(data, key, mode, iv);
        
        if (useBase64) cryptTmp = base64.encode(cryptTmp);
        else if (useURLstr) cryptTmp = utf.URLencode(cryptTmp);
    }
    else
    {
        if (useBase64) data = base64.decode(data);
        else if (useURLstr) data = utf.URLdecode(data);
        
        if (mode == 3) cryptTmp = des.tripleDec(data, key, key.split("").reverse().join(""));
        else cryptTmp = des.decrypt(data, key, mode);
    }
    _f.outarea.value = cryptTmp;
}
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

