let AC: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (!AC) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        AC = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }
  if (AC && AC.state === 'suspended') {
    AC.resume().catch(() => {});
  }
  return AC;
}

export function tone(
  freq: number,
  dur: number,
  type: OscillatorType = 'sine',
  vol = 0.1,
  slideTo: number | null = null
): void {
  const ac = getAudioContext();
  if (!ac) return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ac.currentTime);
  if (slideTo) {
    o.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), ac.currentTime + dur);
  }
  g.gain.setValueAtTime(vol, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  o.connect(g);
  g.connect(ac.destination);
  o.start();
  o.stop(ac.currentTime + dur);
}

export function noiseBurst(dur: number, vol: number, cutoff = 1500): void {
  const ac = getAudioContext();
  if (!ac) return;
  const b = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  }
  const s = ac.createBufferSource();
  s.buffer = b;
  const f = ac.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = cutoff;
  const g = ac.createGain();
  g.gain.value = vol;
  s.connect(f);
  f.connect(g);
  g.connect(ac.destination);
  s.start();
}

const sfxMethods = {
  bolter(): void {
    tone(190, 0.14, 'sawtooth', 0.12, 60);
    noiseBurst(0.12, 0.14, 2500);
  },
  powerWeapon(): void {
    tone(320, 0.22, 'triangle', 0.18, 110);
    tone(640, 0.18, 'sine', 0.12, 220);
  },
  chainsword(): void {
    tone(220, 0.25, 'sawtooth', 0.15, 90);
    noiseBurst(0.2, 0.1, 3500);
  },
  hit(): void {
    noiseBurst(0.1, 0.15, 1200);
  },
  death(): void {
    tone(160, 0.5, 'sawtooth', 0.2, 35);
    noiseBurst(0.4, 0.2, 600);
  },
  select(): void {
    tone(560, 0.06, 'sine', 0.08);
  },
  click(): void {
    tone(440, 0.04, 'sine', 0.06);
  },
  turn(): void {
    tone(280, 0.3, 'sine', 0.12, 440);
  },
  dice(): void {
    tone(800 + Math.random() * 200, 0.04, 'triangle', 0.05);
  },
  teleport(): void {
    tone(300, 0.4, 'sine', 0.18, 950);
    noiseBurst(0.25, 0.12, 4000);
  },
  horn(): void {
    tone(220, 0.6, 'sawtooth', 0.2, 180);
    tone(440, 0.5, 'sine', 0.1, 350);
  },
  explosion(): void {
    tone(90, 0.6, 'sawtooth', 0.25, 30);
    noiseBurst(0.6, 0.25, 800);
  },
  footsteps(): void {
    noiseBurst(0.04, 0.06, 1000);
  }
};

type SfxFunction = ((name?: string) => void) & typeof sfxMethods;

const sfxCallable = function (name?: string) {
  if (!name) {
    sfxMethods.click();
    return;
  }
  const fn = (sfxMethods as Record<string, () => void>)[name];
  if (typeof fn === 'function') {
    fn();
  } else {
    sfxMethods.click();
  }
} as SfxFunction;

Object.assign(sfxCallable, sfxMethods);

export const sfx = sfxCallable;
