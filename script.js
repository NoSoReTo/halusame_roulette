/* ========================================
   要素取得
======================================== */

const wheelGroup =
  document.getElementById("wheelGroup");

const spinButton =
  document.getElementById("spinButton");

const resultArea =
  document.getElementById("resultArea");

const resultNumber =
  document.getElementById("resultNumber");


/* ========================================
   最初の10回の結果

   好きな数字に変更可能
======================================== */

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


/* ========================================
   SVG設定
======================================== */

const SVG_NS =
  "http://www.w3.org/2000/svg";


const CENTER_X = 500;
const CENTER_Y = 500;


/* ルーレット外周 */

const RADIUS = 500;


/* ========================================
   ルーレットの色

   参考画像に合わせて
   6〜9をより鮮やかに調整
======================================== */

const colors = [

  /* 0 黄 */
  "#ffc21d",

  /* 1 オレンジ */
  "#ff7b0c",

  /* 2 赤 */
  "#ff3318",

  /* 3 ピンク */
  "#e9279a",

  /* 4 紫 */
  "#aa2bd5",

  /* 5 青紫 */
  "#5631d0",

  /* 6 鮮やかな青 */
  "#287fd1",

  /* 7 鮮やかな水色 */
  "#26abc7",

  /* 8 鮮やかなエメラルド */
  "#08d98a",

  /* 9 明るい紫 */
  "#bd63d8"
];


/* ========================================
   状態
======================================== */

let spinCount = 0;

let currentRotation = 0;

let spinning = false;


/* ========================================
   SVG要素生成
======================================== */

function createSvgElement(tagName) {

  return document.createElementNS(
    SVG_NS,
    tagName
  );

}


/* ========================================
   円周上の座標
======================================== */

function getPoint(
  angle,
  radius
) {

  const rad =
    angle *
    Math.PI /
    180;


  return {

    x:
      CENTER_X +
      radius *
      Math.cos(rad),

    y:
      CENTER_Y +
      radius *
      Math.sin(rad)

  };

}


/* ========================================
   扇形作成
======================================== */

function createSector(
  startAngle,
  endAngle
) {

  const start =
    getPoint(
      startAngle,
      RADIUS
    );


  const end =
    getPoint(
      endAngle,
      RADIUS
    );


  return `
    M ${CENTER_X} ${CENTER_Y}

    L ${start.x} ${start.y}

    A ${RADIUS} ${RADIUS}
      0 0 1
      ${end.x} ${end.y}

    Z
  `;

}


/* ========================================
   ルーレット描画
======================================== */

function createWheel() {


  for (
    let number = 0;
    number < 10;
    number++
  ) {


    /*
      1区画36度

      0が上から右上へ向かう
      参考画像と同じ配置
    */

    const startAngle =
      -90 +
      number *
      36;


    const endAngle =
      startAngle +
      36;


    /* ====================================
       扇形
    ==================================== */

    const sector =
      createSvgElement("path");


    sector.setAttribute(
      "d",
      createSector(
        startAngle,
        endAngle
      )
    );


    sector.setAttribute(
      "fill",
      colors[number]
    );


    wheelGroup.appendChild(
      sector
    );


    /* ====================================
       数字
    ==================================== */

    const textAngle =
      startAngle +
      18;


    /*
      前回より外側へ移動。

      前回: 305

      今回: 355

      参考画像の数字位置に
      かなり近い位置。
    */

    const textPoint =
      getPoint(
        textAngle,
        355
      );


    const text =
      createSvgElement("text");


    text.textContent =
      number;


    text.setAttribute(
      "x",
      textPoint.x
    );


    text.setAttribute(
      "y",
      textPoint.y
    );


    text.setAttribute(
      "text-anchor",
      "middle"
    );


    text.setAttribute(
      "dominant-baseline",
      "middle"
    );


    text.setAttribute(
      "fill",
      "#17191b"
    );


    /*
      数字サイズ
    */

    text.setAttribute(
      "font-size",
      "58"
    );


    text.setAttribute(
      "font-weight",
      "500"
    );


    /*
      数字は常に正立
    */

    wheelGroup.appendChild(
      text
    );

  }

}


/* ========================================
   初期描画
======================================== */

createWheel();


/* ========================================
   START押下時
======================================== */

function startPress() {

  spinButton.classList.add(
    "pressed"
  );

}


function endPress() {

  spinButton.classList.remove(
    "pressed"
  );

}


/* ========================================
   PC
======================================== */

spinButton.addEventListener(
  "mousedown",
  startPress
);


spinButton.addEventListener(
  "mouseup",
  endPress
);


spinButton.addEventListener(
  "mouseleave",
  endPress
);


/* ========================================
   スマホ
======================================== */

spinButton.addEventListener(
  "touchstart",
  startPress,
  {
    passive: true
  }
);


spinButton.addEventListener(
  "touchend",
  endPress,
  {
    passive: true
  }
);


spinButton.addEventListener(
  "touchcancel",
  endPress,
  {
    passive: true
  }
);


/* ========================================
   STARTクリック
======================================== */

spinButton.addEventListener(
  "click",
  spinWheel
);


/* ========================================
   ルーレットを回す
======================================== */

function spinWheel() {


  /* 回転中は無効 */

  if (spinning) {
    return;
  }


  spinning = true;


  /* 結果を一度消す */

  resultArea.classList.remove(
    "show"
  );


  /* ====================================
     結果決定
  ==================================== */

  let result;


  /*
    最初の10回
  */

  if (
    spinCount <
    sequence.length
  ) {

    result =
      sequence[
        spinCount
      ];

  }


  /*
    11回目以降はランダム
  */

  else {

    result =
      Math.floor(
        Math.random() *
        10
      );

  }


  /* ====================================
     停止位置計算
  ==================================== */


  /*
    各数字の区画中央

    0 = -72度
    1 = -36度
    2 = 0度
    ...

    矢印は -90度
  */

  const sectorCenterAngle =
    -72 +
    result *
    36;


  /*
    数字の区画中央を
    上の矢印に合わせる
  */

  let targetRotation =
    -90 -
    sectorCenterAngle;


  targetRotation =
    (
      targetRotation %
      360 +
      360
    ) %
    360;


  const currentAngle =
    (
      currentRotation %
      360 +
      360
    ) %
    360;


  let adjustment =
    targetRotation -
    currentAngle;


  if (
    adjustment <= 0
  ) {

    adjustment += 360;

  }


  /* ====================================
     追加回転

     6〜9周
  ==================================== */

  const extraSpins =
    (
      6 +
      Math.floor(
        Math.random() *
        4
      )
    ) *
    360;


  currentRotation +=
    extraSpins +
    adjustment;


  /* ====================================
     回転開始
  ==================================== */

  wheelGroup.style.transform =
    `rotate(${currentRotation}deg)`;


  /* ====================================
     回転終了
  ==================================== */

  setTimeout(
    () => {


      resultNumber.textContent =
        result;


      resultArea.classList.add(
        "show"
      );


      spinCount++;


      spinning = false;


    },
    4800
  );

}
