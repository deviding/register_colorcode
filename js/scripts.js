const MODE = {
	VAL : 1,
	MULTI : 2,
	TOLE : 3
}

// 値のカラーコードのマップ
const VALUE_MAP = new Map();
VALUE_MAP.set("0", "black");
VALUE_MAP.set("1", "brown");
VALUE_MAP.set("2", "red");
VALUE_MAP.set("3", "orange");
VALUE_MAP.set("4", "yellow");
VALUE_MAP.set("5", "green");
VALUE_MAP.set("6", "blue");
VALUE_MAP.set("7", "purple");
VALUE_MAP.set("8", "gray");
VALUE_MAP.set("9", "white");

// 乗算のカラーコードのマップ
const MULTI_MAP = new Map();
MULTI_MAP.set("0.001", "white");
MULTI_MAP.set("0.01", "silver");
MULTI_MAP.set("0.1", "gold");
MULTI_MAP.set("1", "black");
MULTI_MAP.set("10", "brown");
MULTI_MAP.set("100", "red");
MULTI_MAP.set("1000", "orange");
MULTI_MAP.set("10000", "yellow");
MULTI_MAP.set("100000", "green");
MULTI_MAP.set("1000000", "blue");
MULTI_MAP.set("10000000", "purple");

// 誤差のカラーコードのマップ
const TOLE_MAP = new Map();
TOLE_MAP.set("0.05", "orange");
TOLE_MAP.set("0.1", "purple");
TOLE_MAP.set("0.25", "blue");
TOLE_MAP.set("0.5", "green");
TOLE_MAP.set("1", "brown");
TOLE_MAP.set("2", "red");
TOLE_MAP.set("5", "gold");
TOLE_MAP.set("10", "silver");


$(function() {
	// 第1数字が変更された時の処理
	$("#firstVal").change(function() {
		const val = $(this).val();
		const color = VALUE_MAP.get(val);
		// 色を変更
		$("#firstText").removeClass();
		$("#firstText").addClass(color + "-txt");
		// canvasに縦線を引く
		drawLine(color, 20);
		// 抵抗値を計算
		calcRegistorVal();
	});

	// 第2数字が変更された時の処理
	$("#secondVal").change(function() {
		const val = $(this).val();
		const color = VALUE_MAP.get(val);
		// 色を変更
		$("#secondText").removeClass();
		$("#secondText").addClass(color + "-txt");
		// canvasに縦線を引く
		drawLine(color, 40);
		// 抵抗値を計算
		calcRegistorVal();
	});

	// 第3数字が変更された時の処理
	$("#thirdVal").change(function() {
		const val = $(this).val();
		const color = MULTI_MAP.get(val);
		// 色を変更
		$("#thirdText").removeClass();
		$("#thirdText").addClass(color + "-txt");
		// canvasに縦線を引く
		drawLine(color, 60);
		// 抵抗値を計算
		calcRegistorVal();
	});

	// 第4数字が変更された時の処理
	$("#forthVal").change(function() {
		const val = $(this).val();
		const color = TOLE_MAP.get(val);
		// 色を変更
		$("#forthText").removeClass();
		$("#forthText").addClass(color + "-txt");
		// canvasに縦線を引く
		drawLine(color, 80);
		// 抵抗値を計算
		calcRegistorVal();
	});

	// 逆引きボタンが押下された時の処理
	$("#reverseBtn").on("click", function(){
		const registorStr = $("#registorVal").val();

		// 許容範囲の部分があれば削除
		let registorVal = "";
		let toleVal = "";
		if (registorStr.indexOf("±") >= 0) {
			registorVal = registorStr.substring(0, registorStr.indexOf("±"));
			toleVal = registorStr.substr(registorStr.indexOf("±"));
		} else {
			registorVal = registorStr;
		}
		// console.log(registorVal);
		// console.log(toleVal);

		// 最終文字がΩか判定
		if (registorVal.charAt(registorVal.length-1) != 'Ω') {
			console.log("許容範囲の前、または末尾は必ずΩを設定してください。");
			return;
		}
		// Ωを削除
		registorVal = registorVal.replace("Ω", "");

		// 小数点があれば削除してフラグを立てる
		let is_digit = false;
		if (registorVal.indexOf(".") >= 0) {
			is_digit = true;
			registorVal = registorVal.replace(".", "");
		}

		// 第3数字を判定
		let thirdVal = 1;
		let isThirdDigit = false;
		// 最終行を判定
		const thirdDigit = registorVal.charAt(registorVal.length-1);
		if (thirdDigit == 'k') {
			thirdVal = 1000;
			registorVal = registorVal.replace("k", "");
			isThirdDigit = true;
		} else if (thirdDigit == 'M') {
			thirdVal = 1000000;
			registorVal = registorVal.replace("M", "");
			isThirdDigit = true;
		}
		// 1桁目が0の場合は0が続くだけ桁を下げる
		if (registorVal.charAt(0) == '0') {
			for (let i = 0; i < registorVal.length; i++) {
				if (registorVal.charAt(i) != '0') {
					break;
				}
				thirdVal = thirdVal / 10;
			}
			registorVal = registorVal.replaceAll("0", "");
		}
		// 小数点がある場合は更に1桁下げる
		if (is_digit) {
			thirdVal = thirdVal / 10;
		}

		// 第1数字、第2数字を判定
		let firstValStr = "";
		let secondValStr = "";

		if (registorVal.length == 1) {
			// 第2数字が0の場合
			firstValStr = registorVal.charAt(0);
			secondValStr = "0";
			if (isThirdDigit && !is_digit) {
				thirdVal = thirdVal / 10;
			}
		} else {
			firstValStr = registorVal.charAt(0);
			secondValStr = registorVal.charAt(1);
			if (registorVal.length == 3) {
				thirdVal = thirdVal * 10;
			}
		}
		console.log("---\n" + firstValStr + "\n" + secondValStr + "\n" +String(thirdVal));

		// 許容範囲を設定
		if (toleVal == "") {
			toleVal = "5";
		} else {
			toleVal = toleVal.substring(1, toleVal.length-1);
		}

		// カラーコードを変更
		$("#firstVal").val(firstValStr).change();
		$("#secondVal").val(secondValStr).change();
		$("#thirdVal").val(String(thirdVal)).change();
		$("#forthVal").val(toleVal).change();
	});
});

