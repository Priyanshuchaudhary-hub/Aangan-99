/**
 * Aangan 99 — Procedural Web Audio Engine
 * Generates authentic retro Indian sounds, ambient soundscapes,
 * cassette mechanical clicks, and signature 90s television melodies.
 */

class AudioSynthesizerEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private activeMelodyStopFn: (() => void) | null = null;

  // Ambient generators
  private ambientGains: { [key: string]: GainNode } = {};
  private ambientNodes: { [key: string]: { stop: () => void } } = {};

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean) {
    this.setMasterMute(muted);
  }

  public playSynthMelody(key: string) {
    this.playNostalgicMelody(key);
  }

  public playMelody(key: string) {
    this.playNostalgicMelody(key);
  }

  public stopMelody() {
    this.stopCurrentMelody();
  }

  public playSuccessChime() {
    this.playBootComputerComplete();
  }

  public playChirp() {
    this.playBootPOSTBeep();
  }

  public playTapeClunk() {
    this.playClick('heavy');
  }

  public playCRTStatic() {
    this.playCRTTurnOn();
  }

  public playModemBurst() {
    this.playPhoneDialTone(9);
  }

  public playErrorBuzzer() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  public stopAllAmbience() {
    this.stopAllAmbient();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // --- Mechanical Clicks & Haptics ---

  public playClick(type: 'heavy' | 'soft' | 'switch' | 'beep' = 'heavy') {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'heavy') {
      // Cassette deck mechanical clunk
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.06);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.08);

      // Add a snap
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'sine';
      snap.frequency.setValueAtTime(800, t);
      snap.frequency.exponentialRampToValueAtTime(120, t + 0.02);
      snapGain.gain.setValueAtTime(0.25, t);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
      snap.connect(snapGain);
      snapGain.connect(this.masterGain);
      snap.start(t);
      snap.stop(t + 0.03);

    } else if (type === 'switch') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.04);

    } else if (type === 'beep') {
      // Brick game LCD 8-bit blip
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.06);

    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  }

  public playBootPOSTBeep() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(940, t);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playTypewriterTick() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 300, t);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  public playPaperRustle() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t);
    filter.Q.setValueAtTime(1.5, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);
  }

  public playStickerPeel() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(2200, t + 0.1);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playPhoneDialTone(digit: number = 5) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dtmfPairs: { [key: number]: [number, number] } = {
      1: [697, 1209],
      2: [697, 1336],
      3: [697, 1477],
      4: [770, 1209],
      5: [770, 1336],
      6: [770, 1477],
      7: [852, 1209],
      8: [852, 1336],
      9: [852, 1477],
      0: [941, 1336]
    };
    const [f1, f2] = dtmfPairs[digit] || [770, 1336];
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.frequency.setValueAtTime(f1, t);
    osc2.frequency.setValueAtTime(f2, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.15);
    osc2.stop(t + 0.15);
  }

  public playBootComputerComplete() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Classic 90s startup arpeggio / chord
    const freqs = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);
      gain.gain.setValueAtTime(0.001, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.09, t + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 1.25);
    });
  }

  public playPencilWind() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340 + Math.random() * 80, t);
    osc.frequency.linearRampToValueAtTime(460 + Math.random() * 50, t + 0.09);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // --- CRT TV Degauss & Static Sounds ---

  public playCRTTurnOn() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Degauss Thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.5);

    // High frequency 15.6 kHz flyback transformer hum
    const flyback = this.ctx.createOscillator();
    const flyGain = this.ctx.createGain();
    flyback.type = 'sine';
    flyback.frequency.setValueAtTime(14500, t);
    flyGain.gain.setValueAtTime(0.001, t);
    flyGain.gain.linearRampToValueAtTime(0.04, t + 0.2);
    flyGain.gain.exponentialRampToValueAtTime(0.005, t + 0.8);
    flyback.connect(flyGain);
    flyGain.connect(this.masterGain);
    flyback.start(t);
    flyback.stop(t + 0.8);
  }

  // Play Dial-up 56k Modem Connection Sequence
  public playDialUpSequence(onProgress?: (step: string) => void): Promise<void> {
    this.initContext();
    return new Promise((resolve) => {
      if (!this.ctx || !this.masterGain || this.isMuted) {
        resolve();
        return;
      }

      const t0 = this.ctx.currentTime;
      onProgress?.('Dialing VSNL / MTNL Node (172222)...');

      // Dial tone (350Hz + 440Hz)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const dialGain = this.ctx.createGain();
      osc1.frequency.value = 350;
      osc2.frequency.value = 440;
      dialGain.gain.setValueAtTime(0.12, t0);
      dialGain.gain.setValueAtTime(0, t0 + 0.8);

      osc1.connect(dialGain);
      osc2.connect(dialGain);
      dialGain.connect(this.masterGain);
      osc1.start(t0);
      osc2.start(t0);
      osc1.stop(t0 + 0.8);
      osc2.stop(t0 + 0.8);

      // DTMF Tones
      const digits = [941, 1336, 770, 1209, 852, 1477, 697, 1336];
      let dtmfTime = t0 + 0.9;
      for (let i = 0; i < 7; i++) {
        const dOsc1 = this.ctx.createOscillator();
        const dOsc2 = this.ctx.createOscillator();
        const dGain = this.ctx.createGain();
        dOsc1.frequency.value = digits[i % digits.length];
        dOsc2.frequency.value = digits[(i + 1) % digits.length];
        dGain.gain.setValueAtTime(0.15, dtmfTime);
        dGain.gain.setValueAtTime(0, dtmfTime + 0.08);

        dOsc1.connect(dGain);
        dOsc2.connect(dGain);
        dGain.connect(this.masterGain);
        dOsc1.start(dtmfTime);
        dOsc2.start(dtmfTime);
        dOsc1.stop(dtmfTime + 0.08);
        dOsc2.stop(dtmfTime + 0.08);
        dtmfTime += 0.12;
      }

      setTimeout(() => onProgress?.('Ringing Remote Server...'), 1800);

      // Ringback tone
      const ringTime = dtmfTime + 0.3;
      const rOsc1 = this.ctx.createOscillator();
      const rOsc2 = this.ctx.createOscillator();
      const rGain = this.ctx.createGain();
      rOsc1.frequency.value = 440;
      rOsc2.frequency.value = 480;
      rGain.gain.setValueAtTime(0, ringTime);
      rGain.gain.setValueAtTime(0.15, ringTime + 0.05);
      rGain.gain.setValueAtTime(0.15, ringTime + 1.2);
      rGain.gain.setValueAtTime(0, ringTime + 1.3);

      rOsc1.connect(rGain);
      rOsc2.connect(rGain);
      rGain.connect(this.masterGain);
      rOsc1.start(ringTime);
      rOsc2.start(ringTime);
      rOsc1.stop(ringTime + 1.3);
      rOsc2.stop(ringTime + 1.3);

      setTimeout(() => onProgress?.('Handshake: V.90 56,000 bps Negotiating...'), 3300);

      // Handshake squeal & static noise
      const handshakeTime = ringTime + 1.5;
      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2100, handshakeTime);
      filter.frequency.linearRampToValueAtTime(1400, handshakeTime + 1.5);
      filter.Q.value = 4;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, handshakeTime);
      noiseGain.gain.linearRampToValueAtTime(0.18, handshakeTime + 1.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, handshakeTime + 2.5);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(handshakeTime);
      noise.stop(handshakeTime + 2.5);

      // Dual Carrier Whistles
      const carrier = this.ctx.createOscillator();
      const carrierGain = this.ctx.createGain();
      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(1800, handshakeTime + 0.5);
      carrier.frequency.linearRampToValueAtTime(980, handshakeTime + 2.2);
      carrierGain.gain.setValueAtTime(0.08, handshakeTime + 0.5);
      carrierGain.gain.exponentialRampToValueAtTime(0.001, handshakeTime + 2.4);
      carrier.connect(carrierGain);
      carrierGain.connect(this.masterGain);
      carrier.start(handshakeTime + 0.5);
      carrier.stop(handshakeTime + 2.5);

      setTimeout(() => {
        onProgress?.('Connected! Welcome to Indian Cyberspace 1999.');
        resolve();
      }, 5800);
    });
  }

  // --- Nostalgic 90s Melodies Synth ---

  public stopCurrentMelody() {
    if (this.activeMelodyStopFn) {
      this.activeMelodyStopFn();
      this.activeMelodyStopFn = null;
    }
  }

  public playNostalgicMelody(key: string, onEnd?: () => void) {
    this.initContext();
    this.stopCurrentMelody();
    if (!this.ctx || !this.masterGain || this.isMuted) {
      onEnd?.();
      return;
    }

    let isStopped = false;
    const notesToPlay = this.getMelodyNotes(key);
    let noteIndex = 0;
    let timerId: any = null;

    const playNextNote = () => {
      if (isStopped || !this.ctx || !this.masterGain) return;
      if (noteIndex >= notesToPlay.length) {
        // Loop or end
        noteIndex = 0;
      }

      const note = notesToPlay[noteIndex];
      const now = this.ctx.currentTime;
      const duration = note.duration || 0.35;

      if (note.freq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm tape style timbre
        osc.type = note.waveType || (key === 'malgudi' ? 'triangle' : 'sine');
        osc.frequency.setValueAtTime(note.freq, now);

        // Envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + duration + 0.05);

        // Harmonic shimmer
        if (key === 'doordarshan' || key === 'milesur') {
          const subOsc = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          subOsc.type = 'triangle';
          subOsc.frequency.setValueAtTime(note.freq * 2, now);
          subGain.gain.setValueAtTime(0.001, now);
          subGain.gain.linearRampToValueAtTime(0.06, now + 0.04);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          subOsc.connect(subGain);
          subGain.connect(this.masterGain);
          subOsc.start(now);
          subOsc.stop(now + duration);
        }
      }

      noteIndex++;
      timerId = setTimeout(playNextNote, duration * 1000 * 0.95);
    };

    playNextNote();

    this.activeMelodyStopFn = () => {
      isStopped = true;
      if (timerId) clearTimeout(timerId);
    };
  }

  private getMelodyNotes(key: string): Array<{ freq: number; duration: number; waveType?: OscillatorType }> {
    // Frequencies in Hz
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;

    switch (key) {
      case 'doordarshan':
        // Iconic Ascending Doordarshan Signature
        return [
          { freq: C4, duration: 0.35, waveType: 'triangle' },
          { freq: E4, duration: 0.35, waveType: 'triangle' },
          { freq: G4, duration: 0.4, waveType: 'triangle' },
          { freq: C5, duration: 0.5, waveType: 'triangle' },
          { freq: B4, duration: 0.35, waveType: 'triangle' },
          { freq: G4, duration: 0.4, waveType: 'triangle' },
          { freq: E4, duration: 0.6, waveType: 'triangle' },
          { freq: 0, duration: 0.3 },
          { freq: G4, duration: 0.35, waveType: 'sine' },
          { freq: A4, duration: 0.35, waveType: 'sine' },
          { freq: C5, duration: 0.7, waveType: 'sine' },
          { freq: 0, duration: 0.6 },
        ];

      case 'malgudi':
        // "Ta Na Na Na Na Na Re Na Na"
        return [
          { freq: E4, duration: 0.3, waveType: 'triangle' },
          { freq: G4, duration: 0.3, waveType: 'triangle' },
          { freq: A4, duration: 0.3, waveType: 'triangle' },
          { freq: B4, duration: 0.4, waveType: 'triangle' },
          { freq: A4, duration: 0.3, waveType: 'triangle' },
          { freq: G4, duration: 0.3, waveType: 'triangle' },
          { freq: E4, duration: 0.5, waveType: 'triangle' },
          { freq: D4, duration: 0.4, waveType: 'triangle' },
          { freq: E4, duration: 0.7, waveType: 'triangle' },
          { freq: 0, duration: 0.4 },
        ];

      case 'milesur':
        // Mile Sur Mera Tumhara
        return [
          { freq: G4, duration: 0.45, waveType: 'sine' },
          { freq: E4, duration: 0.45, waveType: 'sine' },
          { freq: G4, duration: 0.45, waveType: 'sine' },
          { freq: A4, duration: 0.6, waveType: 'sine' },
          { freq: G4, duration: 0.45, waveType: 'sine' },
          { freq: E4, duration: 0.45, waveType: 'sine' },
          { freq: D4, duration: 0.7, waveType: 'sine' },
          { freq: 0, duration: 0.3 },
          { freq: E4, duration: 0.45, waveType: 'sine' },
          { freq: G4, duration: 0.45, waveType: 'sine' },
          { freq: A4, duration: 0.45, waveType: 'sine' },
          { freq: C5, duration: 0.8, waveType: 'sine' },
          { freq: 0, duration: 0.5 },
        ];

      case 'junglebook':
        // "Jungle Jungle Baat Chali Hai Pata Chala Hai"
        return [
          { freq: C4, duration: 0.25, waveType: 'square' },
          { freq: C4, duration: 0.25, waveType: 'square' },
          { freq: D4, duration: 0.25, waveType: 'square' },
          { freq: E4, duration: 0.35, waveType: 'square' },
          { freq: E4, duration: 0.25, waveType: 'square' },
          { freq: G4, duration: 0.35, waveType: 'square' },
          { freq: F4, duration: 0.25, waveType: 'square' },
          { freq: E4, duration: 0.25, waveType: 'square' },
          { freq: D4, duration: 0.45, waveType: 'square' },
          { freq: 0, duration: 0.2 },
          { freq: G4, duration: 0.3, waveType: 'square' },
          { freq: F4, duration: 0.25, waveType: 'square' },
          { freq: E4, duration: 0.25, waveType: 'square' },
          { freq: C4, duration: 0.6, waveType: 'square' },
          { freq: 0, duration: 0.4 },
        ];

      case 'shaktimaan':
        // Shaktimaan energy theme
        return [
          { freq: D4, duration: 0.2, waveType: 'sawtooth' },
          { freq: D4, duration: 0.2, waveType: 'sawtooth' },
          { freq: F4, duration: 0.3, waveType: 'sawtooth' },
          { freq: G4, duration: 0.3, waveType: 'sawtooth' },
          { freq: A4, duration: 0.4, waveType: 'sawtooth' },
          { freq: 0, duration: 0.1 },
          { freq: A4, duration: 0.25, waveType: 'sawtooth' },
          { freq: G4, duration: 0.25, waveType: 'sawtooth' },
          { freq: F4, duration: 0.25, waveType: 'sawtooth' },
          { freq: D4, duration: 0.6, waveType: 'sawtooth' },
          { freq: 0, duration: 0.3 },
        ];

      case 'indipop':
      default:
        // Euphoric 90s Indipop Arpeggio
        return [
          { freq: C4, duration: 0.3, waveType: 'triangle' },
          { freq: E4, duration: 0.3, waveType: 'triangle' },
          { freq: G4, duration: 0.3, waveType: 'triangle' },
          { freq: B4, duration: 0.35, waveType: 'triangle' },
          { freq: A4, duration: 0.35, waveType: 'triangle' },
          { freq: F4, duration: 0.3, waveType: 'triangle' },
          { freq: D4, duration: 0.35, waveType: 'triangle' },
          { freq: G4, duration: 0.6, waveType: 'triangle' },
          { freq: 0, duration: 0.4 },
        ];
    }
  }

  // --- Continuous Ambient Layers ---

  public setAmbientVolume(layerId: string, volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (!this.ambientGains[layerId]) {
      this.startAmbientGenerator(layerId);
    }

    if (this.ambientGains[layerId]) {
      this.ambientGains[layerId].gain.setTargetAtTime(
        this.isMuted ? 0 : Math.max(0, Math.min(1, volume * 0.4)),
        this.ctx.currentTime,
        0.1
      );
    }
  }

  private startAmbientGenerator(layerId: string) {
    if (!this.ctx || !this.masterGain) return;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.connect(this.masterGain);
    this.ambientGains[layerId] = gain;

    if (layerId === 'fan') {
      // Ceiling fan hum + rotating rhythm
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 68; // 68Hz electrical hum

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 2.4; // 2.4 blades per second whoosh
      lfoGain.gain.value = 0.2;
      lfo.connect(lfoGain.gain);

      osc.connect(gain);
      osc.start();
      lfo.start();
      this.ambientNodes[layerId] = { stop: () => { osc.stop(); lfo.stop(); } };

    } else if (layerId === 'rain') {
      // Monsoon Rain on tin roof (filtered white noise)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1100;

      noise.connect(filter);
      filter.connect(gain);
      noise.start();
      this.ambientNodes[layerId] = { stop: () => noise.stop() };

    } else if (layerId === 'cooker') {
      // Distant Pressure Cooker occasional steam release
      let isAlive = true;
      const triggerWhistle = () => {
        if (!isAlive || !this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const whistleGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.linearRampToValueAtTime(1900, t + 0.3);
        osc.frequency.linearRampToValueAtTime(1500, t + 1.2);

        whistleGain.gain.setValueAtTime(0.001, t);
        whistleGain.gain.linearRampToValueAtTime(0.18, t + 0.2);
        whistleGain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

        osc.connect(whistleGain);
        whistleGain.connect(gain);
        osc.start(t);
        osc.stop(t + 1.4);

        // Schedule next in 12-25 seconds
        setTimeout(triggerWhistle, 12000 + Math.random() * 13000);
      };
      setTimeout(triggerWhistle, 4000);
      this.ambientNodes[layerId] = { stop: () => { isAlive = false; } };

    } else if (layerId === 'koel') {
      // Evening Koel & Crickets chirping
      let isAlive = true;
      const triggerKoel = () => {
        if (!isAlive || !this.ctx) return;
        const t = this.ctx.currentTime;
        // Two "Koo-Ooo" rising whistles
        for (let i = 0; i < 2; i++) {
          const osc = this.ctx.createOscillator();
          const kGain = this.ctx.createGain();
          const startTime = t + i * 0.45;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1100, startTime);
          osc.frequency.exponentialRampToValueAtTime(2100, startTime + 0.35);

          kGain.gain.setValueAtTime(0.001, startTime);
          kGain.gain.linearRampToValueAtTime(0.12, startTime + 0.15);
          kGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

          osc.connect(kGain);
          kGain.connect(gain);
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        }
        setTimeout(triggerKoel, 9000 + Math.random() * 11000);
      };
      setTimeout(triggerKoel, 3000);
      this.ambientNodes[layerId] = { stop: () => { isAlive = false; } };

    } else if (layerId === 'gola') {
      // Ice Gola Cart Brass Bell (ding-ding-ding)
      let isAlive = true;
      const triggerBell = () => {
        if (!isAlive || !this.ctx) return;
        const t = this.ctx.currentTime;
        for (let i = 0; i < 3; i++) {
          const osc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          const startTime = t + i * 0.18;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2800 + i * 150, startTime);
          bGain.gain.setValueAtTime(0.15, startTime);
          bGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
          osc.connect(bGain);
          bGain.connect(gain);
          osc.start(startTime);
          osc.stop(startTime + 0.3);
        }
        setTimeout(triggerBell, 14000 + Math.random() * 16000);
      };
      setTimeout(triggerBell, 6000);
      this.ambientNodes[layerId] = { stop: () => { isAlive = false; } };

    } else if (layerId === 'crthum') {
      // CRT 50Hz mains hum + 15.6kHz flyback coil whine
      const osc50 = this.ctx.createOscillator();
      const osc15k = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      osc50.type = 'sine';
      osc50.frequency.value = 50;
      osc15k.type = 'sine';
      osc15k.frequency.value = 15625;
      humGain.gain.value = 0.4;
      osc50.connect(humGain);
      osc15k.connect(humGain);
      humGain.connect(gain);
      osc50.start();
      osc15k.start();
      this.ambientNodes[layerId] = { stop: () => { osc50.stop(); osc15k.stop(); } };

    } else if (layerId === 'keyboard') {
      // Periodic IBM model M / TVS Gold mechanical keyboard typing clicks
      let isAlive = true;
      const triggerTyping = () => {
        if (!isAlive || !this.ctx) return;
        const burstCount = Math.floor(Math.random() * 6) + 3;
        const t = this.ctx.currentTime;
        for (let i = 0; i < burstCount; i++) {
          const osc = this.ctx.createOscillator();
          const keyGain = this.ctx.createGain();
          const clickTime = t + i * (0.08 + Math.random() * 0.05);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200 + Math.random() * 800, clickTime);
          keyGain.gain.setValueAtTime(0.08, clickTime);
          keyGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.03);
          osc.connect(keyGain);
          keyGain.connect(gain);
          osc.start(clickTime);
          osc.stop(clickTime + 0.035);
        }
        setTimeout(triggerTyping, 1200 + Math.random() * 2500);
      };
      setTimeout(triggerTyping, 500);
      this.ambientNodes[layerId] = { stop: () => { isAlive = false; } };

    } else if (layerId === 'radiostatic') {
      // Analog AM/FM Tuning static and subtle whistling
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 2.5;
      noise.connect(filter);
      filter.connect(gain);
      noise.start();
      this.ambientNodes[layerId] = { stop: () => noise.stop() };

    } else if (layerId === 'traffic') {
      // Distant Indian traffic, Bajaj Chetak scooter rumble and gentle horns
      let isAlive = true;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 55;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 220;
      osc.connect(filter);
      filter.connect(gain);
      osc.start();

      const triggerHorn = () => {
        if (!isAlive || !this.ctx) return;
        const t = this.ctx.currentTime;
        const hOsc1 = this.ctx.createOscillator();
        const hOsc2 = this.ctx.createOscillator();
        const hGain = this.ctx.createGain();
        hOsc1.type = 'triangle';
        hOsc2.type = 'triangle';
        hOsc1.frequency.value = 420;
        hOsc2.frequency.value = 520;
        hGain.gain.setValueAtTime(0.04, t);
        hGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        hOsc1.connect(hGain);
        hOsc2.connect(hGain);
        hGain.connect(gain);
        hOsc1.start(t);
        hOsc2.start(t);
        hOsc1.stop(t + 0.38);
        hOsc2.stop(t + 0.38);
        setTimeout(triggerHorn, 6000 + Math.random() * 8000);
      };
      setTimeout(triggerHorn, 3000);
      this.ambientNodes[layerId] = { stop: () => { isAlive = false; osc.stop(); } };

    } else if (layerId === 'bus') {
      // Tata / Ashok Leyland State Roadways Diesel Engine vibration & chassis rattle
      const osc = this.ctx.createOscillator();
      const oscMod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 42;
      oscMod.frequency.value = 6.5; // engine cycle vibration
      modGain.gain.value = 12;
      oscMod.connect(osc.frequency);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;
      osc.connect(filter);
      filter.connect(gain);
      osc.start();
      oscMod.start();
      this.ambientNodes[layerId] = { stop: () => { osc.stop(); oscMod.stop(); } };

    } else if (layerId === 'train') {
      // Indian Railways ICF Sleeper coach rhythmic "dhadak-dhadak" joint clacks
      let isAlive = true;
      const triggerClack = () => {
        if (!isAlive || !this.ctx) return;
        const t = this.ctx.currentTime;
        // Two pairs of wheel clacks
        const delays = [0, 0.12, 0.42, 0.54];
        delays.forEach(d => {
          const osc = this.ctx!.createOscillator();
          const clackGain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(95, t + d);
          osc.frequency.exponentialRampToValueAtTime(30, t + d + 0.08);
          clackGain.gain.setValueAtTime(0.18, t + d);
          clackGain.gain.exponentialRampToValueAtTime(0.001, t + d + 0.08);
          osc.connect(clackGain);
          clackGain.connect(gain);
          osc.start(t + d);
          osc.stop(t + d + 0.09);
        });
        setTimeout(triggerClack, 1400);
      };
      setTimeout(triggerClack, 200);

      // Distant WDM-2 Diesel Loco Horn occasionally
      const triggerWhistle = () => {
        if (!isAlive || !this.ctx) return;
        const t = this.ctx.currentTime;
        const horn1 = this.ctx.createOscillator();
        const horn2 = this.ctx.createOscillator();
        const hGain = this.ctx.createGain();
        horn1.type = 'sine';
        horn2.type = 'sine';
        horn1.frequency.value = 311.13; // D#4
        horn2.frequency.value = 370.00; // F#4
        hGain.gain.setValueAtTime(0.001, t);
        hGain.gain.linearRampToValueAtTime(0.12, t + 0.3);
        hGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
        horn1.connect(hGain);
        horn2.connect(hGain);
        hGain.connect(gain);
        horn1.start(t);
        horn2.start(t);
        horn1.stop(t + 1.9);
        horn2.stop(t + 1.9);
        setTimeout(triggerWhistle, 16000 + Math.random() * 12000);
      };
      setTimeout(triggerWhistle, 5000);
      this.ambientNodes[layerId] = { stop: () => { isAlive = false; } };

    } else if (layerId === 'schoolbell') {
      // Brass Gong School Bell (3 sharp resonant rings)
      let isAlive = true;
      const triggerBell = () => {
        if (!isAlive || !this.ctx) return;
        const t = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          const startTime = t + i * 0.45;
          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(1050, startTime);
          osc2.frequency.setValueAtTime(2120, startTime);
          bGain.gain.setValueAtTime(0.18, startTime);
          bGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
          osc1.connect(bGain);
          osc2.connect(bGain);
          bGain.connect(gain);
          osc1.start(startTime);
          osc2.start(startTime);
          osc1.stop(startTime + 0.85);
          osc2.stop(startTime + 0.85);
        }
        setTimeout(triggerBell, 18000 + Math.random() * 15000);
      };
      setTimeout(triggerBell, 2000);
      this.ambientNodes[layerId] = { stop: () => { isAlive = false; } };

    } else if (layerId === 'crickets') {
      // Night Crickets pulsating high frequency chorus
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 4600;
      lfo.type = 'square';
      lfo.frequency.value = 7.5;
      lfoGain.gain.value = 0.5;
      lfo.connect(osc.frequency);
      osc.connect(gain);
      osc.start();
      lfo.start();
      this.ambientNodes[layerId] = { stop: () => { osc.stop(); lfo.stop(); } };

    } else if (layerId === 'tapedrive') {
      // Walkman / Cassette player mechanical capstan motor whir
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 115;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 120;
      filter.Q.value = 3;
      osc.connect(filter);
      filter.connect(gain);
      osc.start();
      this.ambientNodes[layerId] = { stop: () => osc.stop() };
    }
  }

  public setMasterVolume(vol: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, vol));
    if (!this.isMuted) {
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  public stopAllAmbient() {
    Object.keys(this.ambientGains).forEach((key) => {
      this.setAmbientVolume(key, 0);
    });
  }

  public applySoundscapePreset(preset: 'summer-afternoon' | 'bus-journey' | 'rainy-evening' | 'computer-room' | 'train-journey' | 'dd-evening' | 'school-recess') {
    this.stopAllAmbient();
    const configMap: Record<string, Record<string, number>> = {
      'summer-afternoon': { fan: 0.65, cooker: 0.25, gola: 0.4, traffic: 0.15 },
      'bus-journey': { bus: 0.7, traffic: 0.35, radiostatic: 0.2 },
      'rainy-evening': { rain: 0.75, cooker: 0.15, koel: 0.2 },
      'computer-room': { crthum: 0.55, keyboard: 0.6, tapedrive: 0.2 },
      'train-journey': { train: 0.8, traffic: 0.1 },
      'dd-evening': { crthum: 0.45, koel: 0.4, fan: 0.3 },
      'school-recess': { schoolbell: 0.6, traffic: 0.2, fan: 0.2 }
    };

    const targetConfig = configMap[preset] || {};
    Object.entries(targetConfig).forEach(([layerId, vol]) => {
      this.setAmbientVolume(layerId, vol);
    });
  }

  public playTimeWarpWhoosh() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.7);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  public playCheeringCrowd() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / 100);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(1200, now + 0.8);
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 1.5);
  }
}

export const audioSynthesizer = new AudioSynthesizerEngine();
