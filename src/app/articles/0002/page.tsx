"use client"
import { useState } from "react";

const YAKU = [
  { name: "立直 (リーチ)", hanClosed: 1, hanOpen: 0, tags: ["門前"] },
  { name: "一発", hanClosed: 1, hanOpen: 0, tags: ["門前"] },
  { name: "門前清自摸和 (ツモ)", hanClosed: 1, hanOpen: 0, tags: ["門前"] },
  { name: "断么九 (タンヤオ)", hanClosed: 1, hanOpen: 1, tags: ["数牌のみ"] },
  { name: "平和 (ピンフ)", hanClosed: 1, hanOpen: 0, tags: ["門前"] },
  { name: "一盃口 (イーペーコー)", hanClosed: 1, hanOpen: 0, tags: ["門前"] },
  { name: "役牌 (白/發/中/自風/場風)", hanClosed: 1, hanOpen: 1, tags: ["刻子"] },
  { name: "三色同順", hanClosed: 2, hanOpen: 1, tags: ["順子"] },
  { name: "一気通貫 (イッツー)", hanClosed: 2, hanOpen: 1, tags: ["順子"] },
  { name: "対々和 (トイトイ)", hanClosed: 2, hanOpen: 2, tags: ["刻子"] },
  { name: "三暗刻", hanClosed: 2, hanOpen: 2, tags: ["暗刻×3"] },
  { name: "三色同刻", hanClosed: 2, hanOpen: 2, tags: ["刻子"] },
  { name: "混全帯么九 (チャンタ)", hanClosed: 2, hanOpen: 1, tags: ["1,9,字牌含む"] },
  { name: "純全帯么九 (純チャン)", hanClosed: 3, hanOpen: 2, tags: ["1,9のみ"] },
  { name: "混一色 (ホンイツ)", hanClosed: 3, hanOpen: 2, tags: ["一色+字"] },
  { name: "清一色 (チンイツ)", hanClosed: 6, hanOpen: 5, tags: ["一色"] },
  { name: "小三元", hanClosed: 2, hanOpen: 2, tags: ["役牌×2+雀頭"] },
  { name: "二盃口 (リャンペーコー)", hanClosed: 3, hanOpen: 0, tags: ["門前"] },
  { name: "大三元", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "小四喜", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "大四喜", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満×2扱いの場合あり"] },
  { name: "四暗刻", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "四暗刻単騎", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["ダブル役満扱いも"] },
  { name: "字一色", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "清老頭", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "緑一色", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "国士無双", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "国士無双13面待ち", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["ダブル役満扱いも"] },
  { name: "四槓子", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
  { name: "天和 / 地和", hanClosed: "yakuman", hanOpen: "yakuman", tags: ["役満"] },
];

export function randomYAKU() {
  const yakulength = YAKU.length;
  const yakuNumber = Math.floor(Math.random() * yakulength);
  return YAKU[yakuNumber];
}

export default function App() {
  const [text, setText] = useState("ボタンを押してください");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-green-700 p-6">
      {/* メインカード */}
      <div className="bg-emerald-950 bg-opacity-90 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border-4 border-yellow-600">
        <h1 className="text-3xl font-bold mb-6 tracking-wide text-yellow-400 drop-shadow-lg">
          今日の役
        </h1>
        <p className="text-2xl mb-6 text-emerald-100 font-medium">{text}</p>
        <button
          onClick={() => {
            const yaku = randomYAKU();
            setText(yaku.name);
          }}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl shadow-lg border-2 border-yellow-400 transition-transform transform hover:scale-105"
        >
          役を選ぶ！
        </button>
      </div>

      {/* あそびかた */}
      <div className="mt-8 max-w-lg text-center text-emerald-100 text-sm opacity-80">
        <h2 className="text-base font-semibold text-yellow-300 mb-2">あそびかた</h2>
        <p>
          全30種の役からランダムで1つ表示されます。<br />
          今日の対局で目指したり、選ばれた役にボーナスをつけたりして楽しんでみてください。
        </p>
      </div>
    </div>
  );
}
