// Sound Manager for game audio effects
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.initSounds();
  }

  private initSounds() {
    // Using Web Audio API to generate simple sounds
    this.generateMatchSound();
    this.generateSwapSound();
    this.generateCascadeSound();
    this.generateComboSound();
    this.generatePowerUpSound();
  }

  private generateMatchSound() {
    // Create a simple pleasant match sound
    this.createTone('match', [523.25, 659.25, 783.99], 0.1, 'sine');
  }

  private generateSwapSound() {
    this.createTone('swap', [440], 0.05, 'square');
  }

  private generateCascadeSound() {
    this.createTone('cascade', [659.25, 783.99, 987.77], 0.08, 'sine');
  }

  private generateComboSound() {
    this.createTone('combo', [523.25, 659.25, 783.99, 987.77], 0.12, 'sine');
  }

  private generatePowerUpSound() {
    this.createTone('powerup', [440, 554.37, 659.25, 880], 0.15, 'triangle');
  }

  private createTone(name: string, frequencies: number[], duration: number, type: OscillatorType) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playSound = () => {
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = 0.15;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = freq;
        oscillator.connect(gainNode);
        
        const startTime = audioContext.currentTime + (index * duration / frequencies.length);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration / frequencies.length);
      });

      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    };

    // Store the play function
    const audio = new Audio();
    (audio as any).customPlay = playSound;
    this.sounds.set(name, audio);
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound && (sound as any).customPlay) {
      (sound as any).customPlay();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
