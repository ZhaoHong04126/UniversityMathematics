import { Definition } from '../../../../components/MathBlocks';

export default function Calculus_Ch1_Overview({ setActiveTopicId }) {
  const subtopics = [
    { id: '1-1-1', title: '1.1 何謂函數？', desc: '建立函數的現代定義，認識定義域、值域的概念，以及檢驗函數對稱性的奇偶性與單調遞增/遞減的數學定義。' },
    { id: '1-1-2', title: '1.2 冪函數與多項式函數', desc: '研究微積分中最基礎的代數函數。分析冪函數在不同指數下的圖形特徵，以及多項式函數的次數與首項係數性質。' },
    { id: '1-1-3', title: '1.3 反函數', desc: '探討如何對函數進行「逆向操作」，學習一對一函數的定義與水平線檢驗法，以及函數與反函數之間的幾何對稱性。' },
    { id: '1-1-4', title: '1.4 三角函數與反三角函數', desc: '複習六個基本週期三角函數的定義域與值域，並探討如何限制自變數區間以構造反正弦、反餘弦與反正切等反函數。' },
    { id: '1-1-5', title: '1.5 指數函數與對數函數', desc: '研究以 Euler 常數 e 為底的自然指數與對數函數，掌握其特有的運算律與在微積分中描述增長模型的優勢。' },
    { id: '1-1-6', title: '1.6 雙曲函數與反雙曲函數', desc: '介紹由指數函數組合而成的雙曲函數（如 sinh, cosh），及其在懸鏈線物理模型與微積分雙曲代換中的應用。' }
  ];

  return (
    <div>
      {/* 標題與導讀 */}
      <h2 style={{ 
        borderLeft: '4px solid var(--accent-primary)', 
        paddingLeft: '12px', 
        margin: '24px 0 16px 0', 
        fontSize: '1.6rem',
        color: 'var(--text-primary)',
        fontWeight: '600'
      }}>
        本章導讀與學習指引 (Chapter Guide)
      </h2>
      <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        歡迎來到微積分的第一站！<strong>函數 (Functions)</strong> 是微積分的起點，也是整個分析數學的共同語言。微積分的核心任務是研究「變化率（導數）」與「累積量（積分）」，而這兩者都是施加在函數上的運算。因此，在進入極限與微積分定理之前，我們必須對各類基礎函數的定義、圖形與代數性質瞭如指掌。
      </p>

      {/* 學習目標卡片 */}
      <Definition title="第一章 學習目標 (Learning Objectives)">
        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <strong>掌握函數基礎：</strong> 深入理解函數的定義，並能精確判斷任意關係式的定義域 (Domain) 與值域 (Range)。
          </li>
          <li>
            <strong>熟悉初等函數族：</strong> 掌握冪函數、多項式函數、三角函數、指數與對數函數的代數特徵與幾何形狀。
          </li>
          <li>
            <strong>理解逆運算關係：</strong> 掌握一對一函數的檢驗（水平線檢驗），並學習如何求解與限制定義域來構造反函數。
          </li>
          <li>
            <strong>分析函數行為特徵：</strong> 熟練運用數學式判斷函數的對稱性（奇偶性）與增減規律（單調性），為後續微分分析打下基礎。
          </li>
        </ul>
      </Definition>

      {/* 單元導覽列表 */}
      <h3 style={{ margin: '32px 0 16px 0', color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: '600' }}>
        本章單元目錄索引 (Syllabus)
      </h3>
      <p style={{ color: 'var(--text-tertiary)', marginBottom: '20px', fontSize: '0.95rem' }}>
        點擊下方單元卡片即可快速跳轉至該節詳細內容：
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '20px 0 40px 0' }}>
        {subtopics.map(topic => (
          <div 
            key={topic.id}
            onClick={() => setActiveTopicId(topic.id)}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.05rem', fontWeight: '600', margin: 0 }}>
              {topic.title}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              {topic.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
