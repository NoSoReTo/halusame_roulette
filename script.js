/* ========================================
   要素取得
======================================== */

const wheelGroup = document.getElementById("wheelGroup");

const spinButton = document.getElementById("spinButton");

const resultArea = document.getElementById("resultArea");

const resultNumber = document.getElementById("resultNumber");


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

const RADIUS = 500;


/* ========================================
   ルーレットの色
======================================== */

const colors = [

  /* 0 */
  "#ffc21d",

  /* 1 */
  "#ff7b0c",

  /* 2 */
  "#ff3318",

  /* 3 */
  "#e9279a",

  /* 4 */
  "#aa2bd5",

  /* 5 */
  "#5631d0",

  /* 6 */
  "#287fd1",

  /* 7 */
  "#26abc7",

  /* 8 */
  "#08d98a",

  /* 9 */
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


    /* 1区画36度 */

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


    /* 数字を外側寄りに配置 */

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


    text.setAttribute(
      "font-size",
      "58"
    );


    text.setAttribute(
      "font-weight",
      "500"
    );


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
   STARTを押している間だけ赤くする
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


/* PC */

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


/* スマホ */

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


  /* 回転中は連打不可 */

  if (spinning) {
    return;
  }


  spinning = true;


  /* 結果を非表示 */

  resultArea.classList.remove(
    "show"
  );


  /* ====================================
     結果決定

     最初の10回は指定順
     11回目以降は完全ランダム
  ==================================== */

  let result;


  if (
    spinCount <
    sequence.length
  ) {

    result =
      sequence[
        spinCount
      ];

  }

  else {

    result =
      Math.floor(
        Math.random() *
        10
      );

  }


  /* ====================================
     停止位置

     1区画 = 36度

     中央固定ではなく、
     当選数字の区画内で
     ランダムな位置に停止。

     境界から0.5度だけ離すので、
     かなりギリギリにも止まる。
  ==================================== */


  const sectorStartAngle =
    -90 +
    result *
    36;


  /*
    0.5〜35.5度の範囲

    これにより、
    区画の左端・中央・右端付近の
    どこにでもランダムに停止する。
  */

  const offsetInsideSector =
    0.5 +
    Math.random() *
    35;


  /*
    実際に矢印が指す
    ルーレット上の角度
  */

  const targetAngleOnWheel =
    sectorStartAngle +
    offsetInsideSector;


  /*
    矢印は真上 = -90度

    選ばれた区画内のランダム位置を
    矢印位置まで回転させる
  */

  let targetRotation =
    -90 -
    targetAngleOnWheel;


  /*
    0〜360度に正規化
  */

  targetRotation =
    (
      targetRotation %
      360 +
      360
    ) %
    360;


  /*
    現在の角度
  */

  const currentAngle =
    (
      currentRotation %
      360 +
      360
    ) %
    360;


  /*
    目的角度までの差
  */

  let adjustment =
    targetRotation -
    currentAngle;


  /*
    必ず正方向に回転
  */

  if (
    adjustment <= 0
  ) {

    adjustment += 360;

  }


  /* ====================================
     追加回転

     7〜10周
  ==================================== */

  const extraSpins =
    (
      7 +
      Math.floor(
        Math.random() *
        4
      )
    ) *
    360;


  /*
    最終回転角度
  */

  currentRotation +=
    extraSpins +
    adjustment;


  /* ====================================
     回転開始
  ==================================== */

  wheelGroup.style.transform =
    `rotate(${currentRotation}deg)`;


  /* ====================================
     7秒後に結果表示
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
    7000
  );

}
