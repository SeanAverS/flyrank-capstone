// The pedalboard modifying the sound of the current guitar loop 

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

/**
 * Props for the Knob component.
 */
interface KnobProps {
  /** Text displayed beneath the knob. */
  label: string;
  /** Color of the knob line. */
  color: string;
  /** Callback when knob rotates (value changes) */
  onValueChange?: (value: number) => void;
}

/**
 * Snaps pedal knob line to the clicked position. 
 */
function Knob({ label, color, onValueChange }: KnobProps) {
  const rotation = useMotionValue(0);

  /**
   * Adjust pedal knob to the clicked position. 
   * @param event - Mouse click event for the knob.
   */
  const adjustKnob = (event: React.MouseEvent<HTMLDivElement>) => {
    const currentPos = event.currentTarget.getBoundingClientRect();

    // calculate center of knob 
    const centerX = currentPos.left + currentPos.width / 2;
    const centerY = currentPos.top + currentPos.height / 2;
    
    // adjuster: calculate angle between center of knob and current mouse click (in radians) 
    const radians = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    
    // degree conversion + rotate coordinates so knob top = 0 degrees
    const degrees = (radians * (180 / Math.PI)) + 90;
    
    rotation.set(degrees);
    
    // detect knob rotation 
    if (onValueChange) {
      const normalizedValue = ((degrees % 360) + 360) % 360 / 360;
      onValueChange(normalizedValue);
    }
  };

  return (
    <div className="text-center select-none">
      <motion.div
        className="h-12 w-12 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center relative cursor-pointer shadow-inner touch-none"
        style={{ rotate: rotation }}
        onClick={adjustKnob} 
      >
        <div className="absolute top-1 w-0.5 h-3" style={{ backgroundColor: color }} />
      </motion.div>
      <label className="text-[10px] font-bold uppercase tracking-wider block mt-2" style={{ color: color }}>
        {label}
      </label>
    </div>
  );
}

/**
 * Main view for the pedalboard.
 */
