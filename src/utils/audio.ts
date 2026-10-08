/**
 * Kallos Horological Chime Synthesizer
 * Synthesizes procedural horology acoustics using the Web Audio API.
 * Recreates pure harmonic overtones with gradual crescendo dynamics.
 */

class ChimeSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays the signature "Celestia Gradual Crescendo" tone
   * A 3-tier harmonious sequence that swells gradually in volume
   */
  public playCelestiaCrescendo() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Harmonic chords (E major overtones: E5 659Hz, G#5 830Hz, B5 987Hz, E6 1318Hz)
      const frequencies = [659.25, 830.61, 987.77, 1318.51];
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Crescendo envelope: starts whisper soft, swells to peak over 2.5s, then rings out gracefully
      masterGain.gain.setValueAtTime(0.02, now);
      masterGain.gain.exponentialRampToValueAtTime(0.28, now + 1.2);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const toneGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        // Subtle bell attack
        toneGain.gain.setValueAtTime(0.001, now);
        toneGain.gain.linearRampToValueAtTime(0.3 / (idx + 1), now + 0.1 + idx * 0.15);
        toneGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        osc.connect(toneGain);
        toneGain.connect(masterGain);

        osc.start(now + idx * 0.15);
        osc.stop(now + 3.8);
      });
    } catch (e) {
      console.warn('Web Audio playback failed or blocked:', e);
    }
  }

  /**
   * Plays the "Loud Chime Sequence" for imminent arrival/checkpoints
   */
  public playLoudChime() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.35, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      // Crisp duplex chime
      const strikes = [0, 0.35];
      const freqs = [880, 1174.66]; // A5 and D6

      strikes.forEach((startTime, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freqs[i], now + startTime);

        gain.gain.setValueAtTime(0.4, now + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startTime + 1.6);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now + startTime);
        osc.stop(now + startTime + 1.8);
      });
    } catch (e) {
      console.warn('Web Audio chime sequence failed:', e);
    }
  }

  /**
   * Soft haptic click / confirmation tone
   */
  public playAcknowledgeTone() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }
}

export const chimeSynthesizer = new ChimeSynthesizer();
