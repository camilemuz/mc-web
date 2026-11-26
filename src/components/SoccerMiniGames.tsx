import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Target, Flame, Award, Play } from 'lucide-react';
import { playUiClick, playGoalCheer, playKickSound, playSaveSound } from '../utils/soundEffects';

type MiniGameMode = 'penalties' | 'juggle';

const PENALTY_BEST_STREAK_KEY = 'mc_penalty_best_streak';
const PENALTY_BEST_ROUND_KEY = 'mc_penalty_best_round';
const JUGGLE_BEST_KEY = 'mc_juggle_best';

const CANVAS_W = 460;
const CANVAS_H = 340;

// Goal geometry inside CANVAS_W x CANVAS_H
const GOAL = {
  left: 72,
  right: 388,
  top: 52,
  bottom: 204,
  width: 316,
  height: 152,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  color: string;
}

const readStoredNumber = (key: string): number => {
  try {
    const val = Number(localStorage.getItem(key));
    return Number.isFinite(val) && val > 0 ? Math.floor(val) : 0;
  } catch {
    return 0;
  }
};

const writeStoredNumber = (key: string, value: number) => {
  try {
    localStorage.setItem(key, String(Math.floor(value)));
  } catch {
    // Ignore storage errors
  }
};

// Shared helper: draw a detailed rotating soccer ball on 2D canvas
function drawSoccerBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  glowIntensity = 0
) {
  ctx.save();
  ctx.translate(x, y);

  if (glowIntensity > 0) {
    ctx.shadowColor = 'rgba(230, 0, 43, 0.85)';
    ctx.shadowBlur = 18 * glowIntensity;
  }

  // Base spherical gradient
  const grad = ctx.createRadialGradient(
    -radius * 0.32,
    -radius * 0.32,
    radius * 0.1,
    0,
    0,
    radius
  );
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.68, '#EAECEF');
  grad.addColorStop(1, '#AEB4BE');

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Clip panels inside circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.rotate(rotation);

  // Center crimson-dark pentagon
  const drawPentagon = (cx: number, cy: number, r: number, fill: string) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  drawPentagon(0, 0, radius * 0.36, '#141418');

  // Outer 5 crimson-accented pentagons + seam lines
  ctx.strokeStyle = 'rgba(20, 20, 24, 0.45)';
  ctx.lineWidth = Math.max(1, radius * 0.06);
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const ox = Math.cos(a) * radius * 0.88;
    const oy = Math.sin(a) * radius * 0.88;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * radius * 0.32, Math.sin(a) * radius * 0.32);
    ctx.lineTo(ox, oy);
    ctx.stroke();
    drawPentagon(ox, oy, radius * 0.32, i % 2 === 0 ? '#E6002B' : '#18181D');
  }

  ctx.restore();

  // Crisp outer rim
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Specular highlight
  ctx.beginPath();
  ctx.ellipse(-radius * 0.28, -radius * 0.32, radius * 0.26, radius * 0.14, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fill();

  ctx.restore();
}

