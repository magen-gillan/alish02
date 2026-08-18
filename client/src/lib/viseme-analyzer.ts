/*
 * alish02 / Browser-native viseme analyzer.
 * Inspired by the MIT-licensed Amoner lipsync-engine frequency pipeline;
 * adapted locally so GitHub Pages needs no npm runtime or server endpoint.
 */

export type VisemeKey = "sil" | "aa" | "E" | "I" | "O" | "U" | "FF" | "SS" | "CH" | "PP" | "DD" | "nn";

export type VisemeFrame = {
  viseme: VisemeKey;
  intensity: number;
  confidence: number;
  amplitude: number;
  bands: { sub: number; low: number; mid: number; high: number; veryHigh: number };
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (from: number, to: number, amount: number) => from + (to - from) * amount;

export class VisemeAnalyzer {
  private readonly analyser: AnalyserNode;
  private readonly sampleRate: number;
  private readonly timeData: Uint8Array;
  private readonly frequencyData: Uint8Array;
  private amplitude = 0;
  private bands = { sub: 0, low: 0, mid: 0, high: 0, veryHigh: 0 };
  private current: VisemeKey = "sil";
  private hold = 0;

  constructor(analyser: AnalyserNode, sampleRate: number) {
    this.analyser = analyser;
    this.sampleRate = sampleRate;
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.62;
    this.timeData = new Uint8Array(this.analyser.fftSize);
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  analyze(): VisemeFrame {
    this.analyser.getByteTimeDomainData(this.timeData);
    this.analyser.getByteFrequencyData(this.frequencyData);

    let sum = 0;
    for (let index = 0; index < this.timeData.length; index += 1) {
      const sample = (this.timeData[index] - 128) / 128;
      sum += sample * sample;
    }
    const rawAmplitude = Math.sqrt(sum / this.timeData.length);
    this.amplitude = smooth(this.amplitude, rawAmplitude, 0.32);

    const rawBands = {
      sub: this.band(80, 250),
      low: this.band(250, 700),
      mid: this.band(700, 1800),
      high: this.band(1800, 4200),
      veryHigh: this.band(4200, 8000),
    };
    (Object.keys(rawBands) as Array<keyof typeof rawBands>).forEach((key) => {
      this.bands[key] = smooth(this.bands[key], rawBands[key], 0.35);
    });

    const intensity = clamp(this.amplitude * 3.4);
    const candidate = intensity < 0.055 ? "sil" : this.classify(intensity);
    if (candidate !== this.current) {
      this.hold += 1;
      if (this.hold >= 2) {
        this.current = candidate;
        this.hold = 0;
      }
    } else {
      this.hold = 0;
    }

    return {
      viseme: this.current,
      intensity,
      amplitude: this.amplitude,
      confidence: this.confidence(),
      bands: { ...this.bands },
    };
  }

  reset() {
    this.amplitude = 0;
    this.current = "sil";
    this.hold = 0;
    this.bands = { sub: 0, low: 0, mid: 0, high: 0, veryHigh: 0 };
  }

  private band(lowHz: number, highHz: number) {
    const binHz = this.sampleRate / this.analyser.fftSize;
    const start = Math.max(0, Math.floor(lowHz / binHz));
    const end = Math.min(this.frequencyData.length - 1, Math.ceil(highHz / binHz));
    let total = 0;
    let count = 0;
    for (let index = start; index <= end; index += 1) {
      total += this.frequencyData[index] / 255;
      count += 1;
    }
    return count ? total / count : 0;
  }

  private classify(intensity: number): VisemeKey {
    const { sub, low, mid, high, veryHigh } = this.bands;
    const total = sub + low + mid + high + veryHigh + 0.001;
    const highRatio = (high + veryHigh) / total;
    if (highRatio > 0.58 && veryHigh > high * 0.72) return "SS";
    if ((mid + high) / total > 0.54 && high > 0.12 && low < 0.18) return "FF";
    if (intensity > 0.74 && Math.abs(high - low) / total < 0.24) return low > mid ? "PP" : "DD";
    if (sub > 0.2 && low > 0.14 && mid < low * 0.72 && high < 0.12) return "nn";
    if (low > 0.22 && mid > 0.16 && intensity > 0.4) return "aa";
    if (mid > low * 1.08 && mid > 0.14) return "E";
    if (sub > mid * 1.12 && low > mid) return "O";
    if (mid > 0.1 && high > low * 0.45) return "I";
    if (sub > 0.14 && high < 0.08) return "U";
    return intensity > 0.5 ? "aa" : intensity > 0.24 ? "I" : "sil";
  }

  private confidence() {
    const { sub, low, mid, high, veryHigh } = this.bands;
    const peak = Math.max(sub, low, mid, high, veryHigh);
    return clamp(0.35 + peak * 0.8);
  }
}
