'use strict';

(function(){
	function encode_utf8( s ) {
	  return unescape( encodeURIComponent( s ) );
	}
	var TABLE = ["下心", "微妙さ", "優雅さ", "華麗さ", "かわいさ", "やさしさ", "やましさ",
                  "やらしさ", "むなしさ", "ツンデレ", "厳しさ", "世の無常さ", "ハッタリ", "ビタミン",
                  "努力", "気合", "根性", "砂糖", "食塩", "愛", "電波", "毒電波", "元気玉",
                  "怨念", "大阪のおいしい水", "明太子", "勇気", "運", "電力", "小麦粉",
                  "汗と涙(化合物)", "覚悟", "大人の都合", "見栄", "欲望", "嘘", "真空", "呪詛",
                  "信念", "夢", "記憶", "鉄の意志", "カルシウム", "魔法", "希望", "不思議",
                  "勢い", "度胸", "乙女心", "罠", "花崗岩", "宇宙の意思", "犠牲", "毒物", "鉛",
                  "海水", "蛇の抜け殻", "波動", "純金", "情報", "知識", "知恵", "魂の炎", "媚び",
                  "保存料", "着色料", "税金", "歌", "苦労", "柳の樹皮", "睡眠薬", "スライム",
                  "アルコール", "時間", "果物", "玉露", "利益", "赤い何か", "白い何か", "鍛錬",
                  "月の光", "回路", "野望", "陰謀", "雪の結晶", "株", "黒インク", "白インク",
                  "カテキン", "祝福", "気の迷い", "マイナスイオン", "濃硫酸", "ミスリル", "お菓子",
                  "言葉", "心の壁", "成功の鍵", "理論", "血"];
	function shiftR(i) {
		var v = Math.floor(i) & 0x7fffffff;
		return Math.floor(v) * 2;
	}
	function shiftN(v, n) {
		for(var i=0;i<n;++i) {
			v = shiftR(v);
		}
		return v;
	}
	function getCode(str) {
		var len = str.length;
		var code = 0;
		for(var i=0;i<len;++i) {
			var v = ((str[i]) & 0xff);
			v = shiftN(v, (i & 0x3)<<0x3);
			code += v;
			code = code % 0x100000000;
		}
		return code;
	}
	function makeRand(seed) {
		return function(){
			seed *= 214013;
			seed = seed % 0x100000000;
			seed += 2531011; // ->次に呼び出されたときのseedに使う
			seed = seed % 0x100000000;
			var result = seed;
			result = result >> 0x10;
			result &= 0x7fff;
			return result;
		};
	}
	function analyze(code) {
		var rand = makeRand(code);
		var check = {};
		var elements = [];
		var left = 100;
		while(left > 0){
			var idx = rand() % 100;
			if(check.hasOwnProperty(idx) && check[idx]) {
				continue;
			}
			check[idx] = true;
			var percent = (rand() % left) + 1;
			elements.push({name: TABLE[idx], percent: percent});
			left -= percent;
		}
		return elements;
	};
	function out(name, elms){
		var ename = escapeHTML(name);
		var str = ename+"の成分解析結果 :<br>\n<br>\n";
		var strb = name+"の成分解析結果 :\n\n";
		elms.sort(function(a,b){ return a.percent < b.percent; });
		var left = 100;
		var before = 0;
		elms.forEach(function(it){
			if (it.percent == 50 && left == 50 && before == 50) {
				str = str+ename+"のもう半分は"+it.name+"で出来ています。<br>\n";
				strb = strb+name+"のもう半分は"+it.name+"で出来ています。\n";
			}else if (it.percent == 50) {
				str = str+ename+"の半分は"+it.name+"で出来ています。<br>\n";
				strb = strb+name+"の半分は"+it.name+"で出来ています。\n";
			}else if(it.percent == 100) {
				str = str+ename+"はすべて"+it.name+"で出来ています。<br>\n";
				strb = strb+name+"はすべて"+it.name+"で出来ています。\n";
			}else{
				str = str+ename+"の"+it.percent+"%は"+it.name+"で出来ています。<br>\n";
				strb = strb+name+"の"+it.percent+"%は"+it.name+"で出来ています。\n";
			}
			left -= it.percent;
			before = it.percent;
		});
		return {escaped: str, unescaped: strb};
	}
	function handler(str){
		var sjisArray = (function(){
			var array = [];
			var istr = encode_utf8(str);
			var mx=istr.length;
			for(var i=0;i<mx;i++) {
				array.push(istr.charCodeAt(i));
			}
			return Encoding.convert(array, 'SJIS', 'UTF8');
		})();;
		var r = $("#result");
		var code = getCode(sjisArray);
		r.empty();
		var c = out(str, analyze(code));
		$('<p/>').html(c.escaped).appendTo(r);
		$('<input/>')
			.attr("type", "button")
			.attr("value", "ツイートする")
			.on('click', function(){ tweet(c.unescaped); return false;})
			.appendTo(r);
	}
	$(document).ready(function(){
		$("#form")[0].action=window.location.href;
		var qs = window.location.search;
		var vs=decode(qs.substr(1));
		if ( vs.hasOwnProperty("Thing") && vs.Thing != "" ) {
			$("#input").val(vs.Thing);
			handler(vs.Thing);
		}
	});
})();
