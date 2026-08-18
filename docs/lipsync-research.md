# Lip-sync research

## Selected direction

The project will keep a browser-native approach suitable for GitHub Pages: Web Audio analysis plus a viseme mapping layer for VRM expressions, with RMS fallback when phoneme timing is unavailable.

## Sources reviewed

- [Amoner/lipsync-engine](https://github.com/Amoner/lipsync-engine): MIT-licensed, renderer-agnostic browser library using AudioWorklet/Web Audio and a FrequencyAnalyzer with 15 extended visemes. It requires a same-origin worklet asset and user gesture for AudioContext initialization.
- [Wawa Sensei real-time lipsync tutorial](https://wawasensei.dev/tuto/real-time-lipsync-web): describes the open-source `wawa-lipsync` approach with React Three Fiber, Three.js, Web Audio `AnalyserNode`, and browser-native viseme detection.

## Decision

For the current static Pages build, implement a self-contained viseme heuristic from spectral bands and amplitude, mapped to VRM `aa`, `ih`, `ou`, `ee`, and `oh`, plus blink, look-at, idle sway, and speech emphasis. A true language-aware phoneme timeline from arbitrary prerecorded audio requires a heavier WASM/ML model or a TTS provider that emits phoneme timestamps; this remains a later optional enhancement.
