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

// 色と日本語のマップ
const COLOR_MAP = new Map();
COLOR_MAP.set("black", "黒");
COLOR_MAP.set("brown", "茶");
COLOR_MAP.set("red", "赤");
COLOR_MAP.set("orange", "橙");
COLOR_MAP.set("yellow", "黄");
COLOR_MAP.set("green", "緑");
COLOR_MAP.set("blue", "青");
COLOR_MAP.set("purple", "紫");
COLOR_MAP.set("gray", "灰");
COLOR_MAP.set("white", "白");
COLOR_MAP.set("gold", "金");
COLOR_MAP.set("silver", "銀");


$(function() {
	// 第1数字が変更された時の処理
	$("#firstVal").change(function() {
		const val = $(this).val();
		const color = VALUE_MAP.get(val);
		// 色を変更
		$("#firstText").removeClass();
		if (color != undefined) {	$("#firstText").addClass(color + "-txt");	}
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
		if (color != undefined) {	$("#secondText").addClass(color + "-txt"); }
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
		if (color != undefined) {	$("#thirdText").addClass(color + "-txt");	}
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
		if (color != undefined) { $("#forthText").addClass(color + "-txt");	}
		// canvasに縦線を引く
		drawLine(color, 80);
		// 抵抗値を計算
		calcRegistorVal();
	});

	// 逆引きボタンが押下された時の処理
	$("#reverseBtn").on("click", function(){
		const registorStr = $("#registorVal").val();
	
		// 入力文字列が正しいかを判定
		const tole_regex = /^\d+(?:\.\d+)?[kM]?Ω±\d+(?:\.\d+)?%$/;
		const registor_regex = /^\d+(?:\.\d+)?[kM]?Ω$/;
		if (!tole_regex.test(registorStr) && !registor_regex.test(registorStr)) {
			alert("抵抗値には正しい書式を入力してください");
			return;
		}

		// 抵抗値からカラーコードを逆引き
		calcReverseRegistor(registorStr);
	});
});

