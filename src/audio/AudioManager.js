import { Audio } from 'expo-av';

const SOUNDS = {
  build: require('../../assets/sounds/build.wav'),
  shoot: require('../../assets/sounds/shoot.wav'),
  hit: require('../../assets/sounds/hit.wav'),
  enemy_die: require('../../assets/sounds/enemy_die.wav'),
  life_loss: require('../../assets/sounds/life_loss.wav'),
  wave_start: require('../../assets/sounds/wave_start.wav'),
  game_over: require('../../assets/sounds/game_over.wav'),
  victory: require('../../assets/sounds/victory.wav'),
};

class AudioManager {
  constructor() {
    this.sounds = {};
    this.initialized = false;
    this.enabled = true;
  }

  async init() {
    if (this.initialized) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      for (const [name, src] of Object.entries(SOUNDS)) {
        const { sound } = await Audio.Sound.createAsync(src, { volume: 0.4, isLooping: false });
        this.sounds[name] = sound;
      }
      this.initialized = true;
    } catch (e) {
      console.warn('Audio init failed:', e.message);
    }
  }

  async play(name) {
    if (!this.enabled || !this.initialized) return;
    const sound = this.sounds[name];
    if (!sound) return;
    try {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (e) {
      // ignore audio errors
    }
  }

  setEnabled(v) {
    this.enabled = v;
  }

  async unload() {
    for (const sound of Object.values(this.sounds)) {
      try { await sound.unloadAsync(); } catch (_) {}
    }
    this.sounds = {};
    this.initialized = false;
  }
}

export default new AudioManager();
