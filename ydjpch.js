/**
 * @file  選択した日本語を中国語に翻訳
 * 
 * 有道辞書のデータを用いる
 * 
 * 注：Shift_JISで保存してください (サクラエディタマクロの制約事項)
 */

var text = Editor.GetSelectedString(0)
	.replace(/\r\n/g, '\n')
	.replace(/\t/g, '')
	.replace(/\.  /g, '.\n');

var lines = text
	.split('\n'); // avoid ie bug

for (var i = 0; i < lines.length; i++) {
	lines[i] = lines[i]
		.replace(/^\s+|\s+$/g, '');
}

var sentences = [];
var tmp = [];
for (var i = 0; i < lines.length; i++) {
	var line = lines[i];
	
	tmp.push(line);
	
	if (line == '' || /\.$/.test(line)) {
		sentences.push(tmp.join(' '));
		tmp = [];
	}
}
if (tmp.length > 0) {
	sentences.push(tmp.join(' '));
}

// IEを使ってGoogle翻訳結果を取得
// 参考: http://language-and-engineering.hatenablog.jp/entry/20090713/p1

//var url = 'https://translate.google.com/?hl=ja#en/ja/' + encodeURIComponent(text);
var url = 'https://dict.hjenglish.com/jp/jc/' + encodeURIComponent(text);

var ie = new ActiveXObject('InternetExplorer.Application');
ie.Visible = false;
ie.Navigate(url);

while(ie.Busy || ie.readystate != 4) {
	Sleep(100);
}
//Sleep(1000);

//util object
var WSHShell = new ActiveXObject("WScript.Shell");

//google translatedText
//var translatedText = ie.document.querySelector('#result_box').textContent;
//youdao translatedText
var pronouncesDiv ='.pronounces';

//検索結果有無のフラグ
var resultFlag = ie.document.querySelector(".pronounce-value-jp");

if(resultFlag == null ){
	WSHShell.Popup("結果がありません。", 0, "通訳結果", 1);
}else{
	var pronouncesDivText3 = ie.document.querySelector(pronouncesDiv+">.pronounce-value-jp").innerText;
	var pronouncesDivText = ie.document.querySelector(pronouncesDiv).childNodes[1].innerText;

	var wordTypeText =ie.document.querySelector(".simple h2").innerText;

	var simpleText = ie.document.querySelectorAll(".simple ul li");
	
	var samplesArry ="";
	
	for(var i =0; i<simpleText.length ;i++){
		//WSHShell.Popup("88"+ simpleText[i].innerText, 0, "li", 1);
		samplesArry+=simpleText[i].innerText+"\r\n";
	}

	var msgText =text+"\r\n" + pronouncesDivText3  + pronouncesDivText +"\r\n"+wordTypeText
              +"\r\n--------------------\r\n" +samplesArry 
							+ "\r\n--------------------\r\n"; 
	//youdao end 
	ie.Quit();

    //Editor.ExecCommand  ("C:\\Users\\541957\\work\\sakura\\sakura-logging.bat " + msgTextLog ,0);

	SetClipboard(0,msgText);//copy to clipbord
	
	InfoMsg(msgText);

	
	//WSHShell.Popup(msgText, 0, "通訳結果", 1);
}

