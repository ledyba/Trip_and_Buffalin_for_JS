#! /usr/bin/ruby
# -*- coding: Windows-31J -*-

require 'kconv'
require "cgi"
#定数定義
$RequestHash = nil;
$QueryString = nil;
#クエリー分割
def initQuery(hash)
	hash.default = nil;
	$QueryString = "";
	if ENV.has_key?( 'QUERY_STRING' )
		$QueryString = ENV['QUERY_STRING'].dup;
		$QueryString.gsub!(/($&+)|(^&+)/,"");
		$QueryString.gsub!(/&&+/,"&");
		$QueryString.gsub!("&","&amp;")
	end
	$QueryString.freeze;#書き換え禁止
	cmd = $QueryString.split("&amp;");
	cmd.each(){|text|
		index = text.index("=");
		if index == nil
			next
		end
		key = text.slice(0..index-1);
		value = text.slice(index+1..text.length);
		hash.store(CGI.unescape(key.chomp),CGI.unescape(value.chomp));
	}
	$RequestHash = hash;
	return $RequestHash;
end

def closeRequest()
	$RequestHash = nil;
	$QueryString = nil;
end

def initRequest(query_hash = Hash::new)
	initQuery(query_hash);
	print "Content-type: text/html; charset=Shift_JIS\n\n"
end

def getTrip(key)
	if key == nil || key.length <= 0
		return nil;
	end
	salt = (key+"H.")[1,2].gsub(/[^\.-z]/, ".").tr(":;<=>?@[\\\\]^_`", "ABCDEFGabcdef");
	trip = key.crypt(salt);
	return trip[-10,10];
end

def main()
	initRequest();
	key = $RequestHash["t"];
	trip = getTrip(key);
	outHTML(key,trip);
	closeRequest();
end

def outHTML(key=nil,trip = nil)
	out_result = key!=nil && trip!=nil;
	if out_result
		key = CGI.escapeHTML(key).gsub(" ","&nbsp;")
		trip = CGI.escapeHTML(trip)
		trip_url = CGI.escape("◆"+trip)
	else
		key=''
		trip=''
	end
	puts '<?xml version="1.0" encoding="Shift_JIS"?>'
	puts '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
	puts '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">'
	puts '<head>'
	if out_result
		puts "<title>##{key}の暗号化結果 － 2chトリップ生成システム</title>"
	elsif
		puts '<title>2chトリップ生成システム</title>'
	end
	puts '<meta http-equiv="Content-Script-Type" content="text/javascript" />'
	puts '<meta http-equiv="Content-Style-Type" content="text/css" />'
	puts '</head>'
	puts '<body>'
	puts '<h1>2chトリップ生成システム</h1>'
	puts '<hr /><p>'
	puts '入力された文字列から、2chのトリップを生成します。<br />'
	puts 'その結果を用いてGoogleで検索してみたりも出来ます。使い方はあなた次第。'
	puts '</p><hr />'
	puts '<form method="get" action="/cgi/trip.rb">'
	puts '<p>'
	puts "トリップキー：#<input type=\"text\" name=\"t\" value=\"#{key}\" tabindex=\"1\" accesskey=\"1\" />"
	puts '<input type="submit" value="生成する" tabindex="2" accesskey="2" />'
	puts '<input type="reset" value="取消" tabindex="3" accesskey="3" />'
	puts '</p>'
	puts' </form>'
	puts '<hr />'
	if out_result
		puts "<p>トリップキー「<font color=\"green\">##{key}</font>」</p><p>を用いてトリップを生成すると、</p><p>トリップ「<font color=\"red\">◆#{trip}</font>」</p><p>になります。</p>"
		puts "<p><a href=\"http://www.google.com/search?q=#{trip_url}\">Googleで検索してみる</a>（<a href=\"http://www.google.com/search?q=#{trip_url}\" target=\"_blank\">別ウインドウ</a>）<p>"
	elsif
		puts '<p>生成するトリップキーを入力してください。</p>'
	end
	puts '<script type="text/javascript">'
	puts 'google_ad_client = "pub-3121031347596821";'
	puts 'google_ad_slot = "5134098739";'
	puts 'google_ad_width = 234;'
	puts 'google_ad_height = 60;'
	puts '</script>'
	puts '<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>'
	puts("<script type=\"text/javascript\">");
	puts("var gaJsHost = ((\"https:\" == document.location.protocol) ? \"https://ssl.\" : \"http://www.\");");
	puts("document.write(unescape(\"%3Cscript src='\" + gaJsHost + \"google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E\"));");
	puts("</script>");
	puts("<script type=\"text/javascript\">");
	puts("var pageTracker = _gat._getTracker(\"UA-4766333-1\");");
	puts("pageTracker._initData();");
	puts("pageTracker._trackPageview();");
	puts("</script>");
	puts '<hr />'
	puts '<p>'
	puts 'Written by <a href="http://ledyba.ddo.jp/">ψ（プサイ）</a><br />'
	puts '</p>'
	puts '</body>'
	puts '</html>'
end

main();
