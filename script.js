const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spinButton");

const resultArea = document.getElementById("resultArea");
const resultNumber = document.getElementById("resultNumber");


// ========================================
// 最初の10回に出す数字
// ========================================

const sequence = [
  7,
  3,
  9,
  1,
  5,
  0,
  8,
  2,
  6,
  4
];


// ========================================
// 状態
// ========================================

let spinCount = 0;

let currentRotation = 0;

let spinning = false;


// ========================================
// START
// ========================================

spinButton.addEventListener("click", spinWheel);


function spinWheel() {

  // 回転中は連打禁止
  if (spinning) {
    return;
  }


  spinning = true;


  // STARTを赤くする
  spinButton.classList.add("spinning");


  // 前回の結果を消す
  resultArea.classList.remove("show");


  let result;


  // ========================================
  // 最初の10回
  // ========================================

  if (spinCount < sequence.length) {

    result = sequence[spinCount];

  }


  // ========================================
  // 11回目以降はランダム
  // ========================================

  else {

    result = Math.floor(
      Math.random() * 10
    );

  }


  // ========================================
  // ルーレットの計算
  // ========================================

  /*
    10個なので1区画36度

    CSSのconic-gradientは
    from -18deg から始まっているため、

    0番が上のポインター位置に来るよう
    数字ごとに36度ずつ調整する。
  */

  const anglePerNumber = 36;


  /*
    目標角度

    result = 0 → 0度
    result = 1 → -36度
    result = 2 → -72度
    ...
  */

  const targetAngle =
    -result * anglePerNumber;


  /*
    現在位置を360度内にする
  */

  const currentAngle =
    currentRotation % 360;


  /*
    目標までの差分

    必ず正方向へ回る
  */

  let difference =
    targetAngle - currentAngle;


  while (difference <= 0) {
    difference += 360;
  }


  /*
    最低6〜9周
  */

  const extraSpins =
    360 *
    (
      6 +
      Math.floor(
        Math.random() * 4
      )
    );


  /*
    新しい回転角度
  */

  currentRotation +=
    extraSpins +
    difference;


  // ========================================
  // 回転開始
  // ========================================

  wheel.style.transform =
    `rotate(${currentRotation}deg)`;



  // ========================================
  // 回転終了
  // CSSのtransitionと同じ4.5秒
  // ========================================

  setTimeout(() => {

    // 結果を表示
    resultNumber.textContent =
      result;


    // 結果エリアを表示
    resultArea.classList.add(
      "show"
    );


    // 回転回数を増やす
    spinCount++;


    // STARTの赤を解除
    spinButton.classList.remove(
      "spinning"
    );


    // 再度押せるようにする
    spinning = false;


  }, 4500);

}
