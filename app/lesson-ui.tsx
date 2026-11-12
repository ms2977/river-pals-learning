"use client";
import { ArrowRight, Check, Headphones, Heart, Sparkles, Sticker, Volume2 } from "lucide-react";
import { BANKS, LESSONS, STAGES, PRACTICES, isPhonics, isVowels, getLesson, learningAudio, questionAudio, speech, type Difficulty, type Stage, type Item, type LessonId, type Mode, type Pronunciation, type Question } from "./questions";
import type { Progress } from "./progress";
type Play = (audio: Pronunciation, force?: boolean) => void;

export function CourseMenu({ name, progress, start, difficulty, setDifficulty, stage, setStage }: { name: string; progress: Progress; start: (id: LessonId) => void; difficulty: Difficulty; setDifficulty: (value: Difficulty) => void; stage: Stage; setStage: (value: Stage) => void }) {
  const currentStage = STAGES.find(s => s.id === stage)!;
  return <section className="adventure-section" aria-labelledby="adventure-title">
    <div className="section-heading"><div><span className="step">02</span><h2 id="adventure-title">沿著聲音，一步一步玩</h2></div><span className="session-note">每回合 5 題・自由選擇</span></div>
    <div className="practice-picker" role="group" aria-label="選擇練習方式"><span className="picker-title">今天想怎麼玩？</span><div>{PRACTICES.map(p => <button key={p.id} aria-pressed={difficulty === p.id} onClick={() => setDifficulty(p.id)}><strong>{p.title}</strong><small>{p.description}</small></button>)}</div><p>新聲音先用「一起學」，熟悉後再往前一小步。每種玩法都有 5 顆星。</p></div>
    <div className="stage-picker" role="group" aria-label="選擇學習小步驟">{STAGES.map(s => <button key={s.id} aria-pressed={stage === s.id} onClick={() => setStage(s.id)} aria-label={`第${s.id}步：${s.title}`}><span>{s.id}</span><strong>{s.title}</strong><small>{s.lessons.filter(id => progress.lessons[id]).length} / {s.lessons.length} 單元玩過</small></button>)}</div>
    <p className="stage-description" aria-live="polite">{currentStage.description} 可以自由切換、回頭複習。</p>
    <div className="adventure-grid">{(["english", "zhuyin"] as Mode[]).map(subject => <section key={subject} className={`adventure-card course-lane ${subject}`} aria-label={subject === "english" ? "英文學習路線" : "注音學習路線"}>
      <div className="course-lane-heading"><div className={`course-art ${subject === "english" ? "abc-art" : "zhuyin-art"}`} aria-hidden="true">{(subject === "english" ? ["s", "a", "t"] : ["ㄚ", "ㄧ", "ㄨ"]).map(symbol => <span key={symbol}>{symbol}</span>)}<i>✧</i></div><div className="course-copy"><span className="course-label">{subject === "english" ? "PHONICS · 聲音會變成字" : "注音 · 從韻母與韻腳開始"}</span><h3>{subject === "english" ? "英文聲音小路" : "注音聲音小路"}</h3><p>{subject === "english" ? "聽字母音，再把聲音拼起來。" : "先聽尾音，再認識開頭的聲音。"}</p></div></div>
      <div className="lesson-list">{LESSONS.filter(l => l.subject === subject && currentStage.lessons.includes(l.id)).map((lesson, index) => <button className="lesson-button" key={lesson.id} onClick={() => start(lesson.id)} aria-label={`開始${lesson.title}`}><span className="lesson-number">{index + 1}</span><span className="lesson-copy"><span className="lesson-topline"><strong>{lesson.title}</strong><small>{lesson.badge}</small></span><span>{lesson.subtitle}</span><span className="lesson-status">{progress.lessons[lesson.id] ? `已玩 ${progress.lessons[lesson.id]} 回合` : `和${name}一起試試`}</span></span><ArrowRight size={18} /></button>)}</div>
    </section>)}</div>
  </section>;
}

