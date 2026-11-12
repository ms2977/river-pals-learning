export type Pal = "basilisk" | "zombie" | "croc";
export const PALS = [
  { id: "basilisk" as Pal, name: "波波", species: "耶穌蜥蜴", tag: "水上飛毛腿", line: "跟著我，一小步一小步向前！", color: "green" },
  { id: "zombie" as Pal, name: "蹦蹦", species: "友善小殭屍", tag: "溫柔的好朋友", line: "慢慢想，我會一直陪著你。", color: "purple" },
  { id: "croc" as Pal, name: "咔咔", species: "愛笑的鱷魚", tag: "好奇心大嘴巴", line: "張大嘴巴，跟我一起念念看！", color: "peach" },
];
export function Character({ kind, happy = false }: { kind: Pal; happy?: boolean }) {
  const ink = "#334b3e";
  return <svg viewBox="0 0 240 200" className={`character ${happy ? "happy" : ""}`} role="img" aria-label={PALS.find(p => p.id === kind)?.species}>
    <ellipse cx="120" cy="183" rx="65" ry="9" fill="#263f3110" />
    {kind === "basilisk" && <g stroke={ink} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M87 147C49 171 24 150 20 125C44 147 55 130 75 123" fill="#7fa06a" />
      <path d="M124 45L126 11L145 31L152 16L164 51" fill="#e7ac54" />
      <path d="M79 116L66 98L85 100L79 79L103 89L102 64L124 82" fill="#e7ac54" />
      <path d="M93 106C75 118 72 146 88 163L77 179L102 179L112 160L139 160L147 178L171 178L153 157C166 133 149 107 145 100" fill="#8eaf73" />
      <ellipse cx="123" cy="138" rx="23" ry="28" fill="#d9df9d" stroke="none" />
      <path d="M106 113C80 119 77 136 66 136M145 117C159 127 165 120 174 115" fill="none" />
      <path d="M100 72C100 45 118 35 142 42C162 44 168 62 173 67C195 67 205 75 201 87C198 103 171 108 150 104L123 110C102 105 96 93 100 72Z" fill="#9ebd7b" />
      <ellipse cx="145" cy="64" rx="12" ry="15" fill="#fffdf3" /><ellipse cx="149" cy="65" rx="4" ry="6" fill={ink} stroke="none" />
      <circle cx="187" cy="77" r="2" fill={ink} stroke="none" /><path d="M159 89Q179 96 191 88" fill="none" />
      <ellipse cx="136" cy="88" rx="9" ry="5" fill="#e0a18b" stroke="none" />
      <path d="M104 109L134 108L128 124L112 116L103 123Z" fill="#e78152" />
      <path d="M29 191L48 189M49 176L58 178M185 180L205 181" stroke="#8dbfc1" strokeWidth="3" />
    </g>}
    {kind === "zombie" && <g stroke="#514464" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M84 149L78 178L103 179L108 153M137 153L141 179L165 179L156 148" fill="#786e9f" />
      <path d="M86 106L67 129L58 123L50 137L67 146L88 132M154 108L172 130L182 124L192 138L172 148L151 132" fill="#b4c9aa" />
      <path d="M87 104L152 104L164 155L80 155Z" fill="#a899c1" /><path d="M103 105L119 126L137 105" fill="#f9ecd0" />
      <path d="M123 135L145 135L145 151L123 151Z" fill="#e9ae76" strokeDasharray="3 4" />
      <rect x="74" y="37" width="91" height="78" rx="25" fill="#b9cca9" />
      <path d="M80 59L78 38L97 41L102 29L119 39L139 28L143 41L161 37L162 58" fill="#706184" />
      <path d="M97 79L108 79M135 79L146 79" strokeWidth="5" /><path d="M109 96Q122 106 136 94" fill="none" />
      <path d="M120 101L120 108L127 108L127 100" fill="#fff9e8" strokeWidth="2" />
      <ellipse cx="93" cy="91" rx="8" ry="4" fill="#dba6a0" stroke="none" /><ellipse cx="150" cy="91" rx="8" ry="4" fill="#dba6a0" stroke="none" />
      <path d="M79 65L93 62M82 60L85 68M89 58L91 66" strokeWidth="2" />
      <path d="M176 49C180 39 194 44 188 54L176 63L165 53C159 43 173 39 176 49Z" fill="#e3a2b1" stroke="none" />
    </g>}
    {kind === "croc" && <g stroke={ink} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M147 134Q189 158 212 128Q214 168 165 168L145 154" fill="#769b78" /><path d="M184 151L188 138L196 144L200 131L207 135" fill="#e3bd6e" />
      <path d="M88 109Q66 138 86 160L78 179L104 179L113 161L138 162L149 179L174 179L157 153Q164 127 143 108" fill="#86a887" />
      <ellipse cx="121" cy="140" rx="25" ry="29" fill="#d5dba2" stroke="none" /><path d="M91 119L72 136L62 131M149 118L165 131L173 122" fill="none" />
      <path d="M86 65C82 34 107 31 116 48C130 28 153 42 149 66L155 82C164 101 142 116 113 115L57 112C35 111 28 97 35 82C41 70 64 73 86 75Z" fill="#90b190" />
      <ellipse cx="101" cy="58" rx="10" ry="13" fill="#fffdf3" /><ellipse cx="131" cy="56" rx="10" ry="13" fill="#fffdf3" />
      <ellipse cx="99" cy="60" rx="3.5" ry="5" fill={ink} stroke="none" /><ellipse cx="129" cy="58" rx="3.5" ry="5" fill={ink} stroke="none" />
      <path d="M41 94Q87 105 134 92" fill="none" /><path d="M60 98L65 107L70 100M91 100L96 109L101 100" fill="#fffdf3" strokeWidth="2" />
      <circle cx="48" cy="84" r="2" fill={ink} stroke="none" /><circle cx="59" cy="84" r="2" fill={ink} stroke="none" />
      <ellipse cx="132" cy="86" rx="9" ry="5" fill="#dca58a" stroke="none" /><path d="M94 114L137 114L124 132Z" fill="#e5b84f" />
    </g>}
  </svg>;
}
export function HeroArt() {
  return <div className="hero-art" aria-label="三位可愛的探險夥伴在河岸相遇" role="img">
    <svg className="landscape" viewBox="0 0 620 350" aria-hidden="true">
      <path d="M58 243C11 193 54 85 141 59C251 23 261 51 338 26C454 -5 571 44 586 155C601 267 537 323 416 326L181 326C94 326 64 293 58 243Z" fill="#f2e4b8" /><circle cx="442" cy="82" r="29" fill="#e8ab54" />
      <path d="M78 184Q179 103 298 195Q421 102 573 189L575 278L65 278Z" fill="#cad4aa" /><path d="M63 243Q192 200 305 252Q442 213 574 242L557 294Q387 351 178 322L69 291Z" fill="#add0cb" />
      <path d="M86 279Q182 264 272 289M346 286Q420 272 524 288M277 310L354 310" fill="none" stroke="#f9f6df" strokeWidth="4" strokeLinecap="round" />
      <path d="M73 236Q49 170 51 136M51 184Q18 179 31 155Q59 156 51 184M53 168Q87 153 75 138Q51 138 53 168M544 238Q571 171 565 131M562 180Q591 159 601 176Q595 202 562 195M567 158Q541 151 545 131Q567 130 567 158" fill="#668b63" stroke="#668b63" strokeWidth="3" />
      <path d="M194 67L199 57M194 67L184 62M353 110L360 102M353 110L347 102" stroke="#68776a" strokeWidth="2" fill="none" />
    </svg>
    <div className="hero-pal hero-zombie"><Character kind="zombie" /></div><div className="hero-pal hero-croc"><Character kind="croc" /></div><div className="hero-pal hero-basilisk"><Character kind="basilisk" /></div>
    <span className="floating-letter letter-a">A</span><span className="floating-letter letter-b">ㄅ</span><span className="hello-bubble">一起出發吧！ <span>✦</span></span><span className="art-caption">LITTLE STEPS, BIG ADVENTURES</span>
  </div>;
}
