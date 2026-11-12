"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Headphones, Heart, Leaf, Map, RotateCcw, Star, Sticker, Volume2, VolumeX, X } from "lucide-react";
import { getLesson, getPractice, nextPractice, learningAudio, questionAudio, quizTitle, makeRound, speech, type Difficulty, type Stage, type Mode, type LessonId, type Item, type Question } from "./questions";
import { Character, HeroArt, PALS, type Pal } from "./characters";
import { CourseMenu, LearningCard, QuizCard, ParentNotes } from "./lesson-ui";
import { useLearningAudio } from "./useLearningAudio";
import { EMPTY, restoreProgress, finishRound, type Progress } from "./progress";

export default function Home() {
  const [pal, setPal] = useState<Pal>("basilisk");
  const [difficulty, setDifficulty] = useState<Difficulty>("guided");
  const [stage, setStage] = useState<Stage>(1);
  const [lessonId, setLessonId] = useState<LessonId>("phonics");
  const [screen, setScreen] = useState<"home" | "learn" | "quiz" | "done">("home");
  const [modal, setModal] = useState<"stickers" | "parents" | null>(null);
  const [round, setRound] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [correct, setCorrect] = useState(false);
  const [hint, setHint] = useState(false);
  const [muted, setMuted] = useState(false);
  const [storageIssue, setStorageIssue] = useState(false);
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [message, setMessage] = useState("");
  const answered = useRef(false);
  const finished = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const screenHeading = useRef<HTMLHeadingElement>(null);
  const sound = useLearningAudio(muted);
  const selected = PALS.find(p => p.id === pal)!;
  const lesson = getLesson(lessonId);
  const mode = lesson.subject;
  const practice = getPractice(difficulty);
  const harder = nextPractice(difficulty);
  const current = round[index];
  useEffect(() => {
    try {
      setProgress(restoreProgress(JSON.parse(localStorage.getItem("river-pals-progress-v1") || "null")));
      setMuted(localStorage.getItem("river-pals-muted") === "true");
    } catch { setStorageIssue(true); }
  }, []);
  useEffect(() => { if (modal) dialog.current?.showModal(); else dialog.current?.close(); }, [modal]);
  useEffect(() => { if (screen !== "home") screenHeading.current?.focus(); }, [screen, index]);
  function say(text: string, lang = "zh-TW", force = false) { sound.play(speech(text, lang), force); }
  function toggleSound() {
    const next = !muted; setMuted(next);
    try { localStorage.setItem("river-pals-muted", String(next)); } catch { setStorageIssue(true); }
    if (next) sound.stop();
    else say("聲音打開了，一起來玩吧！", "zh-TW", true);
  }
  function start(id: LessonId, level: Difficulty = difficulty) {
    const questions = makeRound(id, Math.random, level);
    setDifficulty(level);
    sound.stop(); setLessonId(id); setRound(questions); setIndex(0); setCorrect(false); setWrong([]); setHint(false); setMessage("");
    answered.current = false; finished.current = false; setScreen(level === "guided" ? "learn" : "quiz"); sound.play(level === "guided" ? learningAudio(questions[0].item) : questionAudio(questions[0].item, level));
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function goHome() { sound.stop(); setScreen("home"); setMessage(""); window.scrollTo({ top: 0, behavior: "instant" }); }
  function quiz() { sound.stop(); setScreen("quiz"); setMessage(""); sound.play(questionAudio(current.item, difficulty)); }
  function showLearning() { sound.stop(); setScreen("learn"); sound.play(learningAudio(current.item)); }
  function answer(option: Item) {
    if (answered.current || wrong.includes(option.id)) return;
    if (option.id === current.item.id) {
      answered.current = true; setCorrect(true); setMessage(current.item.rhyme ? "找到韻腳朋友了！" : "答對了！又往前走了一步！");
      sound.play(learningAudio(current.item));
    } else {
      setWrong(previous => [...previous, option.id]); setMessage("沒關係，再聽一次、試試看。");
      if (wrong.length >= 1) setHint(true);
      sound.play(questionAudio(current.item, difficulty));
    }
  }
  function next() {
    if (!answered.current) return;
    if (index === round.length - 1) {
      if (finished.current) return; finished.current = true;
      const nextProgress = finishRound(progress, pal, lessonId, round.length);
      setProgress(nextProgress);
      try { localStorage.setItem("river-pals-progress-v1", JSON.stringify(nextProgress)); } catch { setStorageIssue(true); }
      setScreen("done"); say("你完成探險了！每一次練習，都很棒！");
    } else {
      const nextIndex = index + 1; setIndex(nextIndex); setCorrect(false); setWrong([]); setHint(false); setMessage(""); answered.current = false;
      setScreen(difficulty === "guided" ? "learn" : "quiz"); sound.play(difficulty === "guided" ? learningAudio(round[nextIndex].item) : questionAudio(round[nextIndex].item, difficulty));
    }
  }
  return <div className="app-shell">
    <audio ref={sound.audioRef} preload="auto" aria-hidden="true" data-testid="learning-audio" />
    <header className="site-header"><button className="brand" onClick={goHome} aria-label="小怪獸探險隊，回到探險地圖"><span className="brand-mark"><Compass size={25} strokeWidth={1.7} /></span><span>小怪獸探險隊<small>RIVER PALS CLUB</small></span></button><nav aria-label="主要選單"><button className={screen === "home" && !modal ? "nav-active" : ""} onClick={goHome}><Map size={17} />探險地圖</button><button onClick={() => setModal("stickers")}><Sticker size={17} />我的貼紙<span className="nav-count">{progress.stickers.length}</span></button></nav><div className="header-actions"><button className="parents-link" onClick={() => setModal("parents")}>給大人的話</button><button className="icon-button" onClick={toggleSound} aria-label={muted ? "開啟語音提示" : "關閉語音提示"} aria-pressed={!muted}>{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button></div></header>
    {screen === "home" ? <main className="home-main">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="little-sun">✺</span> 給 5–6 歲的好奇小探險家</div><h1>把好奇心，<br />帶去<span className="highlight">冒險！<svg viewBox="0 0 240 12" aria-hidden="true"><path d="M3 7Q116 -1 235 7M14 11Q120 3 219 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></span></h1><p>和喜歡的夥伴一起，<br className="mobile-break" />把英文、注音變成好玩的探險。</p><div className="hero-details"><span><Headphones size={16} /> 點一點，聽一聽</span><span><Heart size={16} /> 慢慢學，也很棒</span></div></div><HeroArt /></section>
      <section className="passport" aria-label="學習進度"><div className="passport-title"><span className="passport-icon"><Star size={22} /></span><div><strong>我的探險護照</strong><span>{progress.rounds ? `已完成 ${progress.rounds} 次小冒險，繼續收集回憶吧！` : "每次一小步，收集大大的勇氣！"}</span></div></div><div className="passport-right"><span className="star-total"><Star size={18} fill="currentColor" /> {progress.stars} <small>顆勇氣星</small></span><span className="passport-divider" /><button onClick={() => setModal("stickers")}>翻開貼紙本 <ArrowRight size={17} /></button></div></section>
      <section className="pal-section" aria-labelledby="pal-title"><div className="section-heading"><div><span className="step">01</span><h2 id="pal-title">選一位探險夥伴</h2><span className="section-subtitle">今天，想和誰一起玩？</span></div><span className="handwritten">好朋友，隨時都能換 ↙</span></div><div className="pal-grid" role="group" aria-label="選擇探險夥伴">{PALS.map(p => <button key={p.id} className={`pal-card ${p.color} ${pal === p.id ? "selected" : ""}`} onClick={() => { setPal(p.id); say(`我是${p.name}，${p.line}`); }} aria-pressed={pal === p.id}><span className="selection-dot">{pal === p.id && <Check size={15} strokeWidth={3} />}</span><div className="pal-art"><Character kind={p.id} /></div><div className="pal-description"><span className="pal-tag">{p.tag}</span><h3>{p.name}<span>{p.species}</span></h3><p>{p.line}</p></div></button>)}</div></section>
      <CourseMenu name={selected.name} progress={progress} start={start} difficulty={difficulty} setDifficulty={setDifficulty} stage={stage} setStage={setStage} />
      <div className="kind-note"><Leaf size={17} /><p>這裡沒有倒數計時，沒有扣分。每一次願意試試看，都值得一顆星星。</p></div>
    </main> : screen === "done" ? <main className="result-main"><div className="result-card">
      <span className="eyebrow">{lesson.title} · {practice.title}</span>
      <div className="result-mascot"><span className="result-spark one">✦</span><Character kind={pal} happy /><span className="result-spark two">✧</span><span className="sticker-ribbon">{mode === "english" ? "英文好朋友" : "注音好朋友"}</span></div>
      <h1 ref={screenHeading} tabIndex={-1}>耶！完成一次小冒險！</h1><p>{selected.name}陪你練習了 5 題{lesson.unit}。<br />願意試試看的你，真的很棒！</p>
      <div className="earned-stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} fill="currentColor" size={27} />)}<span>+5 顆勇氣星</span></div>
      <div className="review-row">{round.map(q => <button key={q.item.id} onClick={() => sound.play(learningAudio(q.item), true)} aria-label={`複習${q.item.rhyme ? q.item.rhyme.symbol : q.item.label}`}>{q.item.rhyme ? `${q.item.rhyme.anchor.label}・${q.item.label}（${q.item.rhyme.symbol}）` : q.item.label}<Volume2 size={14} /></button>)}</div>
      <p className="collection-note"><Sticker size={16} /> {selected.name}的{mode === "english" ? "英文" : "注音"}貼紙已放進貼紙本</p>
      <div className="result-actions"><button className="primary-button" onClick={goHome}><Map size={19} />回到探險地圖</button><button className="secondary-button" onClick={() => start(lessonId)}><RotateCcw size={18} />再玩一回合</button></div>
      {harder && <div className="next-practice"><p>還想練習嗎？同一單元，可以換一種玩法。</p><button className="secondary-button" onClick={() => start(lessonId, harder)}>試試「{getPractice(harder).title}」 <ArrowRight size={16} /></button></div>}
      <button className="text-button" onClick={() => setModal("stickers")}>看看我的貼紙 <ArrowRight size={16} /></button><p className="rest-note">也可以休息一下，找找生活裡相似的聲音。</p>
    </div></main> : current && <main className={`game-main ${mode} lesson-${lessonId}`}>
      <div className="game-top"><button className="back-button" onClick={goHome}><ArrowLeft size={18} />回地圖</button><span>{lesson.title} · {practice.title}</span><strong>{index + 1}<span> / 5</span></strong></div>
      <div className="journey" aria-label={`已完成 ${index + (correct ? 1 : 0)} 題，共 5 題`}><span className="journey-line" />{round.map((_, i) => <span key={i} className={`journey-step ${i < index || i === index && correct ? "complete" : ""} ${i === index ? "current" : ""}`}>{i < index || i === index && correct ? <Star size={20} fill="currentColor" /> : i + 1}</span>)}<span className="journey-goal">⚑</span></div>
      <div className="game-layout"><aside className={`companion ${selected.color}`}><Character kind={pal} happy={correct} /><div className="companion-bubble">{correct ? "太棒了！我們又前進了！" : screen === "learn" ? "先聽一聽，再跟我念一次。" : wrong.length ? "沒關係，我們慢慢來。" : "換你試試看，我陪著你！"}</div><span>{selected.name}・你的探險夥伴</span></aside>
        <section className="question-panel"><span className="question-kicker">{screen === "learn" ? "先認識，再挑戰" : "聽一聽，選一選"}</span><h1 ref={screenHeading} tabIndex={-1}>{screen === "learn" ? current.item.rhyme ? "聽聽這兩位韻腳朋友！" : current.item.segments ? "把聲音積木連起來！" : "和新聲音打個招呼！" : quizTitle(lessonId, current.item, difficulty)}</h1>
          {screen === "learn" ? <><p className="lesson-tip">{lesson.tip}</p><LearningCard id={lessonId} item={current.item} play={sound.play} activeStep={sound.activeStep} /><button className="primary-button" onClick={quiz}>我記住了，來挑戰！ <ArrowRight size={20} /></button></> : <QuizCard id={lessonId} current={current} wrong={wrong} correct={correct} hint={hint} message={message} play={sound.play} answer={answer} toggleHint={() => setHint(h => !h)} showLearning={showLearning} difficulty={difficulty} next={next} last={index === round.length - 1} />}
        </section></div><p className="game-reassurance"><Heart size={15} /> {screen === "learn" ? "不用急，準備好了再出發。" : "答錯沒關係，試試看就是進步。"}</p>
    </main>}
    {(sound.issue || storageIssue) && <div className="status-notice" role="status">{sound.issue && <p>{sound.issue}</p>}{storageIssue && <p>目前無法儲存進度，這次仍可以玩；關閉頁面後貼紙可能不會保留。</p>}</div>}
    <footer className="site-footer"><span><Compass size={14} /> 小怪獸探險隊 · 每一小步，都算數。</span><button onClick={() => setModal("parents")}>給大人的話 <Heart size={13} /></button></footer>
    <dialog ref={dialog} className="info-dialog" onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setModal(null); } }} aria-labelledby="dialog-title"><button className="close-dialog icon-button" aria-label="關閉視窗" onClick={() => setModal(null)}><X size={22} /></button>
      {modal === "parents" ? <ParentNotes play={sound.play} /> : <><span className="eyebrow">MY LITTLE COLLECTION</span><h2 id="dialog-title">我的探險貼紙本</h2><p className="dialog-intro">每位夥伴各有兩枚貼紙。<br />和不同夥伴完成英文、注音小探險，一枚一枚收集吧！</p><div className="collection-progress"><span>已收集 {progress.stickers.length} / 6 枚</span><span><Star size={16} fill="currentColor" /> {progress.stars} 顆勇氣星</span></div><div className="sticker-grid">{PALS.flatMap(p => (["english", "zhuyin"] as Mode[]).map(m => { const owned = progress.stickers.includes(`${p.id}-${m}`); return <div key={`${p.id}-${m}`} className={`sticker-card ${p.color} ${owned ? "owned" : "locked"}`}><Character kind={p.id} /><strong>{p.name}的{m === "english" ? "英文" : "注音"}貼紙</strong><span>{owned ? "已收集！" : "完成一回合就能收集"}</span>{owned && <Check className="sticker-check" size={18} />}</div>; }))}</div><button className="primary-button dialog-adventure" onClick={() => { setModal(null); goHome(); }}>回地圖，找夥伴出發 <ArrowRight size={18} /></button></>}
    </dialog>
  </div>;
}
