import { useState } from 'react';
import { 
  Definition, 
  Theorem, 
  Example, 
  Solution, 
  MathInline, 
  MathBlock, 
  // Proof,
  Exercises, 
  ExerciseItem 
} from '../../../../components/MathBlocks';

function AreaBetweenCurvesVisualizer() {
  const [preset, setPreset] = useState('x-basic'); // 'x-basic', 'x-intersect', 'y-basic'
  const [numStrips, setNumStrips] = useState(12);
  const [showStrips, setShowStrips] = useState(true);

  // Preset Configurations
  // Case 1: f(x) = x + 2, g(x) = x^2  on [-1, 2]
  // Case 2: f(x) = sin(x), g(x) = cos(x) on [0, pi]
  // Case 3: x = 3 - y^2 (right), x = y + 1 (left) on y in [-2, 1]

  let desc;
  let svgContent;
  let exactAreaVal;
  let approxAreaVal;

  if (preset === 'x-basic') {
    desc = '求 y = x + 2 與 y = x² 在交點 x = -1 與 x = 2 之間的包圍面積。上方函數為 f(x) = x + 2，下方函數為 g(x) = x²。';
    
    // Domain x in [-1.5, 2.5], y in [-0.5, 4.5]
    // SVG viewbox 0 0 500 320
    const toSvgX = (x) => 60 + ((x - (-1.5)) / 4) * 380;
    const toSvgY = (y) => 280 - ((y - (-0.5)) / 5) * 250;

    const xStart = -1;
    const xEnd = 2;
    const dx = (xEnd - xStart) / numStrips;

    // Exact integral int_{-1}^2 [(x+2) - x^2] dx = [x^2/2 + 2x - x^3/3]_{-1}^2 = (2 + 4 - 8/3) - (1/2 - 2 + 1/3) = 10/3 - (-7/6) = 27/6 = 4.5
    exactAreaVal = 4.5;
    let sumArea = 0;
    const stripsSvg = [];

    for (let i = 0; i < numStrips; i++) {
      const xi = xStart + i * dx;
      const xMid = xi + dx / 2;
      const topY = xMid + 2;
      const botY = xMid * xMid;
      const height = Math.max(0, topY - botY);
      sumArea += height * dx;

      if (showStrips) {
        const rx = toSvgX(xi);
        const rw = (dx / 4) * 380;
        const ry = toSvgY(topY);
        const rh = Math.abs(toSvgY(botY) - toSvgY(topY));

        stripsSvg.push(
          <rect
            key={i}
            x={rx}
            y={ry}
            width={rw}
            height={rh}
            fill="rgba(139, 92, 246, 0.25)"
            stroke="var(--accent-primary)"
            strokeWidth="1"
          />
        );
      }
    }
    approxAreaVal = sumArea;

    // Curve 2: y = x^2
    const pts2 = [];
    for (let x = -1.4; x <= 2.2; x += 0.05) {
      pts2.push(`${toSvgX(x)},${toSvgY(x * x)}`);
    }

    // Shaded filled polygon between curves from x = -1 to 2
    const fillPts = [];
    for (let x = -1; x <= 2; x += 0.05) {
      fillPts.push(`${toSvgX(x)},${toSvgY(x + 2)}`);
    }
    for (let x = 2; x >= -1; x -= 0.05) {
      fillPts.push(`${toSvgX(x)},${toSvgY(x * x)}`);
    }

    svgContent = (
      <svg width="100%" height="320" viewBox="0 0 500 320" style={{ overflow: 'visible' }}>
        {/* Grid lines & Axes */}
        <line x1="40" y1={toSvgY(0)} x2="460" y2={toSvgY(0)} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1={toSvgX(0)} y1="20" x2={toSvgX(0)} y2="290" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x="465" y={toSvgY(0) + 4} fill="var(--text-tertiary)" fontSize="12">x</text>
        <text x={toSvgX(0) - 4} y="15" fill="var(--text-tertiary)" fontSize="12">y</text>

        {/* Shaded Area */}
        <polygon points={fillPts.join(' ')} fill="rgba(6, 182, 212, 0.18)" />

        {/* Strips */}
        {stripsSvg}

        {/* Curve 1: y = x + 2 */}
        <line x1={toSvgX(-1.4)} y1={toSvgY(-1.4+2)} x2={toSvgX(2.2)} y2={toSvgY(2.2+2)} stroke="#06b6d4" strokeWidth="2.5" />
        <text x={toSvgX(1.2)} y={toSvgY(1.2 + 2) - 10} fill="#06b6d4" fontSize="13" fontWeight="600">y = x + 2 (Top)</text>

        {/* Curve 2: y = x^2 */}
        <path d={`M ${pts2.join(' L ')}`} fill="none" stroke="#ec4899" strokeWidth="2.5" />
        <text x={toSvgX(1.7)} y={toSvgY(1.7 * 1.7) + 20} fill="#ec4899" fontSize="13" fontWeight="600">y = x² (Bottom)</text>

        {/* Intersection Points */}
        <circle cx={toSvgX(-1)} cy={toSvgY(1)} r="5" fill="#f59e0b" />
        <text x={toSvgX(-1) - 50} y={toSvgY(1) + 18} fill="#f59e0b" fontSize="12" fontWeight="600">(-1, 1)</text>

        <circle cx={toSvgX(2)} cy={toSvgY(4)} r="5" fill="#f59e0b" />
        <text x={toSvgX(2) + 10} y={toSvgY(4) + 4} fill="#f59e0b" fontSize="12" fontWeight="600">(2, 4)</text>

        {/* Vertical boundary lines */}
        <line x1={toSvgX(-1)} y1={toSvgY(0)} x2={toSvgX(-1)} y2={toSvgY(1)} stroke="#f59e0b" strokeDasharray="3 3" />
        <line x1={toSvgX(2)} y1={toSvgY(0)} x2={toSvgX(2)} y2={toSvgY(4)} stroke="#f59e0b" strokeDasharray="3 3" />
      </svg>
    );

  } else if (preset === 'x-intersect') {
    desc = '求 y = sin(x) 與 y = cos(x) 在 x = 0 到 x = π 之間的包圍面積。在交點 x = π/4 處，上下相對位置對調！';

    // Domain x in [-0.2, pi + 0.2], y in [-1.3, 1.3]
    const toSvgX = (x) => 50 + ((x - (-0.2)) / (Math.PI + 0.4)) * 400;
    const toSvgY = (y) => 160 - (y / 1.4) * 120;

    const xStart = 0;
    const xEnd = Math.PI;
    const dx = (xEnd - xStart) / numStrips;

    // Exact area: int_0^{\pi/4} (cos x - sin x) dx + int_{\pi/4}^\pi (sin x - cos x) dx
    // = [sin x + cos x]_0^{\pi/4} + [-cos x - sin x]_{\pi/4}^\pi
    // = (\sqrt{2} - 1) + (1 - (-\sqrt{2})) = 2\sqrt{2} \approx 2.8284
    exactAreaVal = 2.8284;
    let sumArea = 0;
    const stripsSvg = [];

    for (let i = 0; i < numStrips; i++) {
      const xi = xStart + i * dx;
      const xMid = xi + dx / 2;
      const sinVal = Math.sin(xMid);
      const cosVal = Math.cos(xMid);
      const topY = Math.max(sinVal, cosVal);
      const botY = Math.min(sinVal, cosVal);
      const height = topY - botY;
      sumArea += height * dx;

      if (showStrips) {
        const rx = toSvgX(xi);
        const rw = (dx / (Math.PI + 0.4)) * 400;
        const ry = toSvgY(topY);
        const rh = Math.abs(toSvgY(botY) - toSvgY(topY));

        stripsSvg.push(
          <rect
            key={i}
            x={rx}
            y={ry}
            width={rw}
            height={rh}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="var(--accent-secondary)"
            strokeWidth="1"
          />
        );
      }
    }
    approxAreaVal = sumArea;

    // Curves
    const ptsSin = [];
    const ptsCos = [];
    for (let x = 0; x <= Math.PI; x += 0.04) {
      ptsSin.push(`${toSvgX(x)},${toSvgY(Math.sin(x))}`);
      ptsCos.push(`${toSvgX(x)},${toSvgY(Math.cos(x))}`);
    }

    // Shaded polygon
    const fillPts1 = []; // 0 to pi/4 (cos > sin)
    for (let x = 0; x <= Math.PI / 4; x += 0.03) {
      fillPts1.push(`${toSvgX(x)},${toSvgY(Math.cos(x))}`);
    }
    for (let x = Math.PI / 4; x >= 0; x -= 0.03) {
      fillPts1.push(`${toSvgX(x)},${toSvgY(Math.sin(x))}`);
    }

    const fillPts2 = []; // pi/4 to pi (sin > cos)
    for (let x = Math.PI / 4; x <= Math.PI; x += 0.03) {
      fillPts2.push(`${toSvgX(x)},${toSvgY(Math.sin(x))}`);
    }
    for (let x = Math.PI; x >= Math.PI / 4; x -= 0.03) {
      fillPts2.push(`${toSvgX(x)},${toSvgY(Math.cos(x))}`);
    }

    svgContent = (
      <svg width="100%" height="320" viewBox="0 0 500 320" style={{ overflow: 'visible' }}>
        {/* Axes */}
        <line x1="30" y1={toSvgY(0)} x2="470" y2={toSvgY(0)} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1={toSvgX(0)} y1="20" x2={toSvgX(0)} y2="290" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

        {/* Shaded Areas */}
        <polygon points={fillPts1.join(' ')} fill="rgba(245, 158, 11, 0.2)" />
        <polygon points={fillPts2.join(' ')} fill="rgba(6, 182, 212, 0.2)" />

        {/* Strips */}
        {stripsSvg}

        {/* Curves */}
        <path d={`M ${ptsSin.join(' L ')}`} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
        <text x={toSvgX(2.1)} y={toSvgY(Math.sin(2.1)) - 10} fill="#06b6d4" fontSize="13" fontWeight="600">y = sin(x)</text>

        <path d={`M ${ptsCos.join(' L ')}`} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <text x={toSvgX(0.2)} y={toSvgY(Math.cos(0.2)) + 22} fill="#f59e0b" fontSize="13" fontWeight="600">y = cos(x)</text>

        {/* Intersect point */}
        <circle cx={toSvgX(Math.PI / 4)} cy={toSvgY(Math.SQRT1_2)} r="5" fill="#ec4899" />
        <line x1={toSvgX(Math.PI / 4)} y1={toSvgY(0)} x2={toSvgX(Math.PI / 4)} y2={toSvgY(Math.SQRT1_2)} stroke="#ec4899" strokeDasharray="3 3" />
        <text x={toSvgX(Math.PI / 4) - 18} y={toSvgY(0) + 18} fill="#ec4899" fontSize="12" fontWeight="600">x = π/4</text>
        <text x={toSvgX(Math.PI) - 10} y={toSvgY(0) + 18} fill="var(--text-tertiary)" fontSize="12">x = π</text>
      </svg>
    );

  } else {
    desc = '求拋物線 x = 3 - y² (右側) 與直線 x = y + 1 (左側) 在交點 y = -2 與 y = 1 之間的包圍面積。使用橫向微元 dy 更加直觀與簡捷！';

    // Domain x in [-2, 4], y in [-2.5, 1.8]
    const toSvgX = (x) => 70 + ((x - (-2)) / 6) * 360;
    const toSvgY = (y) => 230 - ((y - (-2.5)) / 4.3) * 200;

    const yStart = -2;
    const yEnd = 1;
    const dy = (yEnd - yStart) / numStrips;

    // Exact area: int_{-2}^1 [(3 - y^2) - (y + 1)] dy = int_{-2}^1 (2 - y - y^2) dy = [2y - y^2/2 - y^3/3]_{-2}^1 = (2 - 1/2 - 1/3) - (-4 - 2 + 8/3) = 7/6 - (-10/3) = 27/6 = 4.5
    exactAreaVal = 4.5;
    let sumArea = 0;
    const stripsSvg = [];

    for (let i = 0; i < numStrips; i++) {
      const yi = yStart + i * dy;
      const yMid = yi + dy / 2;
      const rightX = 3 - yMid * yMid;
      const leftX = yMid + 1;
      const width = Math.max(0, rightX - leftX);
      sumArea += width * dy;

      if (showStrips) {
        const rx = toSvgX(leftX);
        const ry = toSvgY(yi + dy);
        const rw = (width / 6) * 360;
        const rh = Math.abs((dy / 4.3) * 200);

        stripsSvg.push(
          <rect
            key={i}
            x={rx}
            y={ry}
            width={rw}
            height={rh}
            fill="rgba(236, 72, 153, 0.25)"
            stroke="#ec4899"
            strokeWidth="1"
          />
        );
      }
    }
    approxAreaVal = sumArea;

    // Right curve: x = 3 - y^2
    const ptsRight = [];
    for (let y = -2.3; y <= 1.6; y += 0.05) {
      ptsRight.push(`${toSvgX(3 - y * y)},${toSvgY(y)}`);
    }

    // Filled polygon
    const fillPts = [];
    for (let y = -2; y <= 1; y += 0.05) {
      fillPts.push(`${toSvgX(3 - y * y)},${toSvgY(y)}`);
    }
    for (let y = 1; y >= -2; y -= 0.05) {
      fillPts.push(`${toSvgX(y + 1)},${toSvgY(y)}`);
    }

    svgContent = (
      <svg width="100%" height="320" viewBox="0 0 500 320" style={{ overflow: 'visible' }}>
        {/* Axes */}
        <line x1="30" y1={toSvgY(0)} x2="470" y2={toSvgY(0)} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1={toSvgX(0)} y1="20" x2={toSvgX(0)} y2="290" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x="475" y={toSvgY(0) + 4} fill="var(--text-tertiary)" fontSize="12">x</text>
        <text x={toSvgX(0) - 4} y="15" fill="var(--text-tertiary)" fontSize="12">y</text>

        {/* Shaded Area */}
        <polygon points={fillPts.join(' ')} fill="rgba(139, 92, 246, 0.2)" />

        {/* Strips */}
        {stripsSvg}

        {/* Curve Right: x = 3 - y^2 */}
        <path d={`M ${ptsRight.join(' L ')}`} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
        <text x={toSvgX(2.5)} y={toSvgY(0.4)} fill="#8b5cf6" fontSize="13" fontWeight="600">x = 3 - y² (Right)</text>

        {/* Line Left: x = y + 1 */}
        <line x1={toSvgX(-2.2 + 1)} y1={toSvgY(-2.2)} x2={toSvgX(1.5 + 1)} y2={toSvgY(1.5)} stroke="#06b6d4" strokeWidth="2.5" />
        <text x={toSvgX(-0.5)} y={toSvgY(-1.2)} fill="#06b6d4" fontSize="13" fontWeight="600">x = y + 1 (Left)</text>

        {/* Intersections */}
        <circle cx={toSvgX(-1)} cy={toSvgY(-2)} r="5" fill="#f59e0b" />
        <text x={toSvgX(-1) - 60} y={toSvgY(-2) + 5} fill="#f59e0b" fontSize="12" fontWeight="600">y = -2</text>

        <circle cx={toSvgX(2)} cy={toSvgY(1)} r="5" fill="#f59e0b" />
        <text x={toSvgX(2) + 10} y={toSvgY(1) - 5} fill="#f59e0b" fontSize="12" fontWeight="600">y = 1</text>
      </svg>
    );
  }

  return (
    <div style={{
      margin: '28px 0',
      padding: '24px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-secondary)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: '600' }}>
          📊 幾何與積分動態模擬器：兩曲線包圍面積與微元切割
        </h4>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
          {preset === 'y-basic' ? '橫向微元 dy 模式' : '縱向微元 dx 模式'}
        </span>
      </div>

      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
        {desc}
      </p>

      {/* Preset Selector Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setPreset('x-basic')}
          style={{
            padding: '8px 4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: preset === 'x-basic' ? 'var(--accent-primary)' : 'var(--bg-primary)',
            color: preset === 'x-basic' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: preset === 'x-basic' ? '600' : '400',
            cursor: 'pointer',
            transition: 'var(--transition)',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          對 x 積分 (dx)
        </button>

        <button
          onClick={() => setPreset('x-intersect')}
          style={{
            padding: '8px 4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: preset === 'x-intersect' ? 'var(--accent-primary)' : 'var(--bg-primary)',
            color: preset === 'x-intersect' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: preset === 'x-intersect' ? '600' : '400',
            cursor: 'pointer',
            transition: 'var(--transition)',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          兩函數交錯
        </button>

        <button
          onClick={() => setPreset('y-basic')}
          style={{
            padding: '8px 4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: preset === 'y-basic' ? 'var(--accent-primary)' : 'var(--bg-primary)',
            color: preset === 'y-basic' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: preset === 'y-basic' ? '600' : '400',
            cursor: 'pointer',
            transition: 'var(--transition)',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          對 y 積分 (dy)
        </button>
      </div>

      {/* Control Panel: Slider & Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px 14px',
        backgroundColor: 'var(--bg-primary)',
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 140px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            分割段數 <strong>n = {numStrips}</strong>
          </span>
          <input
            type="range"
            min="4"
            max="40"
            step="1"
            value={numStrips}
            onChange={(e) => setNumStrips(parseInt(e.target.value))}
            style={{ flex: 1, minWidth: '50px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={showStrips}
            onChange={(e) => setShowStrips(e.target.checked)}
            style={{ accentColor: 'var(--accent-primary)' }}
          />
          顯示微元矩形 {preset === 'y-basic' ? '(dy)' : '(dx)'}
        </label>
      </div>

      {/* SVG Container */}
      <div style={{
        backgroundColor: '#0c0f17',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {svgContent}
      </div>

      {/* Numerical Comparison Result */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '20px',
        padding: '14px 18px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>黎曼和微元加總逼近 (Approx Area)</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--accent-secondary)', fontWeight: '700', marginTop: '2px' }}>
            {approxAreaVal.toFixed(4)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>理論精確定積分值 (Exact Analytical Area)</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '2px' }}>
            {exactAreaVal.toFixed(4)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>絕對誤差 (Absolute Error)</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--accent-warm)', fontWeight: '700', marginTop: '2px' }}>
            {Math.abs(approxAreaVal - exactAreaVal).toFixed(5)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Calculus_7_1() {
  return (
    <div>
      {/* 頁面標題與簡介 */}
      <h2 style={{
        borderLeft: '4px solid var(--accent-primary)',
        paddingLeft: '12px',
        margin: '24px 0 16px 0',
        fontSize: '1.6rem',
        color: 'var(--text-primary)',
        fontWeight: '600'
      }}>
        7.1 兩曲線間的面積 (Area Between Curves)
      </h2>

      <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        在第五章中，我們學習了定積分的經典幾何意義：當 <MathInline math="f(x) \ge 0" /> 時，定積分 <MathInline math="\int_a^b f(x) \, dx" /> 代表函數曲線 <MathInline math="y = f(x)" /> 與 <MathInline math="x" /> 軸之間包圍的區域面積。
        然而在實際數學應用與幾何問題中，我們經常需要計算由<strong>兩條或多條函數曲線所共同圍成的封閉區域面積</strong>。
        本節將推導兩曲線間面積的通用積分公式，並探討如何選擇適當的積分變數（對 <MathInline math="x" /> 積分或對 <MathInline math="y" /> 積分），以最簡捷有效的方式求解幾何面積。
      </p>

      {/* 動態互動視覺化組件 */}
      <AreaBetweenCurvesVisualizer />

      {/* 一、直觀引入與黎曼和推導 */}
      <h3 style={{ margin: '36px 0 16px 0', color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        一、幾何直觀與黎曼和推導 (Intuition & Riemann Sum)
      </h3>

      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
        考慮平面上兩條連續函數曲線 <MathInline math="y = f(x)" /> 與 <MathInline math="y = g(x)" />。假設在區間 <MathInline math="[a, b]" /> 上，曲線 <MathInline math="f(x)" /> 始終位在 <MathInline math="g(x)" /> 的上方（即 <MathInline math="f(x) \ge g(x)" />）。
        我們想求解這兩條曲線以及兩條垂直線 <MathInline math="x = a" /> 與 <MathInline math="x = b" /> 所圍成的區域 <MathInline math="S" /> 的面積 <MathInline math="A" />。
      </p>

      <div style={{
        padding: '18px 20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        borderLeft: '4px solid var(--accent-secondary)',
        margin: '20px 0',
        color: 'var(--text-secondary)',
        lineHeight: '1.8'
      }}>
        <strong>💡 黎曼切片分割 (Slice Method)：</strong>
        <br />
        1. 將區間 <MathInline math="[a, b]" /> 等分為 <MathInline math="n" /> 個子區間，每個子區間寬度為 <MathInline math="\Delta x = \frac{b-a}{n}" />。
        <br />
        2. 在第 <MathInline math="i" /> 個子區間內任取一點 <MathInline math="x_i^*" />，建構一個縱向代表矩形 (Representative Strip)。
        <br />
        3. 該矩形的<strong>寬為 <MathInline math="\Delta x" /></strong>，<strong>高為 <MathInline math="f(x_i^*) - g(x_i^*)" /></strong>，因此其微元面積為 <MathInline math="\Delta A_i = [f(x_i^*) - g(x_i^*)] \Delta x" />。
        <br />
        4. 將所有矩形面積加總並取極限 <MathInline math="n \to \infty" />：
        <MathBlock math="A = \lim_{n \to \infty} \sum_{i=1}^n \left[ f(x_i^*) - g(x_i^*) \right] \Delta x = \int_a^b \left[ f(x) - g(x) \right] dx" />
      </div>

      {/* 定理 7.1.1 */}
      <Theorem title="7.1.1 對 x 積分之兩曲線間面積 (Area Between Curves with Respect to x)">
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '12px' }}>
          設函數 <MathInline math="f" /> 與 <MathInline math="g" /> 在閉區間 <MathInline math="[a, b]" /> 上連續，且對所有 <MathInline math="x \in [a, b]" />，皆滿足 <MathInline math="f(x) \ge g(x)" />。
          則由 <MathInline math="y = f(x)" />（上曲線 Top）、<MathInline math="y = g(x)" />（下曲線 Bottom）、<MathInline math="x = a" /> 與 <MathInline math="x = b" /> 所圍成的區域面積 <MathInline math="A" /> 為：
        </p>
        <MathBlock math="A = \int_a^b \left[ f(x) - g(x) \right] dx = \int_a^b \left[ \text{Top}(x) - \text{Bottom}(x) \right] dx" />
      </Theorem>

      <Definition title="絕對值通用形式與交錯曲線 (Intersecting Curves)">
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '12px' }}>
          若在區間 <MathInline math="[a, b]" /> 上，曲線 <MathInline math="y = f(x)" /> 與 <MathInline math="y = g(x)" /> 發生相交，導致兩者的上下相對位置發生改變，則區域面積的通用定義為被積函數絕對值的定積分：
        </p>
        <MathBlock math="A = \int_a^b |f(x) - g(x)| \, dx" />
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <strong>實際計算心法：</strong> 我們必須先解方程 <MathInline math="f(x) = g(x)" /> 求出所有交點 <MathInline math="c_1, c_2, \dots" />，將積分區間拆分成多個子區間。在每個子區間內分別判斷何者為上曲線、何者為下曲線，去絕對值後分別積分再相加。
        </p>
      </Definition>


      {/* 二、對 y 積分 (Right minus Left) */}
      <h3 style={{ margin: '36px 0 16px 0', color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        二、對 y 積分：橫向切割法 (Integration with Respect to y)
      </h3>

      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
        在某些幾何圖形中，邊界曲線如果以 <MathInline math="y" /> 為自變數表示（例如 <MathInline math="x = f(y)" /> 與 <MathInline math="x = g(y)" />），或者若對 <MathInline math="x" /> 積分會需要拆分成許多繁瑣的子區間時，改採<strong>橫向切片 (Horizontal Strips) 對 <MathInline math="y" /> 積分</strong>會大幅簡化計算過程。
      </p>

      {/* 定理 7.1.2 */}
      <Theorem title="7.1.2 對 y 積分之兩曲線間面積 (Area Between Curves with Respect to y)">
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '12px' }}>
          設函數 <MathInline math="f(y)" /> 與 <MathInline math="g(y)" /> 在閉區間 <MathInline math="[c, d]" /> 上連續，且對所有 <MathInline math="y \in [c, d]" />，皆滿足 <MathInline math="f(y) \ge g(y)" />（即 <MathInline math="f(y)" /> 位在右側 Right，<MathInline math="g(y)" /> 位在左側 Left）。
          則由 <MathInline math="x = f(y)" strokeWidth="1.5" />、<MathInline math="x = g(y)" />、<MathInline math="y = c" /> 與 <MathInline math="y = d" /> 所圍成的區域面積 <MathInline math="A" /> 為：
        </p>
        <MathBlock math="A = \int_c^d \left[ f(y) - g(y) \right] dy = \int_c^d \left[ \text{Right}(y) - \text{Left}(y) \right] dy" />
      </Theorem>

      <div style={{
        margin: '24px 0',
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <h4 style={{ color: 'var(--accent-warm)', margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: '600' }}>
          ⚡ 觀念對比：對 x 積分 vs 對 y 積分的抉擇指南
        </h4>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '12px 0 0 0' }}>
          <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', width: '120px' }}>比較維度</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>對 x 積分 (Vertical Strips)</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>對 y 積分 (Horizontal Strips)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>微元矩形方向</td>
                <td style={{ padding: '10px 12px' }}>縱向垂直矩形 (寬為 <MathInline math="dx" />)</td>
                <td style={{ padding: '10px 12px' }}>橫向水平矩形 (高為 <MathInline math="dy" />)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>被積函數長度</td>
                <td style={{ padding: '10px 12px' }}><MathInline math="\text{Height} = y_{\text{top}} - y_{\text{bottom}}" /></td>
                <td style={{ padding: '10px 12px' }}><MathInline math="\text{Width} = x_{\text{right}} - x_{\text{left}}" /></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>積分上下限來源</td>
                <td style={{ padding: '10px 12px' }}>區域最左與最右的 <MathInline math="x" /> 座標 (<MathInline math="x=a" /> 到 <MathInline math="x=b" />)</td>
                <td style={{ padding: '10px 12px' }}>區域最下與最上的 <MathInline math="y" /> 座標 (<MathInline math="y=c" /> 到 <MathInline math="y=d" />)</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>最佳適用時機</td>
                <td style={{ padding: '10px 12px' }}>函數可輕易表示為 <MathInline math="y = f(x)" />，且頂部與底部邊界各由單一函數構成。</td>
                <td style={{ padding: '10px 12px' }}>函數包含 <MathInline math="x = y^2" />、<MathInline math="x = g(y)" />，或者右側與左側邊界由單一函數構成。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/* 三、解題五部曲標準流程 */}
      <h3 style={{ margin: '36px 0 16px 0', color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        三、解題 S.O.P. 五部曲 (Standard Operating Procedure)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', margin: '20px 0 32px 0' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '1rem', marginBottom: '6px' }}>Step 1. 劃出圖形草圖</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            手繪或心算兩函數曲線在平面上的大致走勢，確認封閉區域的形狀。
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '1rem', marginBottom: '6px' }}>Step 2. 求解交點座標</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            令 <MathInline math="f(x) = g(x)" /> 或 <MathInline math="f(y) = g(y)" /> 解方程，確定區域邊界與積分上下限。
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '1rem', marginBottom: '6px' }}>Step 3. 選定積分變數</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            判斷要採用縱向矩形 (對 <MathInline math="x" /> 積分) 還是橫向矩形 (對 <MathInline math="y" /> 積分)，以減少分段數。
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '1rem', marginBottom: '6px' }}>Step 4. 列出定積分式</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            明確寫出 <MathInline math="\int (\text{Top} - \text{Bottom}) dx" /> 或 <MathInline math="\int (\text{Right} - \text{Left}) dy" />。
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '1rem', marginBottom: '6px' }}>Step 5. 計算並檢驗</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            運用微積分基本定理求值。<strong>注意：面積必定大於等於 0！</strong> 若算出負值必有錯誤。
          </div>
        </div>
      </div>


      {/* 四、講義經典例題詳解 */}
      <h3 style={{ margin: '40px 0 20px 0', color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        📚 經典例題詳解 (Selected Examples)
      </h3>

      {/* 例題 1 */}
      <Example title="1：給定邊界區間之基本型求面積">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          試求由抛物線 <MathInline math="y = x^2 + 1" />、直線 <MathInline math="y = x" strokeWidth="1" />，以及兩垂直線 <MathInline math="x = 0" /> 與 <MathInline math="x = 2" /> 所包圍的平面區域面積。
        </p>
        <Solution>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p><strong>Step 1 & 2：判斷上下位置關係與區間</strong></p>
            <p>在區間 <MathInline math="[0, 2]" /> 上，我們比較兩函數值，對任意 <MathInline math="x \in [0, 2]" />：</p>
            <MathBlock math="x^2 + 1 - x = \left(x - \frac{1}{2}\right)^2 + \frac{3}{4} > 0" />
            <p>
              因此，<MathInline math="y = x^2 + 1" /> 恆位在 <MathInline math="y = x" /> 的上方（即 <MathInline math="\text{Top} = x^2 + 1" />，<MathInline math="\text{Bottom} = x" />）。
            </p>
            <p><strong>Step 3 & 4：列出定積分式</strong></p>
            <MathBlock math="A = \int_0^2 \left[ (x^2 + 1) - x \right] dx = \int_0^2 (x^2 - x + 1) \, dx" />
            <p><strong>Step 5：計算定積分</strong></p>
            <MathBlock math="
              A = \left[ \frac{x^3}{3} - \frac{x^2}{2} + x \right]_0^2 
              = \left( \frac{8}{3} - \frac{4}{2} + 2 \right) - (0) 
              = \frac{8}{3} - 2 + 2 = \frac{8}{3}
            " />
            <p style={{ color: 'var(--accent-primary)', fontWeight: '600', marginTop: '10px' }}>
              答：包圍區域面積為 <MathInline math="\frac{8}{3}" /> 平方單位。
            </p>
          </div>
        </Solution>
      </Example>

      {/* 例題 2 */}
      <Example title="2：未定邊界（需自行求解交點）之區域面積">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          試求由抛物線 <MathInline math="y = 2 - x^2" /> 與直線 <MathInline math="y = -x" /> 所包圍的封閉區域面積。
        </p>
        <Solution>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p><strong>Step 1：求解交點座標（確定積分上下限）</strong></p>
            <p>聯立兩函數方程：</p>
            <MathBlock math="2 - x^2 = -x \implies x^2 - x - 2 = 0 \implies (x - 2)(x + 1) = 0" />
            <p>解得交點的 <MathInline math="x" /> 座標為 <MathInline math="x = -1" /> 與 <MathInline math="x = 2" />。</p>
            <p><strong>Step 2：判斷區間內的上下位置</strong></p>
            <p>
              在區間 <MathInline math="[-1, 2]" /> 內取測試點 <MathInline math="x = 0" />：
              <MathInline math="y_{\text{parabola}} = 2 - 0 = 2" />，<MathInline math="y_{\text{line}} = 0" />。
              故在 <MathInline math="[-1, 2]" /> 區間內，抛物線位在上方（<MathInline math="\text{Top} = 2 - x^2" />），直線位在下方（<MathInline math="\text{Bottom} = -x" />）。
            </p>
            <p><strong>Step 3：列式並計算定積分</strong></p>
            <MathBlock math="
              A = \int_{-1}^2 \left[ (2 - x^2) - (-x) \right] dx = \int_{-1}^2 (2 + x - x^2) \, dx
            " />
            <MathBlock math="
              A = \left[ 2x + \frac{x^2}{2} - \frac{x^3}{3} \right]_{-1}^2
            " />
            <p>將上限 <MathInline math="x = 2" /> 帶入：</p>
            <MathBlock math="2(2) + \frac{4}{2} - \frac{8}{3} = 4 + 2 - \frac{8}{3} = \frac{10}{3}" />
            <p>將下限 <MathInline math="x = -1" /> 帶入：</p>
            <MathBlock math="2(-1) + \frac{1}{2} - \frac{-1}{3} = -2 + \frac{1}{2} + \frac{1}{3} = -\frac{7}{6}" />
            <p>兩者相減得到：</p>
            <MathBlock math="A = \frac{10}{3} - \left( -\frac{7}{6} \right) = \frac{20}{6} + \frac{7}{6} = \frac{27}{6} = \frac{9}{2}" />
            <p style={{ color: 'var(--accent-primary)', fontWeight: '600', marginTop: '10px' }}>
              答：封閉區域面積為 <MathInline math="\frac{9}{2}" />（或 <MathInline math="4.5" />）。
            </p>
          </div>
        </Solution>
      </Example>

      {/* 例題 3 */}
      <Example title="3：兩函數曲線交錯（分段絕對值積分）">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          試求由正弦函數 <MathInline math="y = \sin x" /> 與餘弦函數 <MathInline math="y = \cos x" /> 在 <MathInline math="x = 0" /> 到 <MathInline math="x = \frac{\pi}{2}" /> 之間所包圍的區域面積。
        </p>
        <Solution>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p><strong>Step 1：尋找區間內部的交點</strong></p>
            <p>在 <MathInline math="[0, \pi/2]" /> 上解交點方程：</p>
            <MathBlock math="\sin x = \cos x \implies \tan x = 1 \implies x = \frac{\pi}{4}" />
            <p><strong>Step 2：分段判斷上下曲線</strong></p>
            <ul>
              <li>在第一階段 <MathInline math="[0, \pi/4]" />：<MathInline math="\cos x \ge \sin x" />，故 <MathInline math="\text{Top} = \cos x" />，<MathInline math="\text{Bottom} = \sin x" />。</li>
              <li>在第二階段 <MathInline math="[\pi/4, \pi/2]" />：<MathInline math="\sin x \ge \cos x" />，故 <MathInline math="\text{Top} = \sin x" />，<MathInline math="\text{Bottom} = \cos x" />。</li>
            </ul>
            <p><strong>Step 3：列出拆分後的定積分</strong></p>
            <MathBlock math="
              A = \int_0^{\pi/4} (\cos x - \sin x) \, dx + \int_{\pi/4}^{\pi/2} (\sin x - \cos x) \, dx
            " />
            <p><strong>Step 4：分別計算各區間定積分</strong></p>
            <MathBlock math="
              \int_0^{\pi/4} (\cos x - \sin x) \, dx = [\sin x + \cos x]_0^{\pi/4} = \left(\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}\right) - (0 + 1) = \sqrt{2} - 1
            " />
            <MathBlock math="
              \int_{\pi/4}^{\pi/2} (\sin x - \cos x) \, dx = [-\cos x - \sin x]_{\pi/4}^{\pi/2} = (0 - 1) - \left(-\frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2}\right) = \sqrt{2} - 1
            " />
            <p>兩區間面積相加：</p>
            <MathBlock math="A = (\sqrt{2} - 1) + (\sqrt{2} - 1) = 2\sqrt{2} - 2 = 2(\sqrt{2} - 1)" />
            <p style={{ color: 'var(--accent-primary)', fontWeight: '600', marginTop: '10px' }}>
              答：區域面積為 <MathInline math="2\sqrt{2} - 2 \approx 0.8284" />。
            </p>
          </div>
        </Solution>
      </Example>

      {/* 例題 4 */}
      <Example title="4：對 y 積分（橫向切割 Right - Left 簡化題）">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          試求由抛物線 <MathInline math="x = 3 - y^2" /> 與直線 <MathInline math="x = y + 1" /> 所包圍的平面區域面積。
        </p>
        <Solution>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p><strong>觀念點撥：為什麼選對 y 積分？</strong></p>
            <p>若對 <MathInline math="x" /> 積分，拋物線需改寫為：</p>
            <MathBlock math="x = 3 - y^2 \implies y = \pm\sqrt{3-x}" />
            <p>
              此時上下各有分支，且直線在某些區間為左邊界、在某些區間又與拋物線交錯，需要拆分成多個複雜積分。
              <br />
              反之，若橫向對 <MathInline math="y" /> 積分，右邊界始終為抛物線 <MathInline math="x_{\text{right}} = 3 - y^2" />，左邊界始終為直線 <MathInline math="x_{\text{left}} = y + 1" />！
            </p>
            <p><strong>Step 1：解交點求 y 的積分上下限</strong></p>
            <MathBlock math="3 - y^2 = y + 1 \implies y^2 + y - 2 = 0 \implies (y + 2)(y - 1) = 0" />
            <p>解得 <MathInline math="y = -2" /> 與 <MathInline math="y = 1" />，即積分下限 <MathInline math="c = -2" />，上限 <MathInline math="d = 1" />。</p>
            <p><strong>Step 2：列式並進行積分</strong></p>
            <MathBlock math="
              A = \int_{-2}^1 \left[ (3 - y^2) - (y + 1) \right] dy = \int_{-2}^1 (2 - y - y^2) \, dy
            " />
            <MathBlock math="
              A = \left[ 2y - \frac{y^2}{2} - \frac{y^3}{3} \right]_{-2}^1
            " />
            <p>帶入上限 <MathInline math="y = 1" />：</p>
            <MathBlock math="2(1) - \frac{1}{2} - \frac{1}{3} = \frac{7}{6}" />
            <p>帶入下限 <MathInline math="y = -2" />：</p>
            <MathBlock math="2(-2) - \frac{4}{2} - \frac{-8}{3} = -4 - 2 + \frac{8}{3} = -\frac{10}{3}" />
            <MathBlock math="A = \frac{7}{6} - \left(-\frac{10}{3}\right) = \frac{7}{6} + \frac{20}{6} = \frac{27}{6} = \frac{9}{2}" />
            <p style={{ color: 'var(--accent-primary)', fontWeight: '600', marginTop: '10px' }}>
              答：區域面積為 <MathInline math="\frac{9}{2}" />（或 <MathInline math="4.5" />）。
            </p>
          </div>
        </Solution>
      </Example>

      {/* 例題 5 */}
      <Example title="5：多邊界與兩種積分方法對比">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          試求由曲線 <MathInline math="y = \sqrt{x}" />、直線 <MathInline math="y = x - 2" /> 以及 <MathInline math="x" /> 軸 (<MathInline math="y = 0" />) 所包圍的區域面積。
        </p>
        <Solution>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p><strong>方法一：對 x 積分（需要拆成兩個子區間）</strong></p>
            <p>1. 求解交點方程：</p>
            <MathBlock math="\sqrt{x} = x - 2 \implies x^2 - 5x + 4 = 0" />
            <p>
              解得 <MathInline math="x = 4" />（<MathInline math="x=1" /> 為增根捨去）。此時 <MathInline math="y = 2" />。
              <br />
              2. 直線 <MathInline math="y = x - 2" /> 與 <MathInline math="x" /> 軸交於 <MathInline math="x = 2" />。
              <br />
              3. 在 <MathInline math="[0, 2]" /> 區間，下邊界為 <MathInline math="y = 0" />；在 <MathInline math="[2, 4]" /> 區間，下邊界變為 <MathInline math="y = x - 2" />。
              因此需拆成兩段積分：
            </p>
            <MathBlock math="A = \int_0^2 \sqrt{x} \, dx + \int_2^4 \left[ \sqrt{x} - (x - 2) \right] dx" />
            
            <p>第一段積分：</p>
            <MathBlock math="\int_0^2 x^{1/2} \, dx = \left[ \frac{2}{3} x^{3/2} \right]_0^2 = \frac{4\sqrt{2}}{3}" />
            
            <p>第二段積分：</p>
            <MathBlock math="\int_2^4 (x^{1/2} - x + 2) \, dx = \left[ \frac{2}{3} x^{3/2} - \frac{x^2}{2} + 2x \right]_2^4" />
            <MathBlock math="= \frac{16}{3} - \left( \frac{4\sqrt{2}}{3} + 2 \right) = \frac{10}{3} - \frac{4\sqrt{2}}{3}" />
            
            <p>兩段相加求總面積：</p>
            <MathBlock math="A = \frac{4\sqrt{2}}{3} + \left( \frac{10}{3} - \frac{4\sqrt{2}}{3} \right) = \frac{10}{3}" />

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

            <p><strong>方法二：對 y 積分（只需單一定積分！極推薦）</strong></p>
            <p>
              將曲線改寫為以 <MathInline math="y" /> 表示的函數：
              <br />
              右邊界曲線為直線：<MathInline math="x_{\text{right}} = y + 2" />。
              <br />
              左邊界曲線為拋物線：<MathInline math="y = \sqrt{x} \implies x_{\text{left}} = y^2" />。
              <br />
              區域在 <MathInline math="y" /> 軸上的範圍由 <MathInline math="y = 0" /> 到兩曲線交點 <MathInline math="y = 2" />。
            </p>
            <MathBlock math="A = \int_0^2 \left[ (y + 2) - y^2 \right] dy" />
            <MathBlock math="= \left[ \frac{y^2}{2} + 2y - \frac{y^3}{3} \right]_0^2 = 2 + 4 - \frac{8}{3} = \frac{10}{3}" />
            <p style={{ color: 'var(--accent-primary)', fontWeight: '600', marginTop: '10px' }}>
              結論：對比兩種方法，對 <MathInline math="y" /> 積分無需分段，過程簡潔流暢得多！答為 <MathInline math="\frac{10}{3}" />。
            </p>
          </div>
        </Solution>
      </Example>


      {/* 五、課後練習題 */}
      <h3 style={{ margin: '40px 0 20px 0', color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        ✏️ 課後練習題 (Exercises)
      </h3>

      <Exercises>
        {/* 練習 1 */}
        <ExerciseItem>
          <div>
            <strong>1. (基本計算)</strong> 試求由曲線 <MathInline math="y = x^2" /> 與直線 <MathInline math="y = 4x" /> 所包圍的區域面積。
          </div>
          <Solution>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <p>解交點方程：</p>
              <MathBlock math="x^2 = 4x \implies x(x-4) = 0" />
              <p>解得 <MathInline math="x = 0" /> 或 <MathInline math="x = 4" />。</p>
              <p>在 <MathInline math="[0, 4]" /> 上，<MathInline math="4x \ge x^2" />，故：</p>
              <MathBlock math="
                A = \int_0^4 (4x - x^2) \, dx = \left[ 2x^2 - \frac{x^3}{3} \right]_0^4 = 32 - \frac{64}{3} = \frac{32}{3}
              " />
              <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>答：<MathInline math="\frac{32}{3}" /></p>
            </div>
          </Solution>
        </ExerciseItem>

        {/* 練習 2 */}
        <ExerciseItem>
          <div>
            <strong>2. (對 y 積分)</strong> 試求由拋物線 <MathInline math="x = y^2 - 2" /> 與直線 <MathInline math="x = y" /> 所包圍的區域面積。
          </div>
          <Solution>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <p>解交點方程：</p>
              <MathBlock math="y^2 - 2 = y \implies (y-2)(y+1) = 0" />
              <p>解得 <MathInline math="y = -1" /> 與 <MathInline math="y = 2" />。</p>
              <p>在 <MathInline math="[-1, 2]" /> 區間，右側為 <MathInline math="x = y" />，左側為 <MathInline math="x = y^2 - 2" />：</p>
              <MathBlock math="
                A = \int_{-1}^2 \left[ y - (y^2 - 2) \right] dy = \int_{-1}^2 (2 + y - y^2) \, dy = \left[ 2y + \frac{y^2}{2} - \frac{y^3}{3} \right]_{-1}^2 = \frac{9}{2}
              " />
              <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>答：<MathInline math="\frac{9}{2}" />（或 <MathInline math="4.5" />）</p>
            </div>
          </Solution>
        </ExerciseItem>

        {/* 練習 3 */}
        <ExerciseItem>
          <div>
            <strong>3. (三次多項式交錯區域)</strong> 試求由曲線 <MathInline math="y = x^3" /> 與直線 <MathInline math="y = x" /> 所包圍的所有對稱區域總面積。
          </div>
          <Solution>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <p>解交點方程：</p>
              <MathBlock math="x^3 = x \implies x(x-1)(x+1) = 0" />
              <p>解得交點 <MathInline math="x = -1, 0, 1" />。</p>
              <p>區域包含兩對稱部分：</p>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>在 <MathInline math="[-1, 0]" /> 區間：<MathInline math="x^3 \ge x" />，面積為 <MathInline math="\int_{-1}^0 (x^3 - x) \, dx = \frac{1}{4}" />。</li>
                <li>在 <MathInline math="[0, 1]" /> 區間：<MathInline math="x \ge x^3" />，面積同樣為 <MathInline math="\int_0^1 (x - x^3) \, dx = \frac{1}{4}" />。</li>
              </ul>
              <MathBlock math="A = \frac{1}{4} + \frac{1}{4} = \frac{1}{2}" />
              <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>答：<MathInline math="\frac{1}{2}" /></p>
            </div>
          </Solution>
        </ExerciseItem>

        {/* 練習 4 */}
        <ExerciseItem>
          <div>
            <strong>4. (綜合應用題)</strong> 試求由曲線 <MathInline math="y = e^x" />、<MathInline math="y = e^{-x}" /> 以及直線 <MathInline math="x = 1" /> 所包圍的區域面積。
          </div>
          <Solution>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <p>求解兩指數曲線交點：</p>
              <MathBlock math="e^x = e^{-x} \implies e^{2x} = 1 \implies x = 0" />
              <p>此時 <MathInline math="y = 1" />。在 <MathInline math="[0, 1]" /> 上，<MathInline math="e^x \ge e^{-x}" />：</p>
              <MathBlock math="
                A = \int_0^1 (e^x - e^{-x}) \, dx = \left[ e^x + e^{-x} \right]_0^1 = (e + e^{-1}) - (1 + 1) = e + \frac{1}{e} - 2
              " />
              <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>答：<MathInline math="e + e^{-1} - 2" />（約等於 <MathInline math="1.086" />）</p>
            </div>
          </Solution>
        </ExerciseItem>
      </Exercises>
    </div>
  );
}
