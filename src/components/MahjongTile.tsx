// MahjongTile.tsx
import React from "react";

type Suit = "m" | "p" | "s";
type Honor = "E" | "S" | "W" | "N" | "P" | "F" | "C";
type TileCode = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${Suit}` | Honor;

export type MahjongTileProps = {
  code: TileCode;
  size?: number; // ピクセル（辺の長さ）
  selected?: boolean; // 選択中のハイライト
  disabled?: boolean; // 押下不可の見た目
  onClick?: () => void;
  className?: string; // 追加クラス（任意）
};

/**
 * SVGで麻雀牌を描画するコンポーネント。
 * - 数牌: 赤(萬)/黒(筒)/緑(索)の数字と簡易アイコン
 * - 字牌: 東南西北白發中
 * - 牌の縁・影・面の陰影を軽く付与
 */
export const MahjongTile: React.FC<MahjongTileProps> = ({
  code,
  size = 48,
  selected = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const isHonor = /^[ESWNPFC]$/.test(code);
  const suit = isHonor ? null : (code[1] as Suit);
  const num = isHonor ? null : Number(code[0]);

  // 色設定
  const suitColors: Record<Suit, { number: string; mark: string }> = {
    m: { number: "#111827", mark: "#d62828" }, // 萬: 数字黒、模様赤
    p: { number: "#111827", mark: "#111827" }, // 筒: 数字黒、模様黒
    s: { number: "#111827", mark: "#0f7600" }, // 索: 数字黒、模様緑
  };

  const textColor = isHonor ? "#111827" : suitColors[suit!].number;
  const markColor = isHonor ? "#111827" : suitColors[suit!].mark;

  const face = "#fffdfa"; // 牌面
  const edge = "#e5e7eb"; // 縁
  const shadow = "rgba(0,0,0,0.08)"; // 影
  const selBorder = selected ? "#3b82f6" : edge;
  const selGlow = selected ? "0 0 0 3px rgba(59,130,246,0.25)" : "none";
  const opacity = disabled ? 0.5 : 1;

  // 字牌の文字
  const honorGlyph: Record<Honor, string> = {
    E: "東",
    S: "南",
    W: "西",
    N: "北",
    P: "　",
    F: "發",
    C: "中",
  };

  // 数牌の控えめなスート図形（簡易アイコン）
  const suitMark = (s: Suit) => {
    switch (s) {
      case "m":
        return (
          <g>
            <rect x="14" y="26" width="20" height="6" rx="2" />
            <rect x="14" y="34" width="20" height="6" rx="2" />
          </g>
        );
      case "p":
        return (
          <g>
            <circle cx="28" cy="36" r="7" />
          </g>
        );
      case "s":
        return (
          <g>
            <rect x="14" y="26" width="6" height="20" rx="2" />
            <rect x="26" y="26" width="6" height="20" rx="2" />
            <rect x="38" y="26" width="6" height="20" rx="2" />
          </g>
        );
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size,
        height: size * 1.4,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
        filter: selGlow !== "none" ? `drop-shadow(${selGlow})` : undefined,
      }}
      className={className}
      aria-label={`tile-${code}`}
    >
      <svg
        viewBox="0 0 60 84"
        width="100%"
        height="100%"
        style={{ display: "block", opacity }}
      >
        {/* 影 */}
        <rect x="6" y="8" width="48" height="70" rx="8" fill={shadow} />
        {/* 牌本体 */}
        <rect
          x="4"
          y="4"
          width="48"
          height="70"
          rx="8"
          fill={face}
          stroke={selBorder}
          strokeWidth="2"
        />
        {/* 面のハイライト */}
        <rect
          x="4"
          y="4"
          width="48"
          height="16"
          rx="8"
          fill="rgba(255,255,255,0.5)"
        />

        {/* 内容 */}
        <g transform="translate(0,4)" fill={textColor} stroke="none">
          {isHonor ? (
            // 字牌
            <text
              x="28"
              y="44"
              textAnchor="middle"
              fontSize="28"
              fontWeight={honorGlyph[code as Honor] === "白" ? 400 : 700}
              fill={
                code === "C" ? "#d62828" : code === "F" ? "#059669" : "#111827"
              }
            >
              {honorGlyph[code as Honor]}
            </text>
          ) : (
            // 数牌
            <>
              <text
                x="28"
                y="24"
                textAnchor="middle"
                fontSize="22"
                fontWeight={700}
                fill={textColor}
              >
                {num}
              </text>
              {/* 模様はスート色 */}
              <g transform="translate(0,6)" fill={markColor} stroke={markColor}>
                {suitMark(suit!)}
              </g>
            </>
          )}
        </g>
      </svg>
    </button>
  );
};

export default MahjongTile;
