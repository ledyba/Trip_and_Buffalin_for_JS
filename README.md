Trip/成分解析 for JS
==============================

ψ（プサイ）の興味関心空間で以前稼働していたふたつのCGIをJSに移植するプロジェクト

## 成分解析

2006年頃に流行った「成分解析」

* アレの半分は何でできてる？――「成分解析」が人気
    * http://www.itmedia.co.jp/news/articles/0604/03/news016.html
* 「成分解析」解析結果
    * http://ledyba.org/2006/03/28034103.php
* 「成分解析」研究室
    * http://www.vb-user.net/junk/analyze/
* やじうまウォッチ
    * http://internet.watch.impress.co.jp/static/yajiuma/2006/04/index.htm

をさらに（？）解析して、それを[JavaのアプレットとCのCGIで再実装したバージョン](https://github.com/ledyba/Buffalin)を、さらに現代的にJSで書きなおしました。

以下のURLで稼働中です。

 * [http://ledyba.org/utl/Buffalin/?Thing=ツンデレ](http://ledyba.org/utl/Buffalin/?Thing=%E3%83%84%E3%83%B3%E3%83%87%E3%83%AC)

### 原理

入力文字列から乱数ジェネレータの初期値を作成して、それを使って100種類の成分の種類とパーセンテージを作り出しているという感じです。

詳しくは

* 「成分解析」解析結果
    * http://ledyba.org/2006/03/28034103.php

## 2chトリップ生成システム

2chのトリップを<a href="http://ja.wikipedia.org/wiki/%E3%83%88%E3%83%AA%E3%83%83%E3%83%97_(%E9%9B%BB%E5%AD%90%E6%8E%B2%E7%A4%BA%E6%9D%BF)">Wikipediaに書いてあるとおり</a>に計算するサービスです。とはいえ、実は結構手間が掛かっていて、[JS用にcrypt関数を再実装](https://github.com/ledyba/js-crypt3)しています。

以前はRubyのCGIで稼働していたのですが、諸事情によりもうCGIはやめたくなったのでJSで書きなおしました。

以下のURLで稼働中です。

 * [http://ledyba.org/utl/2chTrip/?t=うどん](http://ledyba.org/utl/2chTrip/?t=%E3%81%86%E3%81%A9%E3%82%93)

ライセンス
====
GPL v3 or later
