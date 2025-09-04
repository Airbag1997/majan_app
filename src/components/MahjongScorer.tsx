import React, { useMemo, useState } from "react";
import MahjongTile from "./MahjongTile";

/** ===========================
 *  タイル定義とユーティリティ
 *  =========================== */
type Suit = "m" | "p" | "s"; // 萬・筒・索
type Honor = "E" | "S" | "W" | "N" | "P" | "F" | "C"; // 東南西北白發中（P=白, F=發, C=中）

const numberTiles: string[] = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${n}m`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${n}p`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${n}s`),
];
const honorTiles: Honor[] = ["E", "S", "W", "N", "P", "F", "C"];
const ALL_TILES: string[] = [...numberTiles, ...honorTiles];

const tileToIndex = (t: string): number => {
  if (/^[1-9][mps]$/.test(t)) {
    const n = parseInt(t[0], 10);
    const s = t[1] as Suit;
    const base = s === "m" ? 0 : s === "p" ? 9 : 18;
    return base + (n - 1);
  }
  const idx = honorTiles.indexOf(t as Honor);
  return 27 + idx;
};

const isHonor = (idx: number) => idx >= 27;
const isTerminal = (idx: number) => {
  if (idx >= 27) return false;
  const n = (idx % 9) + 1;
  return n === 1 || n === 9;
};
const idxSuit = (idx: number): Suit | "z" => {
  if (idx < 9) return "m";
  if (idx < 18) return "p";
  if (idx < 27) return "s";
  return "z";
};
const idxNumber = (idx: number) => (idx % 9) + 1;

/** ===========================
 *  基本スコア処理（満貫以上含む）
 *  =========================== */
type WinType = "tsumo" | "ron";

function ceil100(x: number) {
  return Math.ceil(x / 100) * 100;
}

function limitNameFromHanBase(han: number, baseOver: boolean) {
  if (han >= 13) return "役満";
  if (han >= 11) return "三倍満";
  if (han >= 8) return "倍満";
  if (han >= 6) return "跳満";
  if (han >= 5 || baseOver) return "満貫";
  return "通常計算";
}

function calcScoreCore(han: number, fu: number, isDealer: boolean) {
  let base = fu * Math.pow(2, 2 + han); // 通常計算の基礎（4翻以下）
  let baseOver = false;
  let limitName = "通常計算";
  if (han >= 5) limitName = "満貫";
  else if (base > 2000) {
    baseOver = true;
    limitName = "満貫";
  } else if (han >= 6) limitName = "跳満";
  if (han >= 6) limitName = "跳満";
  if (han >= 8) limitName = "倍満";
  if (han >= 11) limitName = "三倍満";
  if (han >= 13) limitName = "役満";

  let ron = 0,
    tsumoEachDealer = 0,
    tsumoEachNonDealer = 0;
  if (limitName === "通常計算") {
    if (isDealer) {
      ron = ceil100(base * 6);
      tsumoEachDealer = ceil100(base * 2); // 親ツモは3人からコレ
    } else {
      ron = ceil100(base * 4);
      tsumoEachDealer = ceil100(base * 2); // 子ツモ：親
      tsumoEachNonDealer = ceil100(base * 1); // 子ツモ：子
    }
  } else {
    const childRonTable = {
      満貫: 8000,
      跳満: 12000,
      倍満: 16000,
      三倍満: 24000,
      役満: 32000,
    } as const;
    const name = limitName as keyof typeof childRonTable;
    const childRon = childRonTable[name];
    const parentRon = Math.floor(childRon * 1.5);
    if (isDealer) {
      ron = parentRon;
      const parentTsumoEach = {
        満貫: 4000,
        跳満: 6000,
        倍満: 8000,
        三倍満: 12000,
        役満: 16000,
      } as const;
      tsumoEachDealer = parentTsumoEach[name];
    } else {
      ron = childRon;
      const childTsumoDealer = {
        満貫: 2000,
        跳満: 3000,
        倍満: 4000,
        三倍満: 6000,
        役満: 8000,
      } as const;
      const childTsumoNon = {
        満貫: 1000,
        跳満: 1500,
        倍満: 2000,
        三倍満: 3000,
        役満: 4000,
      } as const;
      tsumoEachDealer = childTsumoDealer[name];
      tsumoEachNonDealer = childTsumoNon[name];
    }
  }

  return {
    basePointsShown: Math.min(base, 2000),
    limitName,
    ron,
    tsumoEachDealer,
    tsumoEachNonDealer,
  };
}

/** ===========================
 *  役判定・面子分解
 *  =========================== */

type HandInfo = {
  counts: number[]; // 34種カウント
  tiles: string[]; // 14枚（副露なしの場合）
  isClosed: boolean;
  winType: WinType;
  waitType: "ryanmen" | "kanchan" | "penchan" | "tanki"; // 待ち形入力
  seatWind: "E" | "S" | "W" | "N";
  roundWind: "E" | "S" | "W" | "N";
  riichi: boolean;
  winningTileIdx?: number; // 和了牌（待ち形用・平和判定用）
};

const honorGlyph: Record<Honor, string> = {
  E: "東",
  S: "南",
  W: "西",
  N: "北",
  P: "　",
  F: "發",
  C: "中",
};

function cloneCounts(a: number[]) {
  return a.slice();
}

function canFormMentsuWithPair(counts: number[]): boolean {
  // 任意の雀頭1つ + 4面子の形式かをDFS
  for (let i = 0; i < 34; i++) {
    if (counts[i] >= 2) {
      const c = cloneCounts(counts);
      c[i] -= 2;
      if (canFormMentsu(c, 4)) return true;
    }
  }
  return false;
}

function canFormMentsu(counts: number[], mentsuLeft: number): boolean {
  if (mentsuLeft === 0) {
    // 全部0ならOK
    return counts.every((x) => x === 0);
  }
  // 次のタイルを探す
  let i = counts.findIndex((x) => x > 0);
  if (i === -1) return false;

  // 刻子（ポン）を作る
  if (counts[i] >= 3) {
    counts[i] -= 3;
    if (canFormMentsu(counts, mentsuLeft - 1)) return true;
    counts[i] += 3;
  }

  // 順子（チー）を作る（数牌のみ）
  if (i < 27) {
    const s = idxSuit(i);
    const n = idxNumber(i);
    if (s !== "z" && n <= 7) {
      const i2 = i + 1,
        i3 = i + 2;
      if (
        idxSuit(i2) === s &&
        idxSuit(i3) === s &&
        counts[i2] > 0 &&
        counts[i3] > 0
      ) {
        counts[i]--;
        counts[i2]--;
        counts[i3]--;
        if (canFormMentsu(counts, mentsuLeft - 1)) return true;
        counts[i]++;
        counts[i2]++;
        counts[i3]++;
      }
    }
  }
  return false;
}

function isChiitoi(counts: number[]): boolean {
  let pairs = 0;
  for (let i = 0; i < 34; i++) {
    if (counts[i] === 2) pairs++;
    else if (counts[i] !== 0) return false;
  }
  return pairs === 7;
}

// 面子分解（1例）を作って評価に使う
type Decomp = {
  pair: number; // 雀頭 index
  sets: Array<{ type: "pon" | "chi"; tiles: number[] }>;
};
function oneDecomposition(counts: number[]): Decomp | null {
  for (let i = 0; i < 34; i++) {
    if (counts[i] >= 2) {
      const c = cloneCounts(counts);
      c[i] -= 2;
      const sets: Decomp["sets"] = [];
      if (buildSets(c, sets)) return { pair: i, sets };
    }
  }
  return null;
}
function buildSets(counts: number[], sets: Decomp["sets"]): boolean {
  if (counts.every((x) => x === 0)) return true;
  const i = counts.findIndex((x) => x > 0);
  // pon
  if (counts[i] >= 3) {
    counts[i] -= 3;
    sets.push({ type: "pon", tiles: [i, i, i] });
    if (buildSets(counts, sets)) return true;
    sets.pop();
    counts[i] += 3;
  }
  // chi
  if (i < 27) {
    const s = idxSuit(i),
      n = idxNumber(i);
    if (s !== "z" && n <= 7) {
      const i2 = i + 1,
        i3 = i + 2;
      if (
        idxSuit(i2) === s &&
        idxSuit(i3) === s &&
        counts[i2] > 0 &&
        counts[i3] > 0
      ) {
        counts[i]--;
        counts[i2]--;
        counts[i3]--;
        sets.push({ type: "chi", tiles: [i, i2, i3] });
        if (buildSets(counts, sets)) return true;
        sets.pop();
        counts[i]++;
        counts[i2]++;
        counts[i3]++;
      }
    }
  }
  return false;
}

/** 役判定（門前前提の喰い下がり簡略は未実装。副露トグルで将来対応可） */
type Yaku = {
  name: string;
  han: number; // 門前時
};
type YakuResult = { name: string; han: number }[];

function countYakuhaiPons(d: Decomp, seat: Honor, round: Honor) {
  let han = 0;
  for (const s of d.sets) {
    if (s.type !== "pon") continue;
    const i = s.tiles[0];
    if (i < 27) continue;
    const h = honorTiles[i - 27];
    if (h === "P" || h === "F" || h === "C") han += 1; // 三元牌
    if (h === seat) han += 1; // 自風
    if (h === round) han += 1; // 場風
  }
  return han;
}

function isTanyao(counts: number[]) {
  for (let i = 0; i < 34; i++) {
    if (isHonor(i)) {
      if (counts[i] > 0) return false;
    } else {
      const n = idxNumber(i);
      if ((n === 1 || n === 9) && counts[i] > 0) return false;
    }
  }
  return true;
}

function isToitoi(d: Decomp) {
  return d.sets.every((s) => s.type === "pon");
}

function isPinfu(
  d: Decomp,
  pairIdx: number,
  seat: Honor,
  round: Honor,
  wait: HandInfo["waitType"],
  isClosed: boolean
) {
  if (!isClosed) return false; // 平和は門前のみ
  if (wait !== "ryanmen") return false; // 両面待ちのみ（簡略）
  // すべて順子で刻子なし
  if (!d.sets.every((s) => s.type === "chi")) return false;
  // 雀頭が役牌でない
  if (pairIdx >= 27) {
    const h = honorTiles[pairIdx - 27];
    if (h === "P" || h === "F" || h === "C" || h === seat || h === round)
      return false;
  }
  return true;
}

function countIipeiko(d: Decomp, isClosed: boolean) {
  if (!isClosed) return 0;
  // 同一順子が1組
  const chis = d.sets
    .filter((s) => s.type === "chi")
    .map((s) => s.tiles.join(","));
  chis.sort();
  let cnt = 0;
  for (let i = 1; i < chis.length; i++) if (chis[i] === chis[i - 1]) cnt++;
  return Math.min(1, cnt); // 一盃口のみ
}

function detectFlush(counts: number[]): {
  chinitsu?: boolean;
  honitsu?: boolean;
  suit?: Suit;
} {
  const suitHas = { m: false, p: false, s: false, z: false };
  for (let i = 0; i < 34; i++) if (counts[i] > 0) suitHas[idxSuit(i)] = true;
  const suits = (["m", "p", "s"] as Suit[]).filter((s) => suitHas[s]);
  if (suits.length === 1) {
    if (!suitHas["z"]) return { chinitsu: true, suit: suits[0] };
    return { honitsu: true, suit: suits[0] };
  }
  if (suits.length === 0) return {};
  if (suits.length === 1 && suitHas["z"])
    return { honitsu: true, suit: suits[0] };
  return {};
}

// ---- 役検出ヘルパ ----
const winds: Honor[] = ["E", "S", "W", "N"];
const dragons: Honor[] = ["P", "F", "C"];

function allTerminalsOrHonors(counts: number[]) {
  for (let i = 0; i < 34; i++) {
    if (counts[i] === 0) continue;
    if (i < 27) {
      const n = idxNumber(i);
      if (n !== 1 && n !== 9) return false;
    } else {
      // 字はOK
    }
  }
  return true;
}
function terminalsOnly(counts: number[]) {
  for (let i = 0; i < 34; i++) {
    if (counts[i] === 0) continue;
    if (i >= 27) return false;
    const n = idxNumber(i);
    if (n !== 1 && n !== 9) return false;
  }
  return true;
}
function honorsOnly(counts: number[]) {
  for (let i = 27; i < 34; i++) if (counts[i] > 0) continue; // ok
  for (let i = 0; i < 27; i++) if (counts[i] > 0) return false;
  return true;
}
function greenOnly(counts: number[]) {
  // 緑一色: 索の2,3,4,6,8 と 發 のみ
  const greenIdx = new Set<number>([
    tileToIndex("2s"),
    tileToIndex("3s"),
    tileToIndex("4s"),
    tileToIndex("6s"),
    tileToIndex("8s"),
    tileToIndex("F"),
  ]);
  for (let i = 0; i < 34; i++) {
    if (counts[i] === 0) continue;
    if (!greenIdx.has(i)) return false;
  }
  return true;
}
function isIttsuu(d: Decomp) {
  // 同一スートで 123 / 456 / 789 の3順子
  const bySuit: Record<"m" | "p" | "s", Set<string>> = {
    m: new Set(),
    p: new Set(),
    s: new Set(),
  };
  for (const s of d.sets)
    if (s.type === "chi") {
      const suit = idxSuit(s.tiles[0]) as Suit;
      const nums = s.tiles
        .map(idxNumber)
        .sort((a, b) => a - b)
        .join("");
      bySuit[suit].add(nums);
    }
  for (const suit of ["m", "p", "s"] as Suit[]) {
    if (
      bySuit[suit].has("123") &&
      bySuit[suit].has("456") &&
      bySuit[suit].has("789")
    )
      return true;
  }
  return false;
}
function isSanshokuDoujun(d: Decomp) {
  // 各スートに同じ数字の順子があるか（例: 234m,234p,234s）
  const map = new Map<string, Set<Suit>>();
  for (const s of d.sets)
    if (s.type === "chi") {
      const nums = s.tiles
        .map(idxNumber)
        .sort((a, b) => a - b)
        .join("");
      const suit = idxSuit(s.tiles[0]) as Suit;
      const key = nums;
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(suit);
    }
  for (const [_, suits] of map) if (suits.size === 3) return true;
  return false;
}
function isSanshokuDoukou(d: Decomp) {
  // 同一数字の刻子が m/p/s で3つ
  const cnt = new Map<number, Set<Suit>>();
  for (const s of d.sets)
    if (s.type === "pon" && s.tiles[0] < 27) {
      const n = idxNumber(s.tiles[0]);
      const suit = idxSuit(s.tiles[0]) as Suit;
      if (!cnt.has(n)) cnt.set(n, new Set());
      cnt.get(n)!.add(suit);
    }
  for (const k of cnt.values()) if (k.size === 3) return true;
  return false;
}
function isChanta(counts: number[], d: Decomp, pairIdx: number) {
  // すべての面子と雀頭が「么九or字」を含む
  const pairOK = pairIdx >= 27 || isTerminal(pairIdx);
  if (!pairOK) return false;
  for (const s of d.sets) {
    if (s.type === "chi") {
      const n1 = idxNumber(s.tiles[0]);
      const n3 = idxNumber(s.tiles[2]);
      if (!(n1 === 1 || n3 === 9)) return false;
    } else {
      const i = s.tiles[0];
      if (!(isHonor(i) || isTerminal(i))) return false;
    }
  }
  return true;
}
function isJunchan(counts: number[], d: Decomp, pairIdx: number) {
  // 字牌を含まず、全部が端（1 or 9）を含む
  for (let i = 27; i < 34; i++) if (counts[i] > 0) return false;
  const pairOK = isTerminal(pairIdx);
  if (!pairOK) return false;
  for (const s of d.sets) {
    if (s.type === "chi") {
      const n1 = idxNumber(s.tiles[0]);
      const n3 = idxNumber(s.tiles[2]);
      if (!(n1 === 1 || n3 === 9)) return false;
    } else {
      const i = s.tiles[0];
      if (!isTerminal(i)) return false;
    }
  }
  return true;
}
function countDragonPons(d: Decomp) {
  let dragonsPon = 0;
  for (const s of d.sets)
    if (s.type === "pon" && s.tiles[0] >= 27) {
      const h = honorTiles[s.tiles[0] - 27];
      if (dragons.includes(h)) dragonsPon++;
    }
  return dragonsPon;
}
function countWindPons(d: Decomp) {
  let windsPon = 0;
  for (const s of d.sets)
    if (s.type === "pon" && s.tiles[0] >= 27) {
      const h = honorTiles[s.tiles[0] - 27];
      if (winds.includes(h)) windsPon++;
    }
  return windsPon;
}
function countChiPairsForRyanpeiko(d: Decomp) {
  // 同一順子が2組×2（=二盃口）
  const chis = d.sets
    .filter((s) => s.type === "chi")
    .map((s) => s.tiles.join(","))
    .sort();
  let pairs = 0,
    i = 1;
  while (i < chis.length) {
    if (chis[i] === chis[i - 1]) {
      pairs++;
      i += 2;
    } else i++;
  }
  return pairs >= 2;
}
function isChinitsuOrHonitsu(counts: number[]) {
  const suitHas = { m: false, p: false, s: false, z: false };
  for (let i = 0; i < 34; i++) if (counts[i] > 0) suitHas[idxSuit(i)] = true;
  const suits = (["m", "p", "s"] as Suit[]).filter((s) => suitHas[s]);
  if (suits.length === 1 && !suitHas["z"]) return "chinitsu";
  if (suits.length === 1 && suitHas["z"]) return "honitsu";
  return "";
}
function isChuuren(counts: number[]) {
  // 九蓮：門前 1スート限定 + 1112345678999 + 任意1枚
  // かんたん検査：一色かつ、数牌のみで 1,9が各3枚以上／2–8が各1枚以上
  let suit = -1;
  for (let i = 0; i < 27; i++) {
    if (counts[i] === 0) continue;
    if (suit === -1) suit = Math.floor(i / 9);
    if (suit !== Math.floor(i / 9)) return false;
  }
  if (suit === -1) return false;
  const base = suit * 9;
  const need = [3, 1, 1, 1, 1, 1, 1, 1, 3]; // 1..9
  for (let k = 0; k < 9; k++) {
    if (counts[base + k] < need[k]) return false;
  }
  // 合計14枚になっていることは手牌側で保証
  return true;
}
function fourConcealedPonsPossible(d: Decomp, isClosed: boolean) {
  // 門前なら「四暗刻」の可能性を判定（※ 単騎待ちの純正はBステップで）
  if (!isClosed) return false;
  let pons = 0;
  for (const s of d.sets) if (s.type === "pon") pons++;
  return pons === 4;
}

function judgeYaku(info: HandInfo): {
  han: number;
  yaku: YakuResult;
  decomp?: Decomp;
  isChiitoiHand: boolean;
  yakuman: string[];
} {
  const counts = info.counts.slice();
  const yakus: YakuResult = [];
  const yakuman: string[] = [];

  // 七対子
  if (isChiitoi(counts)) {
    if (info.riichi) yakus.push({ name: "リーチ", han: 1 });
    if (info.winType === "tsumo" && info.isClosed)
      yakus.push({ name: "門前清自摸和", han: 1 });
    yakus.push({ name: "七対子", han: 2 });

    const cs = isChinitsuOrHonitsu(counts);
    if (cs === "chinitsu") yakus.push({ name: "清一色", han: 6 });
    else if (cs === "honitsu")
      yakus.push({ name: "混一色", han: info.isClosed ? 3 : 2 });

    // 役満系（七対子由来では通常付かない）
    return {
      han: yakus.reduce((a, b) => a + b.han, 0),
      yaku: yakus,
      isChiitoiHand: true,
      yakuman,
    };
  }

  // 4面子1雀頭を確認
  if (!canFormMentsuWithPair(counts)) {
    return { han: 0, yaku: [], isChiitoiHand: false, yakuman: [] };
  }
  const d = oneDecomposition(counts)!;

  // 一般役
  if (info.riichi) yakus.push({ name: "リーチ", han: 1 });
  if (info.winType === "tsumo" && info.isClosed)
    yakus.push({ name: "門前清自摸和", han: 1 });
  if (isTanyao(counts)) yakus.push({ name: "断么九", han: 1 });
  const yakuhaiHan = countYakuhaiPons(d, info.seatWind, info.roundWind);
  if (yakuhaiHan > 0) yakus.push({ name: "役牌", han: yakuhaiHan });
  if (
    isPinfu(
      d,
      d.pair,
      info.seatWind,
      info.roundWind,
      info.waitType,
      info.isClosed
    )
  )
    yakus.push({ name: "平和", han: 1 });
  const iipeiko = countIipeiko(d, info.isClosed);
  if (iipeiko) yakus.push({ name: "一盃口", han: 1 });
  if (countChiPairsForRyanpeiko(d)) yakus.push({ name: "二盃口", han: 3 }); // 門前のみ

  if (isToitoi(d)) yakus.push({ name: "対々和", han: 2 });
  if (isIttsuu(d)) yakus.push({ name: "一気通貫", han: info.isClosed ? 2 : 1 });
  if (isSanshokuDoujun(d))
    yakus.push({ name: "三色同順", han: info.isClosed ? 2 : 1 });
  if (isSanshokuDoukou(d)) yakus.push({ name: "三色同刻", han: 2 });

  if (isChanta(counts, d, d.pair))
    yakus.push({ name: "全帯么九(チャンタ)", han: info.isClosed ? 2 : 1 });
  if (isJunchan(counts, d, d.pair))
    yakus.push({
      name: "純全帯么九(ジュンチャン)",
      han: info.isClosed ? 3 : 2,
    });

  // 老頭系
  if (allTerminalsOrHonors(counts)) yakus.push({ name: "混老頭", han: 2 });
  if (terminalsOnly(counts)) yakus.push({ name: "清老頭", han: 13 }); // 役満相当（実際は役満）

  //一色
  const cs = isChinitsuOrHonitsu(counts);
  if (cs === "chinitsu")
    yakus.push({ name: "清一色", han: info.isClosed ? 6 : 5 });
  else if (cs === "honitsu")
    yakus.push({ name: "混一色", han: info.isClosed ? 3 : 2 });

  // 役満系（分解で判定できるもの）
  const dr = countDragonPons(d);
  if (dr === 3) yakuman.push("大三元");
  else if (dr === 2) yakus.push({ name: "小三元", han: 2 }); // 実戦では2翻＋役牌3翻=合計5翻相当

  const wp = countWindPons(d);
  if (wp === 4) yakuman.push("大四喜");
  else if (wp === 3) yakuman.push("小四喜");

  if (honorsOnly(counts)) yakuman.push("字一色");
  if (terminalsOnly(counts)) yakuman.push("清老頭");
  if (greenOnly(counts)) yakuman.push("緑一色");
  if (info.isClosed && isChuuren(counts)) yakuman.push("九蓮宝燈");
  if (fourConcealedPonsPossible(d, info.isClosed)) yakuman.push("四暗刻"); // 単騎かどうかはBで拡張

  //（注）三暗刻・三槓子・四槓子・槍槓・嶺上・海底/河底・天和/地和はBで対応
  const totalHan = yakus.reduce((a, b) => a + b.han, 0);
  return {
    han: totalHan,
    yaku: yakus,
    decomp: d,
    isChiitoiHand: false,
    yakuman,
  };
}
/** 符計算（実戦水準：七対子25符、平和ツモ20符、門前ロン+10、面子/雀頭/待ち/ツモ符） */
function calcFu(
  info: HandInfo,
  decomp: Decomp | undefined,
  isChiitoi: boolean
): number {
  if (isChiitoi) return 25;

  if (!decomp) return 0;

  // 平和ツモは20符（待ち形=両面、雀頭=非役牌、面子=すべて順子、かつ門前）
  const isPinfuHand =
    info.isClosed &&
    info.waitType === "ryanmen" &&
    decomp.sets.every((s) => s.type === "chi") &&
    !(
      decomp.pair >= 27 &&
      ["P", "F", "C", info.seatWind, info.roundWind].includes(
        honorTiles[decomp.pair - 27]
      )
    );

  if (isPinfuHand && info.winType === "tsumo") return 20;

  let fu = 20; // 基本
  // 門前ロン +10
  if (info.isClosed && info.winType === "ron") fu += 10;
  // ツモ +2（ただし平和ツモは上で20固定）
  if (info.winType === "tsumo") fu += 2;

  // 雀頭（役牌）+2
  if (decomp.pair >= 27) {
    const h = honorTiles[decomp.pair - 27];
    if (["P", "F", "C", info.seatWind, info.roundWind].includes(h)) fu += 2;
  }

  // 面子（暗刻/明刻の区別は副露情報が無いので「暗刻扱い」で実装。必要なら面子編集UIを追加可能）
  for (const s of decomp.sets) {
    if (s.type === "pon") {
      const i = s.tiles[0];
      const terminalOrHonor = isHonor(i) || isTerminal(i);
      // 暗刻： 2/4/8 → 4/8/16（中張/幺九）
      fu += terminalOrHonor ? 8 : 4;
    }
  }

  // 待ち形 +2（坎張/辺張/単騎）
  if (["kanchan", "penchan", "tanki"].includes(info.waitType)) fu += 2;

  // 10の位切り上げ
  fu = Math.ceil(fu / 10) * 10;
  return fu;
}

/** ===========================
 *  UI: MahjongScorer
 *  =========================== */
export const MahjongScorer: React.FC = () => {
  // 手牌（クリックで追加/削除）
  const [hand, setHand] = useState<string[]>([]);
  // 和了形の前提：14枚になるように入れてください（副露未対応のため）
  const [isClosed, setIsClosed] = useState(true);
  const [winType, setWinType] = useState<WinType>("ron");
  const [waitType, setWaitType] = useState<HandInfo["waitType"]>("ryanmen");
  const [seatWind, setSeatWind] = useState<Honor>("E");
  const [roundWind, setRoundWind] = useState<Honor>("E");
  const [riichi, setRiichi] = useState(false);
  const [isDealer, setIsDealer] = useState(false);
  const [honba, setHonba] = useState(0);
  const [kyotaku, setKyotaku] = useState(0);

  const counts = useMemo(() => {
    const c = Array(34).fill(0);
    for (const t of hand) c[tileToIndex(t)]++;
    return c;
  }, [hand]);

  const info: HandInfo = {
    counts,
    tiles: hand,
    isClosed,
    winType,
    waitType,
    seatWind,
    roundWind,
    riichi,
  } as any;

  const judged = useMemo(() => judgeYaku(info), [JSON.stringify(info)]);

  const fu = useMemo(
    () => calcFu(info, judged.decomp, judged.isChiitoiHand),
    [JSON.stringify(info), judged.decomp, judged.isChiitoiHand]
  );
  const core = useMemo(() => {
    const {
      basePointsShown,
      limitName,
      ron,
      tsumoEachDealer,
      tsumoEachNonDealer,
    } = calcScoreCore(judged.han, fu, isDealer);
    return {
      basePointsShown,
      limitName,
      ron,
      tsumoEachDealer,
      tsumoEachNonDealer,
    };
  }, [judged.han, fu, isDealer]);

  const finalDisplay = useMemo(() => {
    const hbRon = 300 * honba;
    const hbTsumoEach = 100 * honba;
    const ky = 1000 * kyotaku;

    if (winType === "ron") {
      const pay = core.ron + hbRon;
      const total = pay + ky;
      return {
        header: `${core.limitName} / ${judged.han}翻 ${fu}符 / ${
          isDealer ? "親" : "子"
        } / ロン`,
        lines: [
          `放銃者支払い: ${pay.toLocaleString()} 点${
            honba ? `（本場 +${hbRon}）` : ""
          }`,
          ...(kyotaku ? [`供託: +${ky.toLocaleString()} 点`] : []),
          `合計獲得: ${total.toLocaleString()} 点`,
        ],
      };
    } else {
      if (isDealer) {
        const each = core.tsumoEachDealer + hbTsumoEach;
        const total = each * 3 + ky;
        return {
          header: `${core.limitName} / ${judged.han}翻 ${fu}符 / 親 / ツモ`,
          lines: [
            `子×3 各: ${each.toLocaleString()} 点${
              honba ? `（本場 +${hbTsumoEach}）` : ""
            }`,
            ...(kyotaku ? [`供託: +${ky.toLocaleString()} 点`] : []),
            `合計獲得: ${total.toLocaleString()} 点`,
          ],
        };
      } else {
        const dealerEach = core.tsumoEachDealer + hbTsumoEach;
        const nonDealerEach = core.tsumoEachNonDealer + hbTsumoEach;
        const total = dealerEach + nonDealerEach * 2 + ky;
        return {
          header: `${core.limitName} / ${judged.han}翻 ${fu}符 / 子 / ツモ`,
          lines: [
            `親: ${dealerEach.toLocaleString()} 点${
              honba ? `（本場 +${hbTsumoEach}）` : ""
            }`,
            `子×2 各: ${nonDealerEach.toLocaleString()} 点${
              honba ? `（本場 +${hbTsumoEach}）` : ""
            }`,
            ...(kyotaku ? [`供託: +${ky.toLocaleString()} 点`] : []),
            `合計獲得: ${total.toLocaleString()} 点`,
          ],
        };
      }
    }
  }, [core, honba, kyotaku, winType, isDealer, judged.han, fu]);

  const yakuList = judged.yaku.map((y) => `${y.name}(${y.han})`).join("、");

  // 牌ボタン
  const addTile = (t: string) => {
    const i = tileToIndex(t);
    if (counts[i] >= 4) return; // 4枚制限
    if (hand.length >= 14) return; // 14枚まで（副露未対応）
    setHand([...hand, t]);
  };
  const removeAt = (idx: number) => {
    const h = hand.slice();
    h.splice(idx, 1);
    setHand(h);
  };
  const clearHand = () => setHand([]);

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "16px auto",
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
      }}
      className="bg-white"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginTop: 12,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>勝ち方</span>
          <select
            value={winType}
            onChange={(e) => setWinType(e.target.value as WinType)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          >
            <option value="ron">ロン</option>
            <option value="tsumo">ツモ</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>親/子</span>
          <select
            value={isDealer ? "dealer" : "child"}
            onChange={(e) => setIsDealer(e.target.value === "dealer")}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          >
            <option value="child">子</option>
            <option value="dealer">親</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>副露</span>
          <select
            value={isClosed ? "closed" : "open"}
            onChange={(e) => setIsClosed(e.target.value === "closed")}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          >
            <option value="closed">門前</option>
            <option value="open">副露あり（簡略）</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>待ち形</span>
          <select
            value={waitType}
            onChange={(e) => setWaitType(e.target.value as any)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          >
            <option value="ryanmen">両面</option>
            <option value="kanchan">嵌張</option>
            <option value="penchan">辺張</option>
            <option value="tanki">単騎</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>場風</span>
          <select
            value={roundWind}
            onChange={(e) => setRoundWind(e.target.value as Honor)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          >
            {["東", "南", "西", "北"].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>自風</span>
          <select
            value={seatWind}
            onChange={(e) => setSeatWind(e.target.value as Honor)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          >
            {["東", "南", "西", "北"].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>リーチ棒（供託）</span>
          <input
            type="number"
            min={0}
            value={kyotaku}
            onChange={(e) =>
              setKyotaku(Math.max(0, Number(e.target.value || 0)))
            }
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>本場</span>
          <input
            type="number"
            min={0}
            value={honba}
            onChange={(e) => setHonba(Math.max(0, Number(e.target.value || 0)))}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={riichi}
            onChange={(e) => setRiichi(e.target.checked)}
          />
          <span>リーチ</span>
        </label>
      </div>
      {/* 手牌表示 */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {hand.map((t, i) => (
            <MahjongTile
              key={`${t}-${i}`}
              code={t as any}
              size={44}
              selected
              onClick={() => removeAt(i)}
            />
          ))}
          <button
            onClick={clearHand}
            style={{
              marginLeft: "auto",
              padding: "6px 10px",
              border: "1px solid #ef4444",
              color: "#ef4444",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            クリア
          </button>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
          ※ 和了形は14枚で評価
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, minmax(0,1fr))",
          gap: 8,
          marginTop: 12,
        }}
      >
        {ALL_TILES.map((t) => {
          const i = tileToIndex(t);
          const disabled = counts[i] >= 4 || hand.length >= 14;
          return (
            <MahjongTile
              key={t}
              code={t as any}
              size={44}
              disabled={disabled}
              onClick={() => addTile(t)}
            />
          );
        })}
      </div>
      {/* 結果 */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: "#f9fafb",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          {finalDisplay.header}
        </div>
        <div style={{ marginBottom: 6 }}>
          役：{yakuList || "（役なし/未和了形）"}
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {finalDisplay.lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
        <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
          <div>基本点（参考）: {core.basePointsShown.toLocaleString()} 点</div>
          <div>手牌枚数: {hand.length} 枚</div>
        </div>
      </div>
    </div>
  );
};

export default MahjongScorer;
