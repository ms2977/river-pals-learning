"use client";
import { useEffect, useRef, useState } from "react";
import type { Clip, Pronunciation } from "./questions";
import { publicAssetUrl } from "./publicAssetUrl";

// One output channel for a sound, a spoken word, or an ordered blending sequence.
export function useLearningAudio(muted: boolean) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const generation = useRef(0);
  const cancelPending = useRef<(() => void) | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const [issue, setIssue] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  function cancel() {
    generation.current++;
    cancelPending.current?.();
    cancelPending.current = null;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }
  function stop() { cancel(); setActiveStep(null); }
  useEffect(() => () => { cancel(); }, []);

  function playClip(clip: Clip, request: number): Promise<boolean> {
    return new Promise(resolve => {
      let finished = false;
      let clearHandlers = () => {};
      const finish = (ok: boolean) => {
        if (finished) return;
        finished = true; clearHandlers();
        if (generation.current === request) cancelPending.current = null;
        resolve(ok);
      };
      const fail = (message: string) => {
        if (generation.current === request) setIssue(message);
        finish(false);
      };
      cancelPending.current = () => finish(false);
      if (clip.kind === "recording") {
        const audio = audioRef.current;
        if (!audio) { fail("音檔暫時無法播放，請再按一次喇叭。"); return; }
        const onEnded = () => finish(true);
        const onError = () => fail("音檔暫時無法播放，請確認網路後再按喇叭。");
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("error", onError);
        clearHandlers = () => { audio.removeEventListener("ended", onEnded); audio.removeEventListener("error", onError); };
        audio.src = publicAssetUrl(import.meta.env.BASE_URL, clip.src);
        void audio.play().catch(error => {
          if (generation.current !== request || error?.name === "AbortError") finish(false);
          else onError();
        });
      } else {
        if (!("speechSynthesis" in window)) { fail("裝置朗讀目前無法使用，請大人陪讀單字。字母音和注音音檔仍可播放。"); return; }
        const voice = new SpeechSynthesisUtterance(clip.text);
        const voices = window.speechSynthesis.getVoices();
        voice.lang = clip.lang;
        voice.voice = voices.find(v => v.lang.toLowerCase() === clip.lang.toLowerCase()) || voices.find(v => v.lang.startsWith(clip.lang.split("-")[0])) || null;
        voice.rate = clip.lang.startsWith("en") ? 0.75 : 0.82;
        voice.pitch = 1.05;
        voice.onend = () => finish(true);
        voice.onerror = event => {
          if (event.error === "canceled" || event.error === "interrupted" || generation.current !== request) finish(false);
          else fail("裝置朗讀目前無法播放，請大人陪讀單字；字母音與注音音檔仍可試聽。");
        };
        clearHandlers = () => { voice.onend = null; voice.onerror = null; };
        utterance.current = voice;
        window.speechSynthesis.speak(voice);
      }
    });
  }
  function play(pronunciation: Pronunciation, force = false) {
    stop(); setIssue(null);
    if (muted && !force) return;
    const request = generation.current;
    const clips = pronunciation.kind === "sequence" ? pronunciation.clips : [pronunciation];
    void (async () => {
      for (let index = 0; index < clips.length; index++) {
        if (generation.current !== request) return;
        if (pronunciation.kind === "sequence") setActiveStep(index);
        const ok = await playClip(clips[index], request);
        if (!ok || generation.current !== request) return;
      }
    })();
  }
  return { audioRef, activeStep, issue, play, stop };
}
