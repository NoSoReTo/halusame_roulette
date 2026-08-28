const roulette = document.getElementById(“roulette”);
const spinButton = document.getElementById(“spinButton”);
const resultNumber = document.getElementById(“resultNumber”);
const spinCountElement = document.getElementById(“spinCount”);
const modeText = document.getElementById(“modeText”);
const infoText = document.getElementById(“infoText”);

// ========================================
// 最初の10回に出す数字をここで設定
// ========================================
const sequence = [
7, 3, 9, 1, 5,
0, 8, 2, 6, 4
];

// ========================================

let spinCount = 0;
let currentRotation = 0;
let spinning = false;

spinButton.addEventListener(“click”, () => {
if (spinning) return;

spinning = true;
spinButton.disabled = true;

let result;

// 1〜10回目：設定した演出シーケンス
if (spinCount < sequence.length) {
result = sequence[spinCount];
} else {
// 11回目以降：完全ランダム
result = Math.floor(Math.random() * 10);

modeText.textContent = "完全ランダム";
infoText.textContent = "11回目以降：0〜9からランダム";

}

// 数字1つあたり36度
const anglePerNumber = 36;

// 指定した数字が上のポインター位置に来る角度
const targetAngle = 360 - (result * anglePerNumber + 18);

// 最低5周＋ランダムな追加回転
const extraSpins = 360 * (5 + Math.floor(Math.random() * 4));

currentRotation += extraSpins;

// 現在の回転位置を計算
const currentMod = currentRotation % 360;

// 目的の数字までの角度を計算
const adjustment =
(targetAngle - currentMod + 360) % 360;

currentRotation += adjustment;

// ルーレットを回転
roulette.style.transform =
rotate(${currentRotation}deg);

// 回転終了後に結果表示
setTimeout(() => {
resultNumber.textContent = result;

spinCount++;
spinCountElement.textContent = spinCount;
spinning = false;
spinButton.disabled = false;

}, 4000);
});
