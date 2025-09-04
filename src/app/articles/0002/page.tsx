"use client"
import { useState } from "react";

const YAKU = [
  { name: "立直 (リーチ)", halfPoint: 500 },
  { name: "一発", halfPoint: 500 },
  { name: "門前清自摸和 (ツモ)", halfPoint: 500 },
  { name: "断么九 (タンヤオ)", halfPoint: 500 },
  { name: "平和 (ピンフ)", halfPoint: 500 },
  { name: "一盃口 (イーペーコー)", halfPoint: 500 },
  { name: "役牌 (白/發/中/自風/場風)", halfPoint: 500 },
  { name: "三色同順", halfPoint: 1000 },
  { name: "一気通貫 (イッツー)", halfPoint: 1000 },
  { name: "対々和 (トイトイ)", halfPoint: 1000 },
  { name: "三暗刻", halfPoint: 1000 },
  { name: "三色同刻", halfPoint: 1000 },
  { name: "混全帯么九 (チャンタ)", halfPoint: 1000 },
  { name: "純全帯么九 (純チャン)", halfPoint: 2000 },
  { name: "混一色 (ホンイツ)", halfPoint: 2000 },
  { name: "清一色 (チンイツ)", halfPoint: 6000 },
  { name: "小三元", halfPoint: 1000 },
  { name: "二盃口 (リャンペーコー)", halfPoint: 1950 },
  { name: "大三元", halfPoint: 16000 },
  { name: "小四喜", halfPoint: 16000 },
  { name: "大四喜", halfPoint: 16000 }, // ダブル役満を考慮するなら 32000
  { name: "四暗刻", halfPoint: 16000 },
  { name: "四暗刻単騎", halfPoint: 16000 },
  { name: "字一色", halfPoint: 16000 },
  { name: "清老頭", halfPoint: 16000 },
  { name: "緑一色", halfPoint: 16000 },
  { name: "国士無双", halfPoint: 16000 },
  { name: "国士無双13面待ち", halfPoint: 16000 }, // ダブルなら 32000
  { name: "四槓子", halfPoint: 16000 },
  { name: "天和 / 地和", halfPoint: 16000 },
];


export function randomYAKU() {
  const yakulength = YAKU.length;
  const yakuNumber = Math.floor(Math.random() * yakulength);
  return YAKU[yakuNumber];
}

export default function App() {
  const [text, setText] = useState("ボタンを押してください");
  const [point, setPoint]=useState("????");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-green-700 p-6">
      {/* メインカード */}
      <div className="bg-emerald-950 bg-opacity-90 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border-4 border-yellow-600">
        <h1 className="text-3xl font-bold mb-6 tracking-wide text-yellow-400 drop-shadow-lg">
          今日のボーナス役
        </h1>
        <p className="text-2xl mb-6 text-emerald-100 font-medium">{text}</p>
        <p className="text-yellow-400 font-bold mb-6 text-2xl">役ボーナス＋{point}点</p>
        <button
          onClick={() => {
            const yaku = randomYAKU();
            setText(yaku.name);
            setPoint(String(yaku.halfPoint));
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
          全30種の役からランダムで1つ表示され、その役が次の「ボーナス役」となります。<br />
          自摸上がりの場合はボーナス点を対面が払うなどの取り決めがあるとよいかもしれません。
        </p>
      </div>
    </div>
  );
}