// canvasに縦線を引く関数
function drawLine(color, wPercent) {
	let resigtorCanvas = document.getElementById("resistorCanvas");
	let canvasCtx = resigtorCanvas.getContext("2d");

	// 書き出し位置と線の太さを計算
	xPos = resigtorCanvas.width * wPercent / 100;
	lineWidh = 0.1 * resigtorCanvas.width;

	if (color == "") {
		// 色がない場合は色を消す設定
		canvasCtx.globalCompositeOperation = "destination-out"
	} else {
		// 色がある場合は色を塗る設定
		canvasCtx.globalCompositeOperation = "source-over";
		canvasCtx.strokeStyle = color;
	}
	canvasCtx.lineWidth = lineWidh;
	canvasCtx.beginPath();
	canvasCtx.moveTo(xPos, 1);
	canvasCtx.lineTo(xPos, resigtorCanvas.height-1);
	canvasCtx.stroke();
}

// カラーコードから抵抗値を計算する関数
function calcRegistorVal() {
	const firstVal = $("#firstVal").val();
	const secondVal = $("#secondVal").val();
	const thirdVal = $("#thirdVal").val();
	const forthVal = $("#forthVal").val();

	// どれか1つでも空文字だったら計算できないとみなす
	if (firstVal == "" || secondVal == "" || thirdVal == "" || forthVal == "") {
		$("#registorVal").val("計算できません");
		return;
	}

	// 計算
	let resVal = (Number(firstVal) * 10 + Number(secondVal)) * Number(thirdVal);

	// 文字列に直す処理
	let resValStr = "";
	if (resVal == 0) {
		resValStr = "0Ω"
	} else if (resVal % 1000000 == 0) {
		resVal = resVal / 1000000;
		resValStr = String(resVal) + "MΩ";
	} else if (resVal % 100000 == 0) {
		resVal = resVal / 1000000;
		resValStr = resVal.toFixed(1) + "MΩ";
	} else if (resVal % 1000 == 0) {
		resVal = resVal / 1000;
		resValStr = String(resVal) + "kΩ";
	} else if (resVal % 100 == 0) {
		resVal = resVal / 1000;
		resValStr = resVal.toFixed(1) + "kΩ";
	} else {
		if (MULTI_MAP.get(thirdVal) == "white") {
			resValStr = resVal.toFixed(3) + "Ω";
		} else if (MULTI_MAP.get(thirdVal) == "silver") {
			resValStr = resVal.toFixed(2) + "Ω";
		} else if (MULTI_MAP.get(thirdVal) == "gold") {
			resValStr = resVal.toFixed(1) + "Ω";
		} else {
			resValStr = String(resVal) + "Ω";
		}
	}
	resValStr = resValStr + "±" + forthVal + "%";
	
	// 結果を挿入
	$("#registorVal").val(resValStr);
}