export const SoccerMiniGames: React.FC = () => {
  const [gameMode, setGameMode] = useState<MiniGameMode>('penalties');

  // Persistent Records
  const [penaltyBestStreak, setPenaltyBestStreak] = useState<number>(() =>
    readStoredNumber(PENALTY_BEST_STREAK_KEY)
  );
  const [penaltyBestRound, setPenaltyBestRound] = useState<number>(() =>
    readStoredNumber(PENALTY_BEST_ROUND_KEY)
  );
  const [juggleBest, setJuggleBest] = useState<number>(() => readStoredNumber(JUGGLE_BEST_KEY));

  // Penalty Shootout UI State
  const [shotsHistory, setShotsHistory] = useState<Array<'goal' | 'miss' | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [penaltyScore, setPenaltyScore] = useState(0);
  const [penaltyStreak, setPenaltyStreak] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [penaltyBanner, setPenaltyBanner] = useState<{
    text: string;
    subtext?: string;
    tone: 'goal' | 'save' | 'record';
  } | null>(null);
  const [isShooting, setIsShooting] = useState(false);

  // Juggle UI State
  const [juggleScore, setJuggleScore] = useState(0);
  const [juggleState, setJuggleState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [newJuggleRecord, setNewJuggleRecord] = useState(false);
  const [juggleComboLabel, setJuggleComboLabel] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Penalty mutable animation state
  const penaltyRef = useRef({
    aimX: CANVAS_W / 2,
    aimY: 112,
    phase: 'aim' as 'aim' | 'flying' | 'result',
    shotProgress: 0,
    startX: CANVAS_W / 2,
    startY: 294,
    targetX: CANVAS_W / 2,
    targetY: 112,
    ballX: CANVAS_W / 2,
    ballY: 294,
    ballR: 22,
    ballRot: 0,
    trail: [] as Array<{ x: number; y: number; r: number }>,
    keeperX: CANVAS_W / 2,
    keeperY: 162,
    keeperTargetX: CANVAS_W / 2,
    keeperTargetY: 162,
    keeperDiveDir: 0,
    keeperDiveProgress: 0,
    outcome: null as 'goal' | 'save' | null,
    netRipple: 0,
    netHitX: CANVAS_W / 2,
    netHitY: 112,
    particles: [] as Particle[],
    deflectVx: 0,
    deflectVy: 0,
  });

  // Refs for latest React states inside callbacks
  const penaltyStreakRef = useRef(penaltyStreak);
  penaltyStreakRef.current = penaltyStreak;
  const penaltyBestStreakRef = useRef(penaltyBestStreak);
  penaltyBestStreakRef.current = penaltyBestStreak;
  const penaltyBestRoundRef = useRef(penaltyBestRound);
  penaltyBestRoundRef.current = penaltyBestRound;
  const shotsHistoryRef = useRef(shotsHistory);
  shotsHistoryRef.current = shotsHistory;
  const penaltyScoreRef = useRef(penaltyScore);
  penaltyScoreRef.current = penaltyScore;

  // Juggle mutable physics state
  const juggleRef = useRef({
    status: 'ready' as 'ready' | 'playing' | 'gameover',
    x: CANVAS_W / 2,
    y: 165,
    vx: 0,
    vy: 0,
    rot: 0,
    vrot: 0.02,
    radius: 30,
    score: 0,
    best: readStoredNumber(JUGGLE_BEST_KEY),
    beatenBestThisRun: false,
    particles: [] as Particle[],
    ripples: [] as Ripple[],
    glow: 0,
    floatTime: 0,
  });

  const fireGoalConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#E6002B', '#FFFFFF', '#F59E0B'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const resetPenaltyRound = useCallback(() => {
    playUiClick();
    setShotsHistory([null, null, null, null, null]);
    setPenaltyScore(0);
    setRoundComplete(false);
    setPenaltyBanner(null);
    setIsShooting(false);

    const p = penaltyRef.current;
    p.phase = 'aim';
    p.shotProgress = 0;
    p.ballX = CANVAS_W / 2;
    p.ballY = 294;
    p.ballR = 22;
    p.trail = [];
    p.keeperX = CANVAS_W / 2;
    p.keeperY = 162;
    p.keeperDiveDir = 0;
    p.keeperDiveProgress = 0;
    p.outcome = null;
    p.netRipple = 0;
  }, []);

  const shootPenaltyAt = useCallback(
    (rawX: number, rawY: number) => {
      const p = penaltyRef.current;
      if (p.phase !== 'aim' || roundComplete) return;

      // Clamp target cleanly inside the goal frame
      const targetX = Math.max(GOAL.left + 16, Math.min(GOAL.right - 16, rawX));
      const targetY = Math.max(GOAL.top + 16, Math.min(GOAL.bottom - 16, rawY));

      playKickSound();
      setIsShooting(true);
      setPenaltyBanner(null);

      p.phase = 'flying';
      p.shotProgress = 0;
      p.startX = CANVAS_W / 2;
      p.startY = 294;
      p.targetX = targetX;
      p.targetY = targetY;
      p.trail = [];

      // Goalkeeper AI: chooses left, center, or right dive with realistic sports challenge (~32% save chance)
      const zones = [GOAL.left + 50, CANVAS_W / 2, GOAL.right - 50];
      const smartGuess = Math.random() < 0.34;
      let chosenX: number;
      if (smartGuess) {
        chosenX = targetX + (Math.random() - 0.5) * 34;
      } else {
        chosenX = zones[Math.floor(Math.random() * zones.length)] + (Math.random() - 0.5) * 40;
      }
      chosenX = Math.max(GOAL.left + 32, Math.min(GOAL.right - 32, chosenX));

      const chosenY = Math.max(GOAL.top + 38, Math.min(GOAL.bottom - 26, targetY + (Math.random() - 0.5) * 46));
      p.keeperTargetX = chosenX;
      p.keeperTargetY = chosenY;
      p.keeperDiveDir = chosenX < CANVAS_W / 2 - 20 ? -1 : chosenX > CANVAS_W / 2 + 20 ? 1 : 0;
      p.keeperDiveProgress = 0;

      // Determine outcome based on keeper reach distance at impact
      const dist = Math.hypot(chosenX - targetX, (chosenY - targetY) * 1.15);
      const isSaved = dist < 44;
      p.outcome = isSaved ? 'save' : 'goal';
      p.deflectVx = (targetX < CANVAS_W / 2 ? -1 : 1) * (3 + Math.random() * 2.5);
      p.deflectVy = -2.5 - Math.random() * 2;
    },
    [roundComplete]
  );

  const resetJuggleGame = useCallback((autoStart = false) => {
    const j = juggleRef.current;
    j.x = CANVAS_W / 2;
    j.y = 155;
    j.vx = autoStart ? (Math.random() - 0.5) * 90 : 0;
    j.vy = autoStart ? -390 : 0;
    j.rot = 0;
    j.vrot = autoStart ? 0.14 : 0.02;
    j.score = autoStart ? 1 : 0;
    j.beatenBestThisRun = false;
    j.particles = [];
    j.ripples = [];
    j.glow = autoStart ? 1 : 0;
    j.status = autoStart ? 'playing' : 'ready';

    setJuggleScore(autoStart ? 1 : 0);
    setJuggleState(autoStart ? 'playing' : 'ready');
    setNewJuggleRecord(false);
    setJuggleComboLabel(null);

    if (autoStart) {
      playKickSound();
      if (1 > j.best) {
        j.best = 1;
        j.beatenBestThisRun = true;
        setJuggleBest(1);
        setNewJuggleRecord(true);
        writeStoredNumber(JUGGLE_BEST_KEY, 1);
      }
    }
  }, []);

  // Switch game mode cleanly
  const handleSwitchMode = (mode: MiniGameMode) => {
    if (mode === gameMode) return;
    playUiClick();
    setGameMode(mode);
    if (mode === 'juggle') {
      resetJuggleGame(false);
    } else {
      const p = penaltyRef.current;
      if (p.phase !== 'aim') {
        p.phase = 'aim';
        p.ballX = CANVAS_W / 2;
        p.ballY = 294;
        p.ballR = 22;
        p.keeperX = CANVAS_W / 2;
        p.keeperY = 162;
        p.keeperDiveProgress = 0;
        setIsShooting(false);
      }
    }
  };

  // Main Canvas Animation Loop (handles both games cleanly at 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;

    let rafId = 0;
    let lastTime = performance.now();

    const finishPenaltyShot = () => {
      const p = penaltyRef.current;
      const isGoal = p.outcome === 'goal';

      const currentHistory = [...shotsHistoryRef.current];
      const nextSlot = currentHistory.findIndex((s) => s === null);
      if (nextSlot !== -1) {
        currentHistory[nextSlot] = isGoal ? 'goal' : 'miss';
        setShotsHistory(currentHistory);
      }

      if (isGoal) {
        playGoalCheer();
        const nextScore = penaltyScoreRef.current + 1;
        const nextStreak = penaltyStreakRef.current + 1;
        setPenaltyScore(nextScore);
        setPenaltyStreak(nextStreak);

        let brokeStreak = false;
        if (nextStreak > penaltyBestStreakRef.current) {
          brokeStreak = true;
          setPenaltyBestStreak(nextStreak);
          writeStoredNumber(PENALTY_BEST_STREAK_KEY, nextStreak);
        }
        if (nextScore > penaltyBestRoundRef.current) {
          setPenaltyBestRound(nextScore);
          writeStoredNumber(PENALTY_BEST_ROUND_KEY, nextScore);
        }

        p.netRipple = 1;
        p.netHitX = p.targetX;
        p.netHitY = p.targetY;

        for (let i = 0; i < 24; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 4.5;
          p.particles.push({
            x: p.targetX,
            y: p.targetY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            life: 1,
            maxLife: 1,
            color: i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#E6002B' : '#FACC15',
            size: 2.5 + Math.random() * 3,
          });
        }

        setPenaltyBanner({
          text: brokeStreak && nextStreak >= 2 ? '¡GOLAZO + RÉCORD!' : '¡GOLAZO MC!',
          subtext: nextStreak >= 2 ? `Racha de ${nextStreak} goles seguidos` : 'Imposible para el arquero',
          tone: brokeStreak && nextStreak >= 2 ? 'record' : 'goal',
        });
        fireGoalConfetti();
      } else {
        playSaveSound();
        setPenaltyStreak(0);
        for (let i = 0; i < 14; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.2 + Math.random() * 3;
          p.particles.push({
            x: p.targetX,
            y: p.targetY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            maxLife: 1,
            color: i % 2 === 0 ? '#FFFFFF' : '#94A3B8',
            size: 2 + Math.random() * 2.5,
          });
        }
        setPenaltyBanner({
          text: '¡ATAJADÓN!',
          subtext: 'El arquero adivinó el palo',
          tone: 'save',
        });
      }

      const isLastShot = nextSlot === 4 || currentHistory.every((s) => s !== null);
      setTimeout(() => {
        if (isLastShot) {
          setRoundComplete(true);
          setIsShooting(false);
        } else {
          p.phase = 'aim';
          p.shotProgress = 0;
          p.ballX = CANVAS_W / 2;
          p.ballY = 294;
          p.ballR = 22;
          p.trail = [];
          p.keeperX = CANVAS_W / 2;
          p.keeperY = 162;
          p.keeperDiveDir = 0;
          p.keeperDiveProgress = 0;
          p.outcome = null;
          setIsShooting(false);
        }
      }, 1150);
    };

    const drawNightStadiumBackdrop = (time: number, isPenalty: boolean) => {
      // Deep night stadium sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, isPenalty ? 204 : 265);
      skyGrad.addColorStop(0, '#07080D');
      skyGrad.addColorStop(0.55, '#13070D');
      skyGrad.addColorStop(1, '#1A0B12');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Stadium floodlights top-left and top-right
      const drawFloodlight = (lx: number) => {
        const beam = ctx.createRadialGradient(lx, 12, 4, lx, 12, 170);
        beam.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
        beam.addColorStop(0.35, 'rgba(230, 0, 43, 0.14)');
        beam.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = beam;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      };
      drawFloodlight(58);
      drawFloodlight(CANVAS_W - 58);

      // Subtle animated crimson crowd bokeh dots
      for (let i = 0; i < 18; i++) {
        const bx = ((i * 29 + 14) % (CANVAS_W - 20)) + 10;
        const by = 22 + (i % 4) * 14;
        const pulse = 0.18 + 0.16 * Math.sin(time * 0.003 + i * 1.3);
        ctx.fillStyle = i % 3 === 0 ? `rgba(230, 0, 43, ${pulse})` : `rgba(255, 255, 255, ${pulse * 0.7})`;
        ctx.beginPath();
        ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pitch grass
      const horizonY = isPenalty ? GOAL.bottom : 272;
      const grassGrad = ctx.createLinearGradient(0, horizonY, 0, CANVAS_H);
      grassGrad.addColorStop(0, '#0F4D2A');
      grassGrad.addColorStop(0.45, '#136336');
      grassGrad.addColorStop(1, '#0C3B21');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, horizonY, CANVAS_W, CANVAS_H - horizonY);

      // Mowed turf perspective stripes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
      for (let i = 0; i < 6; i += 2) {
        const y0 = horizonY + i * ((CANVAS_H - horizonY) / 6);
        const h = (CANVAS_H - horizonY) / 6;
        ctx.fillRect(0, y0, CANVAS_W, h);
      }

      // Crisp touchline / goal line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(CANVAS_W, horizonY);
      ctx.stroke();

      if (isPenalty) {
        // Penalty box perspective lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(42, horizonY);
        ctx.lineTo(10, CANVAS_H);
        ctx.moveTo(CANVAS_W - 42, horizonY);
        ctx.lineTo(CANVAS_W - 10, CANVAS_H);
        ctx.stroke();

        // Penalty spot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(CANVAS_W / 2, 298, 8, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPenaltyScene = (dt: number, now: number) => {
      const p = penaltyRef.current;
      drawNightStadiumBackdrop(now, true);

      // Goal Net Interior
      ctx.save();
      ctx.fillStyle = 'rgba(5, 8, 12, 0.55)';
      ctx.fillRect(GOAL.left, GOAL.top, GOAL.width, GOAL.height);

      // Net mesh with subtle wave ripple on goal
      if (p.netRipple > 0) {
        p.netRipple = Math.max(0, p.netRipple - dt * 1.4);
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.19)';
      ctx.lineWidth = 1;
      const cols = 18;
      const rows = 9;
      for (let c = 1; c < cols; c++) {
        const gx = GOAL.left + (GOAL.width / cols) * c;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const gy = GOAL.top + (GOAL.height / rows) * r;
          let offsetX = 0;
          if (p.netRipple > 0) {
            const d = Math.hypot(gx - p.netHitX, gy - p.netHitY);
            offsetX = Math.sin(now * 0.04 - d * 0.08) * p.netRipple * Math.max(0, 1 - d / 160) * 10;
          }
          if (r === 0) ctx.moveTo(gx + offsetX, gy);
          else ctx.lineTo(gx + offsetX, gy);
        }
        ctx.stroke();
      }
      for (let r = 1; r < rows; r++) {
        const gy = GOAL.top + (GOAL.height / rows) * r;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const gx = GOAL.left + (GOAL.width / cols) * c;
          let offsetY = 0;
          if (p.netRipple > 0) {
            const d = Math.hypot(gx - p.netHitX, gy - p.netHitY);
            offsetY = Math.cos(now * 0.04 - d * 0.08) * p.netRipple * Math.max(0, 1 - d / 160) * 7;
          }
          if (c === 0) ctx.moveTo(gx, gy + offsetY);
          else ctx.lineTo(gx, gy + offsetY);
        }
        ctx.stroke();
      }

      // Club MC banner along top crossbar inner rim
      ctx.fillStyle = 'rgba(230, 0, 43, 0.14)';
      ctx.fillRect(GOAL.left, GOAL.top, GOAL.width, 16);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CLUB MC · MARTÍN CAREAGA · CUMPLIENDO SUEÑOS', CANVAS_W / 2, GOAL.top + 11);

      // Update shot & goalkeeper physics
      if (p.phase === 'flying') {
        p.shotProgress = Math.min(1, p.shotProgress + dt * 2.15);
        const t = p.shotProgress;
        const ease = 1 - Math.pow(1 - t, 2.2);

        // Parabolic arc height
        const arc = Math.sin(t * Math.PI) * 44;
        p.ballX = p.startX + (p.targetX - p.startX) * ease;
        p.ballY = p.startY + (p.targetY - p.startY) * ease - arc;
        p.ballR = 22 - 10.5 * ease;
        p.ballRot += dt * 15;

        p.trail.push({ x: p.ballX, y: p.ballY, r: p.ballR });
        if (p.trail.length > 10) p.trail.shift();

        // Goalkeeper dives smoothly
        p.keeperDiveProgress = Math.min(1, p.keeperDiveProgress + dt * 2.5);
        const kEase = 1 - Math.pow(1 - p.keeperDiveProgress, 3);
        p.keeperX = CANVAS_W / 2 + (p.keeperTargetX - CANVAS_W / 2) * kEase;
        p.keeperY = 162 + (p.keeperTargetY - 162) * kEase;

        if (p.shotProgress >= 1) {
          p.phase = 'result';
          finishPenaltyShot();
        }
      } else if (p.phase === 'result') {
        if (p.outcome === 'save') {
          p.ballX += p.deflectVx;
          p.ballY += p.deflectVy;
          p.deflectVy += 0.25;
          p.ballRot += dt * 10;
        } else {
          // Ball settles inside net
          p.ballY = Math.min(GOAL.bottom - 12, p.ballY + dt * 65);
        }
      } else {
        // Subtle idle keeper sway
        p.keeperX = CANVAS_W / 2 + Math.sin(now * 0.004) * 14;
        p.keeperY = 164 + Math.abs(Math.cos(now * 0.008)) * 3;
      }

      // Draw Goalkeeper
      ctx.save();
      ctx.translate(p.keeperX, p.keeperY);
      const diveAngle = p.keeperDiveDir * p.keeperDiveProgress * 0.92;
      ctx.rotate(diveAngle);

      // Keeper ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 36, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-7, 14);
      ctx.lineTo(-10, 34);
      ctx.moveTo(7, 14);
      ctx.lineTo(10, 34);
      ctx.stroke();

      // Jersey torso (fluorescent keeper emerald/gold with MC accent)
      ctx.fillStyle = '#0EA5E9';
      ctx.beginPath();
      ctx.roundRect(-14, -14, 28, 30, 7);
      ctx.fill();
      ctx.fillStyle = '#E6002B';
      ctx.fillRect(-14, -2, 28, 5);

      // Outstretched arms + gloves
      const reach = 26 + p.keeperDiveProgress * 12;
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.moveTo(-13, -8);
      ctx.lineTo(-reach, -16 - p.keeperDiveProgress * 6);
      ctx.moveTo(13, -8);
      ctx.lineTo(reach, -16 - p.keeperDiveProgress * 6);
      ctx.stroke();

      // Gloves
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E6002B';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-reach, -16 - p.keeperDiveProgress * 6, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(reach, -16 - p.keeperDiveProgress * 6, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.fillStyle = '#F3C9A8';
      ctx.beginPath();
      ctx.arc(0, -24, 9.5, 0, Math.PI * 2);
      ctx.fill();
      // Hair
      ctx.fillStyle = '#1F2937';
      ctx.beginPath();
      ctx.arc(0, -27, 9.5, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // White Goalposts & Crossbar
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 6.5;
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(GOAL.left, GOAL.bottom);
      ctx.lineTo(GOAL.left, GOAL.top);
      ctx.lineTo(GOAL.right, GOAL.top);
      ctx.lineTo(GOAL.right, GOAL.bottom);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Aim Reticle when in aim phase
      if (p.phase === 'aim' && !roundComplete) {
        const pulse = 1 + Math.sin(now * 0.008) * 0.14;
        ctx.save();
        ctx.translate(p.aimX, p.aimY);

        // Dashed aim trajectory line from ball to target
        ctx.restore();
        ctx.save();
        ctx.setLineDash([5, 6]);
        ctx.strokeStyle = 'rgba(230, 0, 43, 0.55)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(CANVAS_W / 2, 294);
        ctx.lineTo(p.aimX, p.aimY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        ctx.save();
        ctx.translate(p.aimX, p.aimY);
        ctx.strokeStyle = '#E6002B';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, 0, 15 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(230, 0, 43, 0.25)';
        ctx.beginPath();
        ctx.arc(0, 0, 15 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 8);
        ctx.stroke();
        ctx.restore();
      }

      // Ball trail
      for (let i = 0; i < p.trail.length; i++) {
        const tr = p.trail[i];
        const alpha = ((i + 1) / p.trail.length) * 0.28;
        ctx.fillStyle = `rgba(230, 0, 43, ${alpha})`;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, tr.r * 0.72, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ball shadow on grass
      if (p.phase === 'aim') {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(p.ballX, p.ballY + p.ballR - 2, p.ballR * 0.9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Soccer Ball
      drawSoccerBall(ctx, p.ballX, p.ballY, p.ballR, p.ballRot, p.phase === 'flying' ? 0.9 : 0.25);

      // Update & draw particles
      for (let i = p.particles.length - 1; i >= 0; i--) {
        const pt = p.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= dt * 1.5;
        if (pt.life <= 0) {
          p.particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    const drawJuggleScene = (dt: number, now: number) => {
      const j = juggleRef.current;
      drawNightStadiumBackdrop(now, false);

      const groundY = 294;

      if (j.status === 'ready') {
        j.floatTime += dt * 3;
        j.x = CANVAS_W / 2;
        j.y = 152 + Math.sin(j.floatTime) * 10;
        j.rot += dt * 0.7;
      } else if (j.status === 'playing') {
        // Physics step (gravity + air resistance)
        j.vy += 980 * dt;
        j.x += j.vx * dt;
        j.y += j.vy * dt;
        j.rot += j.vrot;
        j.vrot *= 0.992;
        j.glow = Math.max(0, j.glow - dt * 2.5);

        // Bounce cleanly off left & right stadium walls
        if (j.x - j.radius < 12) {
          j.x = 12 + j.radius;
          j.vx = Math.abs(j.vx) * 0.78;
          j.vrot = -j.vrot;
        } else if (j.x + j.radius > CANVAS_W - 12) {
          j.x = CANVAS_W - 12 - j.radius;
          j.vx = -Math.abs(j.vx) * 0.78;
          j.vrot = -j.vrot;
        }

        // Ceiling soft bounce so high kicks stay playable
        if (j.y - j.radius < 10) {
          j.y = 10 + j.radius;
          j.vy = Math.abs(j.vy) * 0.35;
        }

        // Dropped on grass -> Game Over
        if (j.y + j.radius >= groundY) {
          j.y = groundY - j.radius;
          j.vy = 0;
          j.vx = 0;
          j.status = 'gameover';
          playSaveSound();
          setJuggleState('gameover');
        }
      }

      // Giant subtle score watermark behind ball while playing
      if (j.status === 'playing' || j.status === 'gameover') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.font = 'italic 900 118px "Barlow Condensed", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(j.score), CANVAS_W / 2, 148);
        ctx.restore();
      }

      // Dynamic ground shadow based on ball height
      const heightRatio = Math.max(0, Math.min(1, (groundY - j.y) / 240));
      const shadowRx = j.radius * (1.15 - heightRatio * 0.58);
      const shadowRy = 9 * (1.1 - heightRatio * 0.5);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.52 - heightRatio * 0.32})`;
      ctx.beginPath();
      ctx.ellipse(j.x, groundY + 2, shadowRx, shadowRy, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shockwave ripples
      for (let i = j.ripples.length - 1; i >= 0; i--) {
        const rp = j.ripples[i];
        rp.r += dt * 140;
        rp.alpha -= dt * 2.2;
        if (rp.alpha <= 0) {
          j.ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = Math.max(0, rp.alpha);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Tap ring hint in ready state
      if (j.status === 'ready') {
        const pulse = 1 + Math.sin(now * 0.006) * 0.12;
        ctx.save();
        ctx.strokeStyle = 'rgba(230, 0, 43, 0.65)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.arc(j.x, j.y, j.radius * 1.45 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Soccer Ball
      drawSoccerBall(ctx, j.x, j.y, j.radius, j.rot, j.glow);

      // Update & draw kick spark particles
      for (let i = j.particles.length - 1; i >= 0; i--) {
        const pt = j.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.18;
        pt.life -= dt * 2.1;
        if (pt.life <= 0) {
          j.particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const render = (now: number) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      if (gameMode === 'penalties') {
        drawPenaltyScene(dt, now);
      } else {
        drawJuggleScene(dt, now);
      }

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [gameMode, roundComplete, fireGoalConfetti]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameMode !== 'penalties') return;
    const p = penaltyRef.current;
    if (p.phase !== 'aim' || roundComplete) return;
    const pt = getCanvasPoint(e);
    p.aimX = Math.max(GOAL.left + 16, Math.min(GOAL.right - 16, pt.x));
    p.aimY = Math.max(GOAL.top + 16, Math.min(GOAL.bottom - 16, pt.y));
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);

    if (gameMode === 'penalties') {
      if (roundComplete) {
        resetPenaltyRound();
        return;
      }
      shootPenaltyAt(pt.x, pt.y);
      return;
    }

    // JUGGLE ("Dominaditas") tap/click physics
    const j = juggleRef.current;
    if (j.status === 'gameover') {
      resetJuggleGame(true);
      return;
    }

    const dist = Math.hypot(pt.x - j.x, pt.y - j.y);
    const generousHitRadius = j.status === 'ready' ? 110 : j.radius + 32;

    if (dist <= generousHitRadius) {
      playKickSound();
      if (j.status === 'ready') {
        j.status = 'playing';
        setJuggleState('playing');
      }

      // Directional horizontal kick away from tap point (realistic keepy-uppy physics!)
      const dx = j.x - pt.x;
      j.vx = Math.max(-280, Math.min(280, dx * 6.4 + (Math.random() - 0.5) * 35));
      j.vy = -445 - Math.min(45, j.score * 2);
      j.vrot = (j.vx / 260) * 0.24;
      j.glow = 1;
      j.score += 1;

      setJuggleScore(j.score);

      // Combo milestone callouts
      if (j.score === 5) setJuggleComboLabel('¡BUEN CONTROL!');
      else if (j.score === 10) setJuggleComboLabel('¡CRACK MC!');
      else if (j.score === 20) setJuggleComboLabel('¡LEYENDA ROJINEGRA!');
      else if (j.score === 35) setJuggleComboLabel('¡NIVEL SELECCIÓN!');

      // Check & persist personal record
      if (j.score > j.best) {
        j.best = j.score;
        setJuggleBest(j.score);
        writeStoredNumber(JUGGLE_BEST_KEY, j.score);
        if (!j.beatenBestThisRun && j.score >= 3) {
          j.beatenBestThisRun = true;
          setNewJuggleRecord(true);
          playGoalCheer();
          fireGoalConfetti();
        }
      }

      // Visual shockwave + spark burst
      j.ripples.push({
        x: pt.x,
        y: pt.y,
        r: 10,
        maxR: 65,
        alpha: 0.9,
        color: j.score >= 10 ? '#FACC15' : '#E6002B',
      });

      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.8;
        j.particles.push({
          x: pt.x,
          y: pt.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          life: 1,
          maxLife: 1,
          color: i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#E6002B' : '#FACC15',
          size: 2.2 + Math.random() * 2.2,
        });
      }
    }
  };

  const getRankLabel = (score: number) => {
    if (score >= 5) return 'LEYENDA MC PERFECTA';
    if (score >= 4) return 'GOLEADOR DE PRIMERA';
    if (score >= 3) return 'TITULAR DEL CLUB MC';
    return 'CANTERANO EN FORMACIÓN';
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Sub-mode switcher: Penales MC vs Dominaditas */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => handleSwitchMode('penalties')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              gameMode === 'penalties'
                ? 'bg-[#E6002B] text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Penales MC</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('juggle')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              gameMode === 'juggle'
                ? 'bg-[#E6002B] text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Dominaditas</span>
          </button>
        </div>

        {/* Saved High Score Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span>
            {gameMode === 'penalties'
              ? `Récord: ${penaltyBestStreak} racha`
              : `Récord: ${juggleBest} toques`}
          </span>
        </div>
      </div>

      {/* Live Game Canvas Container */}
      <div className="relative w-full aspect-[460/340] rounded-xl overflow-hidden border border-slate-300 dark:border-neutral-800 bg-[#07080D] shadow-inner select-none">
        <canvas
          ref={canvasRef}
          onPointerMove={handleCanvasPointerMove}
          onPointerDown={handleCanvasPointerDown}
          className="w-full h-full block touch-none cursor-crosshair"
        />

        {/* TOP HUD OVERLAY */}
        <div className="absolute top-2.5 inset-x-3 flex items-center justify-between pointer-events-none">
          {gameMode === 'penalties' ? (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md">
                {shotsHistory.map((res, idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full border ${
                      res === 'goal'
                        ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#34d399]'
                        : res === 'miss'
                        ? 'bg-[#E6002B] border-red-300'
                        : 'bg-white/15 border-white/30'
                    }`}
                  />
                ))}
                <span className="ml-1.5 text-[11px] font-mono font-bold text-white">
                  {penaltyScore}/5
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-200">
                Racha: <span className="text-[#FF3355]">{penaltyStreak}</span> · Mejor tanda:{' '}
                <span className="text-amber-400">{penaltyBestRound}/5</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-xs font-mono font-bold text-white flex items-center gap-2">
                <span>Toques:</span>
                <span className="text-[#FF3355] text-sm font-black">{juggleScore}</span>
              </div>
              {newJuggleRecord ? (
                <div className="px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-mono font-black uppercase tracking-wider animate-pulse">
                  ★ ¡Nuevo Récord!
                </div>
              ) : juggleComboLabel ? (
                <div className="px-2.5 py-1 rounded-full bg-[#E6002B]/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  {juggleComboLabel}
                </div>
              ) : (
                <div className="px-2.5 py-1 rounded-full bg-black/75 border border-white/15 text-[10px] font-mono text-neutral-300">
                  ¡Que no toque el césped!
                </div>
              )}
            </>
          )}
        </div>

        {/* PENALTY RESULT BANNER */}
        {gameMode === 'penalties' && penaltyBanner && !roundComplete && (
          <div className="absolute inset-x-0 bottom-12 flex flex-col items-center pointer-events-none animate-in fade-in zoom-in-95">
            <div
              className={`px-4 py-1.5 rounded-full font-display font-black italic text-lg tracking-wider uppercase shadow-xl border ${
                penaltyBanner.tone === 'record'
                  ? 'bg-amber-400 text-black border-amber-200'
                  : penaltyBanner.tone === 'goal'
                  ? 'bg-emerald-500 text-white border-emerald-300'
                  : 'bg-neutral-900/95 text-white border-white/25'
              }`}
            >
              {penaltyBanner.text}
            </div>
            {penaltyBanner.subtext && (
              <span className="mt-1 px-2.5 py-0.5 rounded-full bg-black/75 text-[10px] font-mono text-neutral-200">
                {penaltyBanner.subtext}
              </span>
            )}
          </div>
        )}

        {/* PENALTY ROUND COMPLETE OVERLAY */}
        {gameMode === 'penalties' && roundComplete && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center z-20 animate-in fade-in">
            <Award className="w-10 h-10 text-amber-400 mb-2" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF3355] font-bold">
              {getRankLabel(penaltyScore)}
            </span>
            <h4 className="text-3xl font-black font-display italic text-white mt-0.5">
              {penaltyScore} DE 5 GOLES
            </h4>
            <p className="text-xs text-neutral-300 mt-1 mb-4">
              Mejor tanda guardada: <strong className="text-amber-400">{penaltyBestRound}/5</strong> ·
              Mejor racha: <strong className="text-emerald-400">{penaltyBestStreak}</strong>
            </p>
            <button
              type="button"
              onClick={resetPenaltyRound}
              className="px-5 py-2.5 rounded-xl bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E6002B]/30 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jugar Otra Tanda</span>
            </button>
          </div>
        )}

        {/* JUGGLE READY HINT */}
        {gameMode === 'juggle' && juggleState === 'ready' && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-[11px] font-mono text-white flex items-center gap-2 shadow-lg">
              <Play className="w-3 h-3 text-[#E6002B] fill-[#E6002B]" />
              <span>Toca o haz clic en el balón para empezar</span>
            </div>
          </div>
        )}

        {/* JUGGLE GAME OVER OVERLAY */}
        {gameMode === 'juggle' && juggleState === 'gameover' && (
          <div className="absolute inset-0 bg-black/78 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center z-20 animate-in fade-in">
            <Trophy className={`w-9 h-9 mb-2 ${newJuggleRecord ? 'text-amber-400' : 'text-[#E6002B]'}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-bold">
              {newJuggleRecord ? '¡NUEVO RÉCORD PERSONAL!' : 'EL BALÓN TOCÓ EL CÉSPED'}
            </span>
            <h4 className="text-3xl font-black font-display italic text-white mt-0.5">
              {juggleScore} {juggleScore === 1 ? 'TOQUE' : 'TOQUES'}
            </h4>
            <p className="text-xs text-neutral-300 mt-1 mb-4">
              Tu récord guardado: <strong className="text-amber-400">{juggleBest} toques</strong>
            </p>
            <button
              type="button"
              onClick={() => resetJuggleGame(true)}
              className="px-5 py-2.5 rounded-xl bg-[#E6002B] hover:bg-[#FF1A40] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E6002B]/30 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Intentar de Nuevo</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Action Bar / Instructions */}
      {gameMode === 'penalties' ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="text-slate-600 dark:text-neutral-400">
            Apunta y haz clic en el arco, o elige un ángulo:
          </span>
          <div className="flex items-center gap-1">
            {[
              { label: '↖ Izq', x: GOAL.left + 36, y: GOAL.top + 32 },
              { label: '↑ Centro', x: CANVAS_W / 2, y: GOAL.top + 30 },
              { label: '↗ Der', x: GOAL.right - 36, y: GOAL.top + 32 },
            ].map((corner) => (
              <button
                key={corner.label}
                type="button"
                disabled={isShooting || roundComplete}
                onClick={() => shootPenaltyAt(corner.x, corner.y)}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 hover:bg-[#E6002B] hover:text-white border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-semibold transition-colors cursor-pointer disabled:opacity-40"
              >
                {corner.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-neutral-400">
          <span>Haz clic o toca debajo del balón para darle altura y efecto.</span>
          <button
            type="button"
            onClick={() => resetJuggleGame(false)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reiniciar</span>
          </button>
        </div>
      )}
    </div>
  );
};