export function LearningCard({ id, item, play, activeStep }: { id: LessonId; item: Item; play: Play; activeStep: number | null }) {
  const subject = getLesson(id).subject;
  if (item.rhyme) {
    const rhyme = item.rhyme;
    return <div className="rhyme-learning">
      <div className="rhyme-pair">{[{ ...rhyme.anchor }, { label: item.label, emoji: item.emoji, onset: rhyme.matchOnset }].map(word => <button key={word.label} className="rhyme-word" onClick={() => play(speech(word.label), true)} aria-label={`聽詞語${word.label}`}><span aria-hidden="true">{word.emoji}</span><strong>{word.label}</strong><span className="word-reading">{word.onset}<em>{rhyme.symbol}</em>{rhyme.tone}</span><small><Volume2 size={14} /> 聽詞語</small></button>)}</div>
      <p className="same-ending">開頭不一樣，尾音都有 <strong>{rhyme.symbol}</strong></p>
      <button className="listen-button" onClick={() => play(rhyme.audio, true)}><Volume2 size={21} />聽韻母 {rhyme.symbol}</button>
    </div>;
  }
  if (item.segments) return <div className="blend-learning">
    <div className="blend-tiles">{item.segments.map((segment, index) => <button key={index} className={activeStep === index ? "sounding" : ""} onClick={() => play(segment.audio, true)} aria-label={`聽第${index + 1}個${subject === "english" ? "字母音" : "注音"} ${segment.letter}`}>{segment.letter}<Volume2 size={15} /></button>)}</div>
    <span className="blend-arrow" aria-hidden="true">↓</span><strong className={`blend-word ${activeStep === item.segments.length ? "sounding" : ""}`}>{item.label}</strong><span className="blend-meaning">{item.emoji} {item.translation}</span>
    <button className="listen-button" onClick={() => play(item.pronunciation, true)}><Volume2 size={21} />逐音聽，再合起來</button>
    <button className="text-button" onClick={() => play(item.exampleAudio!, true)}>{subject === "english" ? "只聽完整單字" : "只聽拼起來的音"} <Volume2 size={15} /></button>
  </div>;
  return <div className={`learning-card ${subject} ${isPhonics(id) ? "phonics-card" : ""}`}>
    <span className="item-picture" aria-hidden="true">{item.emoji}</span><strong className="learning-label" lang={subject === "english" ? "en" : "zh-TW"}>{item.label}{isPhonics(id) && <small>{item.label.toUpperCase()}</small>}</strong>
    <span className="learning-translation">{isPhonics(id) ? `${item.example} 的開頭聲音` : item.translation}</span>
    <button className="listen-button" onClick={() => play(learningAudio(item), true)}><Volume2 size={22} />{isPhonics(id) ? "聽字母音" : isVowels(id) ? "聽韻母發音" : id === "zhuyin" ? "聽聲符發音" : "聽聽怎麼念"}</button>
    {isPhonics(id) && <div className="phonics-comparison"><button onClick={() => play(item.nameAudio!, true)}>字母名字 {item.label.toUpperCase()} <Volume2 size={13} /></button><button onClick={() => play(item.exampleAudio!, true)}>單字 {item.example} <Volume2 size={13} /></button></div>}
  </div>;
}

export function QuizCard({ id, current, wrong, correct, hint, message, play, answer, toggleHint, showLearning, difficulty, next, last }: { id: LessonId; current: Question; wrong: string[]; correct: boolean; hint: boolean; message: string; play: Play; answer: (item: Item) => void; toggleHint: () => void; showLearning: () => void; difficulty: Difficulty; next: () => void; last: boolean }) {
  const item = current.item;
  return <>
    <div className="quiz-prompt"><span className="quiz-picture" aria-hidden="true">{item.rhyme ? item.rhyme.anchor.emoji : id === "english" ? item.emoji : <Headphones size={50} />}</span><button className="listen-button" onClick={() => play(questionAudio(item, difficulty), true)}><Volume2 size={22} />{item.rhyme ? `聽「${item.rhyme.anchor.label}」` : "再聽一次"}</button></div>
    <div className={`answers ${current.options.length === 4 ? "four-options" : ""} ${item.rhyme ? "rhyme-answers" : ""}`} role="group" aria-label="選一個答案">{current.options.map((option, index) => <div key={option.id} className="answer-slot"><button onClick={() => answer(option)} disabled={correct || wrong.includes(option.id)} className={`answer ${getLesson(id).subject} ${wrong.includes(option.id) ? "tried" : ""} ${correct && option.id === item.id ? "is-correct" : ""}`}><span className="answer-number">{index + 1}</span>{item.rhyme && <span className="answer-emoji" aria-hidden="true">{option.emoji}</span>}<strong lang={getLesson(id).subject === "english" ? "en" : "zh-TW"}>{option.label}</strong>{correct && option.id === item.id && <Check size={23} />}</button>{item.rhyme && <button className="option-listen" onClick={() => play(option.pronunciation, true)} aria-label={`聽選項${option.label}`}><Volume2 size={15} /> 聽「{option.label}」</button>}</div>)}</div>
    <div className={`feedback ${correct ? "positive" : ""}`} aria-live="polite">{message || (item.rhyme ? "可以先聽每張卡片，再選尾音一樣的朋友。" : "選一張卡片，幫夥伴往前走。")}</div>
    {correct && item.rhyme && <div className="rhyme-feedback"><span>{item.rhyme.anchor.label} ＋ {item.label} → 尾音 <strong>{item.rhyme.symbol}</strong></span><button onClick={() => play(item.rhyme!.audio, true)} aria-label={`再聽韻母${item.rhyme.symbol}`}><Volume2 size={17} /></button></div>}
    {correct ? <button className="primary-button" onClick={next}>{last ? "收集我的貼紙" : "下一站，出發！"}<ArrowRight size={20} /></button> : <div className="hint-area"><button className="text-button return-learning" onClick={showLearning}><Headphones size={16} />再看學習卡</button><button className="text-button" onClick={toggleHint}><Sparkles size={16} />{hint ? "收起小提示" : "我想看小提示"}</button>{hint && <span className="hint">{item.rhyme ? `「${item.rhyme.anchor.label}」和「${item.label}」的尾音都有 ${item.rhyme.symbol}。` : `找找看「${item.label}」，再聽一次吧！`}</span>}</div>}
  </>;
}

