let jazzAudio = null;
let radioVolume = 0.62;
let radioOn = false;

export function stopJazz() {
  if (!jazzAudio) return false;
  const audio = jazzAudio;
  jazzAudio = null;
  radioOn = false;
  audio.pause();
  audio.currentTime = 0;
  return false;
}

export function startJazz() {
  if (jazzAudio) {
    jazzAudio.volume = radioVolume;
    radioOn = true;
    jazzAudio.play().catch(() => {});
    return true;
  }
  const audio = new Audio('/audio/sidewalk-hustle.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = radioVolume;
  jazzAudio = audio;
  radioOn = true;
  audio.play().catch(() => {});
  return true;
}

export function primeRadio() {
  if (jazzAudio) return true;
  const audio = new Audio('/audio/sidewalk-hustle.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  jazzAudio = audio;
  radioOn = false;
  audio.play().catch(() => {});
  return true;
}

export function toggleRadio() {
  return jazzAudio ? stopJazz() : startJazz();
}

export function isRadioPlaying() {
  return !!jazzAudio && radioOn;
}

export function setRadioVolume(value) {
  radioVolume = Math.max(0, Math.min(1, Number(value) || 0));
  if (jazzAudio) jazzAudio.volume = radioVolume;
  return radioVolume;
}

export function getRadioVolume() {
  return radioVolume;
}
