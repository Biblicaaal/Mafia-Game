import * as THREE from '/node_modules/three/build/three.module.js';

export function lerpValue(a, b, t) {
  return a + (b - a) * t;
}

export function lerpColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t);
}

export function lightingAtPhase(phase) {
  const p = ((phase % 1) + 1) % 1;
  const stops = [
    { p: 0, bg: 0x05070b, ambientColor: 0x6f7fa4, ambient: 0.34, sunColor: 0x7186b5, sun: 0.08, sunPos: [-6, 5, -12] },
    { p: 0.208, bg: 0x070a10, ambientColor: 0x8996ae, ambient: 0.44, sunColor: 0xa8a0bd, sun: 0.16, sunPos: [18, 6, -10] },
    { p: 0.25, bg: 0x12100d, ambientColor: 0xe5b985, ambient: 0.78, sunColor: 0xffb061, sun: 0.72, sunPos: [18, 9, -5] },
    { p: 0.333, bg: 0x111512, ambientColor: 0xe8e1c8, ambient: 1.02, sunColor: 0xffdf9a, sun: 1.05, sunPos: [15, 17, 8] },
    { p: 0.5, bg: 0x121613, ambientColor: 0xf3edd6, ambient: 1.16, sunColor: 0xfff0c8, sun: 1.34, sunPos: [3, 25, 18] },
    { p: 0.708, bg: 0x15110e, ambientColor: 0xd6ae83, ambient: 0.86, sunColor: 0xffbf72, sun: 0.86, sunPos: [-15, 12, 8] },
    { p: 0.792, bg: 0x090b10, ambientColor: 0x8fa0c0, ambient: 0.48, sunColor: 0xb08ccc, sun: 0.24, sunPos: [-18, 6, -6] },
    { p: 0.875, bg: 0x05070b, ambientColor: 0x6f7fa4, ambient: 0.34, sunColor: 0x7186b5, sun: 0.08, sunPos: [-8, 5, -12] },
    { p: 1, bg: 0x05070b, ambientColor: 0x6f7fa4, ambient: 0.34, sunColor: 0x7186b5, sun: 0.08, sunPos: [-6, 5, -12] },
  ];
  let a = stops[0];
  let b = stops[1];
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (p >= stops[i].p && p <= stops[i + 1].p) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const t = (p - a.p) / Math.max(0.001, b.p - a.p);
  return {
    bg: lerpColor(a.bg, b.bg, t),
    ambientColor: lerpColor(a.ambientColor, b.ambientColor, t),
    ambient: lerpValue(a.ambient, b.ambient, t),
    sunColor: lerpColor(a.sunColor, b.sunColor, t),
    sun: lerpValue(a.sun, b.sun, t),
    sunPos: a.sunPos.map((v, i) => lerpValue(v, b.sunPos[i], t)),
    nightMix: p >= 0.875 || p < 0.208 ? 1 : p >= 0.792 ? (p - 0.792) / 0.083 : p < 0.25 ? (0.25 - p) / 0.042 : 0,
  };
}

export function periodIndex(period) {
  const names = ['morning', 'afternoon', 'evening', 'night'];
  return Math.max(0, names.indexOf(String(period || 'Morning').toLowerCase()));
}

export function lightingForPeriod(period) {
  return lightingAtPhase(periodIndex(period) / 4);
}

export function lightingForPayload(payload) {
  if (Number.isFinite(Number(payload?.timeMinuteOfDay))) return lightingAtPhase(Number(payload.timeMinuteOfDay) / 1440);
  return lightingForPeriod(payload?.timePeriod);
}