export function ParentNotes({ play }: { play: Play }) {
  return <><span className="eyebrow">A NOTE FOR GROWN-UPS</span><h2 id="dialog-title">先玩聲音，再一步步拼讀。</h2><p className="dialog-intro">第一次玩，請大人陪同。每回合 5 題，隨時可以休息；路線可以自由選擇。</p><div className="parent-points">
    <div><Headphones /><section><h3>英文：字母音 → 拼讀 → 生活單字</h3><p>Phonics 是字形和聲音的連結。先玩 s、a、t、p、i、n 的常見字母音，並比較字母名字；再用這六個字母逐音練習 sat、sit、pin、pan、tap、nap。第二步增加 m、d、g、o、b、f，再拼 map、mat、man、dog、dig、dot、bag、fan。a、i、o 先練短母音，g 先練 goat 的硬音；這裡尚未涵蓋完整自然發音規則。</p></section></div>
    <div><Volume2 /><section><h3>注音：韻母 → 韻腳 → 聲符</h3><p>先練 ㄚ、ㄧ、ㄨ、ㄠ、ㄡ、ㄢ 六個韻母（ㄧ、ㄨ 在這裡單獨作韻母），再比較沙／他、雞／七、豬／書、貓／包、狗／手、山／三的尾音。例字只作輔助；「聽韻母」播放注音音檔，「聽詞語」才會念國字。第二步增加 ㄜ、ㄞ、ㄟ、ㄣ、ㄤ、ㄥ 與六組韻腳；第三步先認識聲符，再用 ㄚ、ㄠ 拼第一聲：媽、八、他、包、刀、貓。單一符號仍用獨立錄音，拼起來的完整音才用例字朗讀。本版尚未進入聲調辨識、結合韻與完整注音拼讀。</p></section></div>
    <div><Heart /><section><h3>三種玩法，慢慢增加難度</h3><p>「一起學」先看卡再三選一；「自己試」直接聽音、三選一；「小挑戰」四選一，拼讀題也會優先加入字形接近的選項。後兩種玩法的拼讀題先讀完整單字或音節，需要時能打開學習卡拆音。選擇難度由大人與孩子決定，不會自動升級。拼讀關可逐個點字母；韻腳關可先聽所有選項。每種玩法都完成五題、獲得五顆星。沒有計時、扣分或排名，答錯能重試或看提示。完成紀錄只代表玩過，不代表已精熟。</p><p className="audio-credit">教學情境參考：<a href="https://shopping.parenting.com.tw/Article/Detail/86452?lang=zh-TW" target="_blank" rel="noreferrer">親子天下・注音教學五大方法</a>。本遊戲依這次需求採韻母先行，使用自編題目。</p></section></div>
    <div><Volume2 /><section><h3>聲音來源與試聽</h3><p>字母音使用 Phonicademy 音檔；注音使用教育部獨立錄音。完整英文單字與中文詞語使用裝置朗讀，實際口音依可用語音而定。Phonics 單字設定為英式英文；原有生活單字設定為美式英文。關閉自動語音後，仍可按喇叭單次試聽。</p><div className="voice-tests"><button className="secondary-button" onClick={() => play(BANKS.phonics[0].pronunciation, true)}>試聽字母音 s</button><button className="secondary-button" onClick={() => play(BANKS.vowels[0].pronunciation, true)}>試聽韻母 ㄚ</button></div><p className="audio-credit">Phonics sounds: <a href="https://phonicademy.com/" target="_blank" rel="noreferrer">Phonicademy (phonicademy.com)</a>，依其<a href="https://phonicademy.com/audio-license" target="_blank" rel="noreferrer">音訊授權</a>內嵌使用，請勿將音檔另作獨立素材包散布。</p><p className="audio-credit">注音錄音：<a href="https://language.moe.gov.tw/001/Upload/files/site_content/M0001/juyin/html_ch/index.html#page05" target="_blank" rel="noreferrer">教育部《國語注音符號手冊》（2017）</a>，依 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a> 使用，音檔未修改。</p></section></div>
    <div><Sticker /><section><h3>既有星星和貼紙都保留</h3><p>每位夥伴仍有英文、注音各一枚貼紙，共 6 枚；新增每個關卡玩過的回合數。進度存在目前瀏覽器，不收集孩子姓名，不跨裝置同步；清除瀏覽器資料會清除紀錄。</p></section></div>
  </div></>;
}
