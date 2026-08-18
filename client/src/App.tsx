/*
 * alish02 / Alisha-inspired VRM studio: actual licensed VRM avatars are the product surface.
 * Keep the dark observatory field, asymmetric stage, compact rail, and local-first controls.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, type Group } from "three";
import {
  Aperture,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Gauge,
  Menu,
  Moon,
  RotateCcw,
  Settings2,
  Sparkles,
  Sun,
  Volume2,
  X,
} from "lucide-react";
import "./index.css";

type VrmAvatarDefinition = {
  id: string;
  name: string;
  role: string;
  descriptor: string;
  signal: string;
  accent: string;
  badge: string;
  modelUrl: string;
  sourceUrl: string;
  license: string;
};

const runtimeModelUrl = (localPath: string, publicUrl: string) => import.meta.env.BASE_URL === "/" ? localPath : publicUrl;

const vrmAvatars: VrmAvatarDefinition[] = [
  {
    id: "rose-057",
    name: "Rose",
    role: "Signal Gardener",
    descriptor: "A CC0 VRM presence for patient conversations and careful exploration.",
    signal: "VRM-057",
    accent: "#ef9fca",
    badge: "ROSE",
    modelUrl: runtimeModelUrl("/manus-storage/rose_93bab3dc.vrm", "https://arweave.net/Ea1KXujzJatQgCFSMzGOzp_UtHqB1pyia--U3AtkMAY"),
    sourceUrl: "https://github.com/toxsam/open-source-avatars",
    license: "CC0 · 100Avatars R1",
  },
  {
    id: "robert-070",
    name: "Robert",
    role: "Archive Operator",
    descriptor: "A grounded VRM companion for files, context, and long-running research.",
    signal: "VRM-070",
    accent: "#86c8c4",
    badge: "MINT",
    modelUrl: runtimeModelUrl("/manus-storage/robert_9e232648.vrm", "https://arweave.net/gwG7w4bY-A5c3R6A6GOz3xBCgbPvkFQmqPIDtvnNsYI"),
    sourceUrl: "https://github.com/toxsam/open-source-avatars",
    license: "CC0 · 100Avatars R1",
  },
  {
    id: "rabbit-059",
    name: "Rabbit",
    role: "Systems Scout",
    descriptor: "A lighter, kinetic VRM profile for experiments and quick iteration.",
    signal: "VRM-059",
    accent: "#b6a5ff",
    badge: "VIOLET",
    modelUrl: runtimeModelUrl("/manus-storage/rabbit_7383b0ff.vrm", "https://arweave.net/RymRtrmhHx_f9ZDvtvIQb1noTHvILdjoTg5G7L2DR-8"),
    sourceUrl: "https://github.com/toxsam/open-source-avatars",
    license: "CC0 · 100Avatars R1",
  },
];

function readStoredAvatar(): string {
  if (typeof window === "undefined") return vrmAvatars[0].id;
  try {
    const value = window.localStorage.getItem("alish02-vrm-avatar");
    return vrmAvatars.some((avatar) => avatar.id === value) ? value! : vrmAvatars[0].id;
  } catch {
    return vrmAvatars[0].id;
  }
}

function readStoredMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem("alish02-motion") !== "off";
  } catch {
    return true;
  }
}

function disposeVrm(vrm: VRM) {
  vrm.scene.traverse((object) => {
    const mesh = object as { geometry?: { dispose?: () => void }; material?: unknown };
    mesh.geometry?.dispose?.();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const disposable = material as { dispose?: () => void } | undefined;
      disposable?.dispose?.();
    });
  });
}

function VrmAvatar({ avatar, motion, mouthOpen, onStatus }: { avatar: VrmAvatarDefinition; motion: boolean; mouthOpen: React.MutableRefObject<number>; onStatus: (status: "loading" | "ready" | "error") => void }) {
  const root = useRef<Group>(null);
  const vrmRef = useRef<VRM | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    onStatus("loading");
    loader.load(
      avatar.modelUrl,
      (gltf) => {
        if (cancelled) return;
        const vrm = gltf.userData.vrm as VRM | undefined;
        if (!vrm || !root.current) {
          onStatus("error");
          return;
        }
        vrm.scene.rotation.y = Math.PI;
        root.current.add(vrm.scene);
        vrmRef.current = vrm;
        onStatus("ready");
      },
      undefined,
      () => {
        if (!cancelled) onStatus("error");
      },
    );
    return () => {
      cancelled = true;
      if (vrmRef.current && root.current) {
        root.current.remove(vrmRef.current.scene);
        disposeVrm(vrmRef.current);
      }
      vrmRef.current = null;
    };
  }, [avatar.modelUrl, onStatus]);

  useFrame(({ clock }, delta) => {
    const vrm = vrmRef.current;
    if (!vrm || !root.current) return;
    vrm.update(delta);
    const targetRotation = motion ? Math.sin(clock.elapsedTime * 0.38) * 0.11 : 0;
    root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, targetRotation, 0.045);
    root.current.position.y = motion ? Math.sin(clock.elapsedTime * 1.15) * 0.035 : 0;
    vrm.expressionManager?.setValue("aa", mouthOpen.current);
    vrm.expressionManager?.setValue("oh", mouthOpen.current * 0.35);
  });

  return <group ref={root} position={[0, -1.7, 0]} scale={2.55} />;
}

function VrmStage({ avatar, motion, mouthOpen, onStatus }: { avatar: VrmAvatarDefinition; motion: boolean; mouthOpen: React.MutableRefObject<number>; onStatus: (status: "loading" | "ready" | "error") => void }) {
  return (
    <Canvas shadows dpr={[1, 1.65]} camera={{ position: [0, 0.15, 7.4], fov: 39 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#171615"]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 5, 4]} intensity={3.2} color="#fff0d2" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={3.5} color={avatar.accent} distance={7} />
      <pointLight position={[3, 0, -2]} intensity={2} color="#a8b6ff" distance={5} />
      <VrmAvatar avatar={avatar} motion={motion} mouthOpen={mouthOpen} onStatus={onStatus} />
      <ContactShadows position={[0, -2.36, 0]} opacity={0.48} scale={4.2} blur={2.4} far={4} color="#000000" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 1.9} autoRotate={motion} autoRotateSpeed={0.38} />
    </Canvas>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState(readStoredAvatar);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [motion, setMotion] = useState(readStoredMotion);
  const [dark, setDark] = useState(true);
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("No voice clip loaded");
  const mouthOpen = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const selected = useMemo(() => vrmAvatars.find((avatar) => avatar.id === selectedId) ?? vrmAvatars[0], [selectedId]);
  const selectedIndex = vrmAvatars.findIndex((avatar) => avatar.id === selected.id);
  const pagesBase = import.meta.env.BASE_URL;
  const markSrc = pagesBase === "/" ? "/manus-storage/alish02-mark_82607bd3.png" : `${pagesBase}alish02-mark.svg`;
  const stageBackground = pagesBase === "/" ? "/manus-storage/alish02-observatory-bg_c2146f3f.jpg" : `${pagesBase}observatory-bg.svg`;

  useEffect(() => {
    try {
      window.localStorage.setItem("alish02-vrm-avatar", selectedId);
    } catch {
      // The selection remains usable in memory when storage is unavailable.
    }
  }, [selectedId]);

  useEffect(() => {
    try {
      window.localStorage.setItem("alish02-motion", motion ? "on" : "off");
    } catch {
      // The motion toggle remains usable in memory.
    }
  }, [motion]);

  useEffect(() => {
    let raf = 0;
    const sample = () => {
      const analyser = analyserRef.current;
      if (analyser) {
        const values = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(values);
        let sum = 0;
        for (let index = 0; index < values.length; index += 1) {
          const normalized = (values[index] - 128) / 128;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / values.length);
        mouthOpen.current = Math.min(1, Math.max(0, (rms - 0.018) * 8.5));
      } else {
        mouthOpen.current = 0;
      }
      raf = requestAnimationFrame(sample);
    };
    sample();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioContextRef.current?.close().catch(() => undefined);
  }, [audioUrl]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [settingsOpen]);

  const changeAvatar = (direction: number) => {
    const next = (selectedIndex + direction + vrmAvatars.length) % vrmAvatars.length;
    setSelectedId(vrmAvatars[next].id);
    setModelStatus("loading");
  };

  const onVoiceFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(file));
    setAudioName(file.name);
  };

  const prepareAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyser.connect(context.destination);
      audioContextRef.current = context;
      sourceRef.current = source;
      analyserRef.current = analyser;
    }
    await audioContextRef.current.resume();
    await audio.play();
  };

  const resetSession = () => {
    setSelectedId(vrmAvatars[0].id);
    setMotion(true);
    setModelStatus("loading");
    try {
      window.localStorage.removeItem("alish02-vrm-avatar");
    } catch {
      // Ignore restricted storage.
    }
  };

  const statusLabel = modelStatus === "ready" ? "READY" : modelStatus === "loading" ? "LOADING" : "ERROR";
  return (
    <main className={dark ? "app-shell" : "app-shell light-mode"}>
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><img src={markSrc} alt="" /></div><div className="wordmark"><strong>alish<sup>02</sup></strong><span>VRM PRESENCE STUDIO</span></div></div>
        <div className="top-meta"><span className="live-dot" /> LOCAL VRM COLLECTION <span className="mono">v0.2 / LIP-SYNC READY</span></div>
        <button className="settings-trigger" onClick={() => setSettingsOpen(true)} aria-label="فتح إعدادات الافتار"><Settings2 size={17} /> Settings</button>
      </header>

      <div className="layout">
        <aside className="rail"><div className="rail-top"><button className="icon-button" aria-label="فتح قائمة الافتارات"><Menu size={18} /></button><span className="vertical-label">VRM ARCHIVE / 03</span></div><div className="rail-bottom"><button className="icon-button" onClick={() => setDark((value) => !value)} aria-label="تبديل السمة">{dark ? <Sun size={17} /> : <Moon size={17} />}</button><button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="فتح الإعدادات"><CircleHelp size={17} /></button></div></aside>

        <section className="content">
          <div className="intro-row"><div><p className="eyebrow">OPEN-SOURCE VRM STUDY · 2026</p><h1>Choose your<br /><em>digital presence.</em></h1></div><div className="intro-note"><span className="rule" />Actual VRM characters.<br />Audio-aware expressions.</div></div>

          <div className="stage-grid">
            <div className="stage-wrap"><div className="stage-meta"><span><Aperture size={14} /> STAGE / {selected.signal}</span><span className="mono">{selected.badge} SIGNAL</span></div><div className="stage" style={{ backgroundImage: `linear-gradient(180deg, rgba(23,22,21,.12), rgba(23,22,21,.58)), url('${stageBackground}')` }}><VrmStage avatar={selected} motion={motion} mouthOpen={mouthOpen} onStatus={setModelStatus} />{modelStatus !== "ready" && <div className="stage-state" role="status"><span className="stage-state-pulse" />{modelStatus === "loading" ? "LOADING VRM" : "MODEL ERROR"}</div>}<div className="model-source-card"><div className="vrm-glyph">VRM</div><div><span className="eyebrow">ACTUAL MODEL</span><strong>{selected.name}</strong><small>{selected.license}</small></div></div><div className="status-rail"><span className={modelStatus === "ready" ? "status-ready" : ""}><i /> {statusLabel}</span><span>{mouthOpen.current > 0.08 ? "SPEAKING" : "LISTENING"}</span><span>WEBGL 2</span></div><div className="stage-corner top-left" /><div className="stage-corner bottom-right" /><div className="stage-coordinate">{selected.sourceUrl.replace("https://", "").slice(0, 29)}</div></div><div className="stage-controls"><button onClick={() => changeAvatar(-1)} aria-label="الافتار السابق"><ChevronLeft size={18} /></button><div><span className="mono">0{selectedIndex + 1} / 0{vrmAvatars.length}</span><strong>{selected.name}</strong></div><button onClick={() => changeAvatar(1)} aria-label="الافتار التالي"><ChevronRight size={18} /></button></div></div>
            <aside className="info-panel"><div className="panel-kicker"><span className="signal-line" /> CURRENT VRM <span className="status-chip"><i /> {statusLabel}</span></div><div className="subject-name"><span>{selected.signal}</span><h2>{selected.name}</h2><p>{selected.role}</p></div><p className="descriptor">{selected.descriptor}</p><div className="stats"><div><span>FORMAT</span><strong>VRM 0 / GLTF</strong></div><div><span>LICENSE</span><strong>{selected.license}</strong></div><div><span>LIP-SYNC</span><strong>RMS · AA / OH</strong></div><div><span>STATUS</span><strong className="ready"><Check size={13} /> {statusLabel}</strong></div></div><button className="switch-button" onClick={() => setSettingsOpen(true)}>Configure presence <ArrowUpRight size={16} /></button><div className="panel-footer"><Gauge size={14} /> 60 FPS TARGET <span>·</span> VRM EXPRESSION MANAGER</div></aside>
          </div>

          <div className="collection-strip"><div className="strip-title"><span className="eyebrow">VRM COLLECTION INDEX / 003</span><strong>Real characters, not portraits.</strong><div className="archive-ticks"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="avatar-tabs">{vrmAvatars.map((avatar) => <button key={avatar.id} className={avatar.id === selected.id ? "avatar-tab active" : "avatar-tab"} onClick={() => { setSelectedId(avatar.id); setModelStatus("loading"); }}><span className="tab-number">{avatar.signal}</span><span><strong>{avatar.name}</strong><small>{avatar.role}</small></span><span className="tab-swatch" style={{ background: avatar.accent }} /></button>)}</div></div>
        </section>
      </div>

      {settingsOpen && <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}><aside className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="presence-settings-title" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">CONTROL ROOM</span><h2 id="presence-settings-title">Presence settings</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="إغلاق الإعدادات"><X size={18} /></button></div><p className="drawer-copy">Switch the actual VRM character, then feed a voice clip to the expression manager.</p><div className="drawer-section"><span className="drawer-label">ACTUAL VRM AVATAR</span>{vrmAvatars.map((avatar) => <button key={avatar.id} className={avatar.id === selected.id ? "drawer-avatar selected" : "drawer-avatar"} onClick={() => { setSelectedId(avatar.id); setModelStatus("loading"); }}><span className="drawer-index">{avatar.signal}</span><span><strong>{avatar.name}</strong><small>{avatar.role} · {avatar.license}</small></span>{avatar.id === selected.id && <Check size={16} />}</button>)}</div><div className="drawer-section voice-section"><span className="drawer-label">LIP-SYNC INPUT</span><label className="audio-picker"><Volume2 size={16} /><span><strong>{audioName}</strong><small>Choose a WAV, MP3, or WebM voice clip</small></span><input type="file" accept="audio/*" onChange={onVoiceFile} /></label>{audioUrl && <div className="audio-controls"><audio ref={audioRef} src={audioUrl} controls onEnded={() => { mouthOpen.current = 0; }} /><button className="primary-audio-button" onClick={prepareAudio}>Play + sync lips</button></div>}<p className="drawer-hint">Mouth openness is driven from the playing audio RMS and mapped to the VRM AA/OH expressions.</p></div><div className="drawer-section"><span className="drawer-label">MOTION PROFILE</span><button className="toggle-row" onClick={() => setMotion((value) => !value)}><span><strong>Ambient movement</strong><small>Idle drift and auto-rotation</small></span><span className={motion ? "toggle on" : "toggle"}><i /></span></button></div><div className="drawer-section"><span className="drawer-label">SESSION</span><button className="reset-button" onClick={resetSession}><RotateCcw size={15} /> Reset to Rose baseline</button></div><div className="drawer-note"><Sparkles size={15} /> Models are loaded from the CC0 Open Source Avatars catalog. No raw portrait images are used in the stage.</div></aside></div>}
    </main>
  );
}

export default App;