export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePedals, setActivePedals] = useState({ boost: true, filter: false, delay: true });
  
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const filterNode = useRef<BiquadFilterNode | null>(null);
  const delayNode = useRef<DelayNode | null>(null);
  const feedbackNode = useRef<GainNode | null>(null);

  // Setup Audio Nodes
  useEffect(() => {
    const ctx = new window.AudioContext();
    audioContext.current = ctx;

    const source = ctx.createOscillator();
    source.type = "sawtooth";
    source.frequency.setValueAtTime(110, ctx.currentTime);

    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const delay = ctx.createDelay(1.0);
    const feedback = ctx.createGain();

    // Set initial values
    gain.gain.value = 0.5;
    filter.type = "lowpass";
    filter.frequency.value = 1000;
    filter.Q.value = 1;
    delay.delayTime.value = 0.3;
    feedback.gain.value = 0.4;

    source.connect(gain);
    gain.connect(filter);
    filter.connect(delay);
    delay.connect(ctx.destination);
    delay.connect(feedback);
    feedback.connect(delay);

    oscillator.current = source;
    gainNode.current = gain;
    filterNode.current = filter;
    delayNode.current = delay;
    feedbackNode.current = feedback;

    return () => {
      ctx.close();
    };
  }, []);

  // Handle Play/Stop
  useEffect(() => {
    if (!audioContext.current || !oscillator.current) return;
    
    if (isPlaying) {
      if (audioContext.current.state === "suspended") {
        audioContext.current.resume();
      }
      try {
        oscillator.current.start();
      } catch (e) {
        // Ignored if loop already started
      }
    } else {
      try {
        oscillator.current.stop();
      } catch (e) {
        // Ignored if already stopped
      }
      
      // Recreate oscillator after stopping
      const newOsc = audioContext.current.createOscillator();
      newOsc.type = "sawtooth";
      newOsc.frequency.setValueAtTime(110, audioContext.current.currentTime);
      if (gainNode.current) {
        newOsc.connect(gainNode.current);
      }
      oscillator.current = newOsc;
    }
  }, [isPlaying]);

  // Handle Pedal Bypassing
  useEffect(() => {
    if (!audioContext.current) return;
    const { boost, filter, delay } = activePedals;
    
    // Reset gains or disconnect 
    if (gainNode.current) gainNode.current.gain.value = boost ? 1 : 0;
    if (filterNode.current) filterNode.current.type = filter ? "lowpass" : "allpass";
    if (feedbackNode.current) feedbackNode.current.gain.value = delay ? 0.4 : 0;
  }, [activePedals]);

  /**
   * Turn a pedal on or off.
   * 
   * @param pedal - Identify which pedal to toggle.
   */
  const togglePedal = (pedal: "boost" | "filter" | "delay") => {
    setActivePedals(prev => ({ ...prev, [pedal]: !prev[pedal] }));
  };

  return (
    <div className="mx-auto max-w-7xl p-6 flex flex-col items-center">
      {/* Play Button */}
      <div className="w-full flex justify-center pb-6 mb-2">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-8 py-4 rounded-2xl font-bold tracking-wide shadow-xl transition-all transform active:scale-95 text-lg ${
            isPlaying 
              ? "bg-red-500 hover:bg-red-400 text-white shadow-red-950/50" 
              : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50"
          }`}
        >
          {isPlaying ? "⏹ Pause" : "▶ Play Loop"}
        </button>
      </div>

      {/* Pedalboard */}
      <div className="w-full relative rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl ring-1 ring-slate-800">
        
        {/* Cable Connectors */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-500 -translate-y-1/2 hidden md:block rounded-full z-0" />

        {/* Input / Output Jacks */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-zinc-700 border border-zinc-600 rounded-l h-8 w-3 hidden md:block shadow-md" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-zinc-700 border border-zinc-600 rounded-r h-8 w-3 hidden md:block shadow-md" />

        {/* Pedals */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Pedal 1: CHRONO BOOST (Volume/Gain) */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-700 bg-gradient-to-b from-amber-700 to-amber-900 p-5 shadow-2xl text-amber-50 select-none">
            <div>
              <div className="flex flex-col items-center gap-2">
                <div className={`h-3 w-3 rounded-full transition-all duration-300 ${activePedals.boost ? "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" : "bg-zinc-900"}`} />
                <h3 className="text-center font-black tracking-tighter text-xl uppercase italic text-amber-100">Chrono Boost</h3>
              </div>
            </div>

            {/* Knobs */}
            <div className="my-8 grid grid-cols-2 gap-4 justify-items-center">
              <Knob label="Gain" color="#fcd34d" onValueChange={(v) => gainNode.current && (gainNode.current.gain.value = v)} /> 
              <Knob label="Level" color="#fcd34d" />
            </div>

            {/* Stomp Switch */}
            <div className="flex flex-col items-center mt-auto">
              <button 
                onClick={() => togglePedal("boost")}
                className="h-10 w-10 rounded-full bg-zinc-400 border-4 border-zinc-600 shadow-md active:bg-zinc-500 transform active:translate-y-0.5 transition-all outline-none" 
              />
              <span className="text-[11px] font-mono tracking-widest uppercase mt-2 text-amber-200">Engage</span>
            </div>
          </div>

          {/* Pedal 2: NEON PULSE (Wah / Filter Component) */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-700 bg-gradient-to-b from-cyan-800 to-cyan-950 p-5 shadow-2xl text-cyan-50 select-none">
            <div>
              <div className="flex flex-col items-center gap-2">
                <div className={`h-3 w-3 rounded-full transition-all duration-300 ${activePedals.filter ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" : "bg-zinc-900"}`} />
                <h3 className="text-center font-black tracking-tighter text-xl uppercase italic text-cyan-100">Neon Pulse</h3>
              </div>
            </div>

            {/* Knobs */}
            <div className="my-8 grid grid-cols-2 gap-4 justify-items-center">
              <Knob label="Cutoff" color="#67e8f9" onValueChange={(v) => filterNode.current && (filterNode.current.frequency.value = v * 2000)} />
              <Knob label="Reso" color="#67e8f9" onValueChange={(v) => filterNode.current && (filterNode.current.Q.value = v * 20)} />
            </div>

            {/* Engage Switch */}
            <div className="flex flex-col items-center mt-auto">
              <button 
                onClick={() => togglePedal("filter")}
                className="h-10 w-10 rounded-full bg-zinc-400 border-4 border-zinc-600 shadow-md active:bg-zinc-500 transform active:translate-y-0.5 transition-all outline-none" 
              />
              <span className="text-[11px] font-mono tracking-widest uppercase mt-2 text-cyan-300">Filter</span>
            </div>
          </div>

          {/* Pedal 3: ECHO CAVERN (Delay Effect) */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-700 bg-gradient-to-b from-purple-800 to-purple-950 p-5 shadow-2xl text-purple-50 select-none">
            <div>
              <div className="flex flex-col items-center gap-2">
                <div className={`h-3 w-3 rounded-full transition-all duration-300 ${activePedals.delay ? "bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.8)]" : "bg-zinc-900"}`} />
                <h3 className="text-center font-black tracking-tighter text-xl uppercase italic text-purple-100">Echo Cavern</h3>
              </div>
            </div>

            {/* Knobs */}
            <div className="my-8 grid grid-cols-2 gap-4 justify-items-center">
              <Knob label="Time" color="#d8b4fe" onValueChange={(v) => delayNode.current && (delayNode.current.delayTime.value = v)} /> 
              <Knob label="Decay" color="#d8b4fe" onValueChange={(v) => feedbackNode.current && (feedbackNode.current.gain.value = v)} />
            </div>

            {/* Engage Switch */}
            <div className="flex flex-col items-center mt-auto">
              <button 
                onClick={() => togglePedal("delay")}
                className="h-10 w-10 rounded-full bg-zinc-400 border-4 border-zinc-600 shadow-md active:bg-zinc-500 transform active:translate-y-0.5 transition-all outline-none" 
              />
              <span className="text-[11px] font-mono tracking-widest uppercase mt-2 text-purple-300">Bypass</span>
            </div>
          </div>

        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">Grey Button Turns On Pedal</h1>
        <p className="text-slate-400 text-md mt-1">Turning Knobs Modifies Loop Sound</p>
      </div>
    </div>
  );
}