#! /usr/bin/ruby
# -*- coding: Windows-31J -*-

require 'kconv'
require "cgi"
#�萔��`
$RequestHash = nil;
$QueryString = nil;
#�N�G���[����
def initQuery(hash)
	hash.default = nil;
	$QueryString = "";
	if ENV.has_key?( 'QUERY_STRING' )
		$QueryString = ENV['QUERY_STRING'].dup;
		$QueryString.gsub!(/($&+)|(^&+)/,"");
		$QueryString.gsub!(/&&+/,"&");
		$QueryString.gsub!("&","&amp;")
	end
	$QueryString.freeze;#���������֎~
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
		trip_url = CGI.escape("��"+trip)
	else
		key=''
		trip=''
	end
	puts '<?xml version="1.0" encoding="Shift_JIS"?>'
	puts '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
	puts '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">'
	puts '<head>'
	if out_result
		puts "<title>##{key}�̈Í������� �| 2ch�g���b�v�����V�X�e��</title>"
	elsif
		puts '<title>2ch�g���b�v�����V�X�e��</title>'
	end
	puts '<meta http-equiv="Content-Script-Type" content="text/javascript" />'
	puts '<meta http-equiv="Content-Style-Type" content="text/css" />'
	puts '</head>'
	puts '<body>'
	puts '<h1>2ch�g���b�v�����V�X�e��</h1>'
	puts '<hr /><p>'
	puts '���͂��ꂽ�����񂩂�A2ch�̃g���b�v�𐶐����܂��B<br />'
	puts '���̌��ʂ�p����Google�Ō������Ă݂�����o���܂��B�g�����͂��Ȃ�����B'
	puts '</p><hr />'
	puts '<form method="get" action="/cgi/trip.rb">'
	puts '<p>'
	puts "�g���b�v�L�[�F#<input type=\"text\" name=\"t\" value=\"#{key}\" tabindex=\"1\" accesskey=\"1\" />"
	puts '<input type="submit" value="��������" tabindex="2" accesskey="2" />'
	puts '<input type="reset" value="���" tabindex="3" accesskey="3" />'
	puts '</p>'
	puts' </form>'
	puts '<hr />'
	if out_result
		puts "<p>�g���b�v�L�[�u<font color=\"green\">##{key}</font>�v</p><p>��p���ăg���b�v�𐶐�����ƁA</p><p>�g���b�v�u<font color=\"red\">��#{trip}</font>�v</p><p>�ɂȂ�܂��B</p>"
		puts "<p><a href=\"http://www.google.com/search?q=#{trip_url}\">Google�Ō������Ă݂�</a>�i<a href=\"http://www.google.com/search?q=#{trip_url}\" target=\"_blank\">�ʃE�C���h�E</a>�j<p>"
	elsif
		puts '<p>��������g���b�v�L�[����͂��Ă��������B</p>'
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
	puts 'Written by <a href="http://ledyba.ddo.jp/">�Ձi�v�T�C�j</a><br />'
	puts '</p>'
	puts '</body>'
	puts '</html>'
end

main();
