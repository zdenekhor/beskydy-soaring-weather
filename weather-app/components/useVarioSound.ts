"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "vario-sound-enabled";

/**
 * Variometer-style audio feedback hook.
 *
 * Pass the current thermal value (m/s) to hear:
 * - sink (< 0):     continuous low tone
 * - neutral (~0):   silence
 * - weak lift:      slow low beeps
 * - strong lift:    fast high beeps
 *
 * Pass `null` to silence immediately (e.g. mouse left the chart).
 */
export function useVarioSound(thermal: number | null): {
  soundEnabled: boolean;
  toggleSound: () => void;
} {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    // default OFF so users must opt in
    return stored === "true";
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  }, []);

  // --- Play / update sound whenever thermal or enabled changes ---
  useEffect(() => {
    // Stop whatever was playing before
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (!soundEnabled || thermal === null) return;

    // Lazy-create AudioContext (requires user gesture, which the hover implies)
    try {
      if (!ctxRef.current || ctxRef.current.state === "closed") {
        ctxRef.current = new AudioContext();
      }
    } catch {
      return;
    }

    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => undefined);
    }

    const NEUTRAL_ZONE = 0.25; // m/s below which we stay silent

    if (thermal < -NEUTRAL_ZONE) {
      // ── Sink: continuous low sine tone ──────────────────────────────
      const freq = Math.max(220, 310 + thermal * 30); // lower with more sink
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.10;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      cleanupRef.current = () => {
        try {
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
          osc.stop(ctx.currentTime + 0.08);
        } catch {
          // oscillator already stopped
        }
      };
    } else if (thermal > NEUTRAL_ZONE) {
      // ── Lift: beeping ────────────────────────────────────────────────
      // Frequency: 520 Hz at 0.25 m/s → ~1050 Hz at 5 m/s
      const freq = Math.min(1100, 520 + (thermal - NEUTRAL_ZONE) * 110);
      // Rate: 1 beep/s at 0.25 m/s → 8 beeps/s at 5+ m/s
      const beepsPerSec = Math.min(8, 1.0 + (thermal - NEUTRAL_ZONE) * 1.6);
      const intervalMs = Math.round(1000 / beepsPerSec);
      const beepDurSec = Math.min(0.18, (intervalMs / 1000) * 0.55);

      let stopped = false;

      const playBeep = () => {
        if (stopped) return;
        const c = ctxRef.current;
        if (!c || c.state === "closed") return;

        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + beepDurSec);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + beepDurSec + 0.01);
      };

      playBeep(); // immediate first beep
      const timerId = setInterval(playBeep, intervalMs);

      cleanupRef.current = () => {
        stopped = true;
        clearInterval(timerId);
      };
    }
    // thermal in neutral zone → silence (no cleanup needed)
  }, [thermal, soundEnabled]);

  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close().catch(() => undefined);
      }
    };
  }, []);

  return { soundEnabled, toggleSound };
}
