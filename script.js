/* ========================================
   要素
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
   最初の10回

   ここだけ変更すれば、
   最初の10回の数字を変更できます。
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
   ルーレットの設定
======================================== */

const SVG_NS =
  "http://www.w3.org/2000/svg";

const CENTER_X = 500;
const CENTER_Y = 500;

const RADIUS = 500;


/*
  画像を参考に調整した10色

  0 → 黄
  1 → オレンジ
  2 → 赤
  3 → ピンク
  4 → 紫
  5 → 青紫
  6 → 青
  7 → 水色
  8 → 緑
  9 → 紫
*/

const colors = [
  "#ffc21d",
  "#ff7b0c",
  "#ff3318",
  "#e9279a",
  "#aa2bd5",
  "#5631d0",
  "#287bc8",
  "#2aa8c0",
  "#12d893",
  "#ba62d2"
];


/* ========================================
   状態
======================================== */

let spinCount = 0;

let currentRotation = 0;

let spinning = false;


/* ========================================
   SVG要素作成
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

function getPoint(angle, radius) {

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
   扇形のパス
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
      0の区画は

      上（-90度）
      から
      右上方向（-54度）

      という画像と同じ並び
    */

    const startAngle =
      -90 +
      number *
      36;


    const endAngle =
      startAngle +
      36;


    /* --------------------
       扇形
    -------------------- */

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


    /* --------------------
       数字

       各区画の中央角度
    -------------------- */

    const textAngle =
      startAngle +
      18;


    /*
      数字の位置

      半径を約310にして、
      スクリーンショットの
      数字位置に近づける
    */

    const textPoint =
      getPoint(
        textAngle,
        305
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


    /*
      数字が区画に沿って
      回転しないようにする。

      画像の数字は
      常に正立。
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
   STARTを押している間だけ赤
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


/*
  マウス
*/

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


/*
  スマホ
*/

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
   回転
======================================== */

function spinWheel() {


  /* --------------------
     回転中は無効
  -------------------- */

  if (spinning) {
    return;
  }


  spinning = true;


  /*
    前回結果を非表示
  */

  resultArea.classList.remove(
    "show"
  );


  /* --------------------
     結果を決定
  -------------------- */

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
    11回目以降
  */

  else {

    result =
      Math.floor(
        Math.random() *
        10
      );

  }


  /* ========================================
     回転角度

     SVGでは

     0番の中心が
     -72度

     になっている。

     ポインターは
     -90度。

     そのため、

     -90 - (-72 + result×36)

     を基準に停止位置を計算。
  ======================================== */


  const sectorCenterAngle =
    -72 +
    result *
    36;


  let targetRotation =
    -90 -
    sectorCenterAngle;


  /*
    360度以内にする
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
    時計回りに
    目標まで回す
  */

  let adjustment =
    targetRotation -
    currentAngle;


  if (
    adjustment <= 0
  ) {

    adjustment += 360;

  }


  /*
    6〜9周
  */

  const extraSpins =
    (
      6 +
      Math.floor(
        Math.random() *
        4
      )
    ) *
    360;


  /*
    次の回転角度
  */

  currentRotation +=
    extraSpins +
    adjustment;


  /* --------------------
     回転開始
  -------------------- */

  wheelGroup.style.transform =
    `rotate(${currentRotation}deg)`;


  /* ========================================
     回転終了
  ======================================== */

  setTimeout(
    () => {


      /*
        結果表示
      */

      resultNumber.textContent =
        result;


      resultArea.classList.add(
        "show"
      );


      /*
        次回へ
      */

      spinCount++;


      spinning = false;


    },
    4800
  );

}