// canvasに縦線を引く関数
function drawLine(color, wPercent) {
	let resigtorCanvas = document.getElementById("resistorCanvas");
	let canvasCtx = resigtorCanvas.getContext("2d");

	// 書き出し位置と線の太さを計算
	xPos = resigtorCanvas.width * wPercent / 100;
	lineWidh = 0.1 * resigtorCanvas.width;

	if (color == undefined) {
		// 色がない場合は色を消す設定
		canvasCtx.globalCompositeOperation = "destination-out"
	} else {
		// 色がある場合は色を塗る設定
		canvasCtx.globalCompositeOperation = "source-over";
		canvasCtx.strokeStyle = color;
	}
	// 線を引く
	canvasCtx.lineWidth = lineWidh;
	canvasCtx.beginPath();
	canvasCtx.moveTo(xPos, 1);
	canvasCtx.lineTo(xPos, resigtorCanvas.height-1);
	canvasCtx.stroke();

	if (color != undefined) {
		// テキストの色を設定
		if (color == "black" || color == "blue" || color == "gray" || color == "purple") {
			canvasCtx.fillStyle = "white";
		} else {
			canvasCtx.fillStyle = "black";
		}
		// フォントサイズとフォントファミリーを設定
		canvasCtx.font = "30px Osaka";
		// 文字を書く
		canvasCtx.fillText(COLOR_MAP.get(color), xPos-lineWidh/2, 85);
	}
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

// 抵抗値の値からカラーコードを計算する関数
function calcReverseRegistor(registorStr) {
	// 抵抗値と許容範囲を分割して取得
	let [registorValStr, toleVal] = getRegistorToleVal(registorStr);

	// 許容範囲が正しい値かどうか判定
	if (!isToleValOk(toleVal)) {
		alert("許容範囲の値を適切な値に設定してください。");
		return;
	}

	// 抵抗値の最終文字がΩか判定
	if (registorValStr.charAt(registorValStr.length-1) != 'Ω') {
		alert("許容範囲の前、または末尾は必ずΩを設定してください。");
		return;
	}
	// Ωを削除
	registorValStr = registorValStr.replace("Ω", "");

	try {
		// 桁などを修正
		let errorStr = "";
		[registorValStr, errorStr] = digitAdjustment(registorValStr);
		if (errorStr != "") {
			alert(errorStr);
			return;
		}

		// 小数点があれば削除してフラグを立てる
		let is_digit = false;
		if (registorValStr.indexOf(".") >= 0) {
			is_digit = true;
			registorValStr = registorValStr.replace(".", "");
		}
		// 第3数字を判定
		let thirdVal = 1;
		[thirdVal, registorValStr] = calcThirdVal(registorValStr, is_digit);
		// 第1数字、第2数字を判定
		let [firstValStr, secondValStr] = calcFirstSecondVal(registorValStr);
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
	} catch (e) {
		alert(e.message);
		return;
	}
}

// 抵抗部分と許容範囲を分割して取得する関数
function getRegistorToleVal(registorStr) {
	// 許容範囲の部分があれば分割
	let registorVal = "";
	let toleVal = "";
	if (registorStr.indexOf("±") >= 0) {
		registorVal = registorStr.substring(0, registorStr.indexOf("±"));
		toleVal = registorStr.substr(registorStr.indexOf("±"));
	} else {
		registorVal = registorStr;
	}
	return [registorVal, toleVal];
}

// 許容範囲の値が適切かを判定する関数
function isToleValOk(toleVal) {
	if (toleVal == "") { return true; }

	let tole = "";
	tole = toleVal.replace("±", "");
	tole = tole.replace("%", "");
	
	if (TOLE_MAP.get(tole) == null) { return false; }
	return true;
}

// 桁数などを判定する関数
function digitAdjustment(registorVal) {
	let registorValStr = registorVal;
	let errorStr = "";
	let isUnit = false;
	let isDigit = false;

	const m_index = registorValStr.indexOf("M");
	const k_index = registorValStr.indexOf("k");

	// 単位が複数ある場合はエラー
	if (m_index > 0 && k_index > 0) {
		errorStr = "単位のMかkはどちらか一方のみを使ってください";
		return [registorValStr, errorStr];
	}

	const lastChar = registorValStr.charAt(registorValStr.length-1);
	if (m_index > 0 || k_index > 0) {
		isUnit = true;
		if (lastChar != 'M' && lastChar != 'k') {
			// 最後の桁が単位でないならエラー
			errorStr = "単位のMやkを使うときは必ずΩの前につけてください";
			return [registorValStr, errorStr];
		}
	}

	// 小数点があるかを確認
	if (registorValStr.indexOf(".") > 0) { isDigit = true; }

	// 桁を確認
	const registorLength = isUnit ? registorValStr.length-1 : registorValStr.length;
	if (isDigit) {
		// 小数点以下が出る場合
		if (registorValStr.charAt(0) == '0') {
			if (isUnit) {
				if (registorLength > 4) {
					errorStr = "1より小さく単位を使う場合、小数点以下は必ず2桁以内にしてください";
				}
			} else {
				if (registorLength > 5) {
					errorStr = "1より小さい場合、小数点以下は必ず3桁以内にしてください";
				}
			}
		} else {
			if (registorLength > 3) {
				errorStr = "1より大きい場合、小数点以下は必ず1桁以内にしてください";
				if (isUnit) { errorStr = "1より大きく単位を使う場合、小数点以下は必ず1桁以内にしてください"; }
			}
		}
	} else if (isUnit) {
		// 小数点がなく単位がある場合
		if (registorLength > 3) {
			errorStr = "単位を使う場合は、必ず3桁以内にしてください";
		}
	} else {
		// 小数点も単位ない場合
		if (registorLength > 9) {
			errorStr = "表現できる抵抗の最大値を超えています";
			return [registorValStr, errorStr];
		}

		let ohmVal = Number(registorValStr);
		if (registorLength > 6) {
			// Mの単位を付ける
			ohmVal = ohmVal / 1000000;
			registorValStr = String(ohmVal) + "M";
		} else if (registorLength > 3) {
			// kの単位を付ける
			ohmVal = ohmVal / 1000;
			registorValStr = String(ohmVal) + "k";
		}
	}
	return [registorValStr, errorStr];
}

// 第3数字を計算する関数
function calcThirdVal(registorVal, is_digit) {
	let thirdVal = 1;
	let isThirdDigit = false;
	let registorValStr = registorVal;
	// 最終行を判定
	const thirdDigit = registorValStr.charAt(registorValStr.length-1);
	if (thirdDigit == 'k') {
		thirdVal = 1000;
		registorValStr = registorVal.replace("k", "");
		isThirdDigit = true;
	} else if (thirdDigit == 'M') {
		thirdVal = 1000000;
		registorValStr = registorVal.replace("M", "");
		isThirdDigit = true;
	}
	// 1桁目が0の場合は0が続くだけ桁を下げる
	if (registorValStr.charAt(0) == '0') {
		for (let i = 0; i < registorValStr.length; i++) {
			if (registorValStr.charAt(i) != '0') {
				break;
			}
			thirdVal = thirdVal / 10;
		}
		registorValStr = registorValStr.replaceAll("0", "");
	}
	// 小数点がある場合は更に1桁下げる
	if (is_digit) { thirdVal = thirdVal / 10;	}

	if (registorValStr.length == 1) {
		// 第2数字が0の場合
		if (isThirdDigit && !is_digit) { thirdVal = thirdVal / 10; }
	} else {
		// 第2数字が0以外の場合
		if (registorValStr.length == 3) { thirdVal = thirdVal * 10; }
	}

	return [thirdVal, registorValStr];
}

// 第1数字と第2数字を計算する関数
function calcFirstSecondVal(registorValStr) {
	let firstValStr = "";
	let secondValStr = "";

	if (registorValStr.length == 1) {
		// 第2数字が0の場合
		firstValStr = registorValStr.charAt(0);
		secondValStr = "0";
	} else {
		// 第2数字が0以外の場合
		firstValStr = registorValStr.charAt(0);
		secondValStr = registorValStr.charAt(1);
	}
	
	return [firstValStr, secondValStr];
}