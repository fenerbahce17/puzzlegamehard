// Sound Manager for game audio effects
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private backgroundMusic: HTMLAudioElement | null = null;

  constructor() {
    this.initSounds();
    this.initBackgroundMusic();
  }

  private initSounds() {
    // Using Web Audio API to generate simple sounds
    this.generateMatchSound();
    this.generateSwapSound();
    this.generateCascadeSound();
    this.generateComboSound();
    this.generatePowerUpSound();
  }

  private initBackgroundMusic() {
    // Özel arka plan müziği
    const musicUrl = '/music/background.mp3';
    
    this.backgroundMusic = new Audio(musicUrl);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.2; // Soft/düşük ses seviyesi
    
    // Kullanıcı ilk etkileşimi sonrası müziği başlat
    const startMusic = () => {
      if (this.enabled && this.backgroundMusic && this.backgroundMusic.paused) {
        this.backgroundMusic.play().catch(() => {
          // Tarayıcı otomatik çalmayı engellediyse sessizce devam et
        });
      }
    };
    
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });
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
    
    // Arka plan müziğini aç/kapat
    if (this.backgroundMusic) {
      if (this.enabled) {
        this.backgroundMusic.play().catch(() => {});
      } else {
        this.backgroundMusic.pause();
      }
    }
    
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
