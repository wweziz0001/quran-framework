/**
 * Quran Reader JavaScript
 * ========================
 * Client-side functionality for Quran reader
 * Following Odoo's asset bundling pattern
 */

// ==================== Namespace ====================
const QuranReader = {
  // State
  state: {
    currentSurah: 1,
    currentAyah: 1,
    currentReciter: 'afasy',
    isPlaying: false,
    audioSpeed: 1.0,
    showTajweed: false,
    showTranslation: true,
    translationSource: 'en_sahih',
    fontSize: 1.0,
    fontFamily: 'uthmani',
    darkMode: false
  },
  
  // Audio state
  audio: {
    element: null,
    currentTime: 0,
    duration: 0,
    ayahTimings: []
  },
  
  // ==================== Initialization ====================
  init() {
    this.loadSettings();
    this.bindEvents();
    this.initAudio();
    console.log('QuranReader initialized');
  },
  
  // ==================== Settings ====================
  loadSettings() {
    const saved = localStorage.getItem('quran_reader_settings');
    if (saved) {
      this.state = { ...this.state, ...JSON.parse(saved) };
    }
  },
  
  saveSettings() {
    localStorage.setItem('quran_reader_settings', JSON.stringify(this.state));
  },
  
  // ==================== Event Binding ====================
  bindEvents() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Ayah click
    document.querySelectorAll('.ayah-text').forEach(el => {
      el.addEventListener('click', (e) => this.selectAyah(e.target));
    });
  },
  
  handleKeyboard(e) {
    switch(e.key) {
      case ' ':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        this.nextAyah();
        break;
      case 'ArrowLeft':
        this.previousAyah();
        break;
      case '+':
      case '=':
        this.increaseFontSize();
        break;
      case '-':
        this.decreaseFontSize();
        break;
      case 't':
        this.toggleTajweed();
        break;
      case 'r':
        this.toggleTranslation();
        break;
    }
  },
  
  // ==================== Ayah Navigation ====================
  selectAyah(element) {
    const surahId = element.dataset.surah;
    const ayahId = element.dataset.ayah;
    
    // Remove previous selection
    document.querySelectorAll('.ayah-text.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Add new selection
    element.classList.add('selected');
    
    this.state.currentSurah = parseInt(surahId);
    this.state.currentAyah = parseInt(ayahId);
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('ayahSelected', {
      detail: { surahId, ayahId }
    }));
  },
  
  nextAyah() {
    // Implementation for next ayah navigation
    console.log('Next ayah');
  },
  
  previousAyah() {
    // Implementation for previous ayah navigation
    console.log('Previous ayah');
  },
  
  // ==================== Audio Controls ====================
  initAudio() {
    this.audio.element = new Audio();
    this.audio.element.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.audio.element.addEventListener('ended', () => this.onEnded());
    this.audio.element.addEventListener('error', (e) => this.onError(e));
  },
  
  async loadAudio(surahId, reciterId) {
    const audioUrl = `/api/audio/recitations/${surahId}/${reciterId}`;
    try {
      const response = await fetch(audioUrl);
      const data = await response.json();
      
      if (data.success) {
        this.audio.element.src = data.data.audioUrl;
        this.audio.ayahTimings = data.data.ayahTimings;
        this.audio.duration = data.data.durationSeconds * 1000;
      }
    } catch (error) {
      console.error('Failed to load audio:', error);
    }
  },
  
  togglePlay() {
    if (this.audio.element.paused) {
      this.audio.element.play();
      this.state.isPlaying = true;
    } else {
      this.audio.element.pause();
      this.state.isPlaying = false;
    }
    this.updatePlayButton();
  },
  
  onTimeUpdate() {
    const currentTime = this.audio.element.currentTime * 1000;
    this.audio.currentTime = currentTime;
    
    // Highlight current ayah based on timing
    this.highlightCurrentAyah(currentTime);
    
    // Update progress bar
    this.updateProgressBar();
  },
  
  onEnded() {
    this.state.isPlaying = false;
    this.updatePlayButton();
    
    // Auto-play next surah if enabled
    if (this.state.autoPlay) {
      this.loadAudio(this.state.currentSurah + 1, this.state.currentReciter);
      this.togglePlay();
    }
  },
  
  onError(e) {
    console.error('Audio error:', e);
    this.state.isPlaying = false;
    this.updatePlayButton();
  },
  
  highlightCurrentAyah(currentTime) {
    for (const timing of this.audio.ayahTimings) {
      if (currentTime >= timing.startTimeMs && currentTime < timing.endTimeMs) {
        // Find and highlight the ayah
        const ayahElement = document.querySelector(
          `.ayah-text[data-surah="${timing.surahId}"][data-ayah="${timing.ayahId}"]`
        );
        if (ayahElement && !ayahElement.classList.contains('selected')) {
          this.selectAyah(ayahElement);
        }
        break;
      }
    }
  },
  
  updateProgressBar() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    const progressFill = document.querySelector('.audio-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  },
  
  updatePlayButton() {
    const playBtn = document.querySelector('.audio-play-btn svg');
    if (playBtn) {
      playBtn.innerHTML = this.state.isPlaying 
        ? '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>'
        : '<path d="M8 5v14l11-7z"/>';
    }
  },
  
  setAudioSpeed(speed) {
    this.audio.element.playbackRate = speed;
    this.state.audioSpeed = speed;
    this.saveSettings();
  },
  
  seekTo(percentage) {
    const time = (percentage / 100) * this.audio.duration;
    this.audio.element.currentTime = time / 1000;
  },
  
  // ==================== Display Options ====================
  toggleTajweed() {
    this.state.showTajweed = !this.state.showTajweed;
    this.applyTajweed();
    this.saveSettings();
  },
  
  applyTajweed() {
    const container = document.querySelector('.quran-text');
    if (container) {
      container.classList.toggle('show-tajweed', this.state.showTajweed);
    }
  },
  
  toggleTranslation() {
    this.state.showTranslation = !this.state.showTranslation;
    this.applyTranslation();
    this.saveSettings();
  },
  
  applyTranslation() {
    const translations = document.querySelectorAll('.translation-text');
    translations.forEach(el => {
      el.style.display = this.state.showTranslation ? 'block' : 'none';
    });
  },
  
  increaseFontSize() {
    if (this.state.fontSize < 2.0) {
      this.state.fontSize += 0.1;
      this.applyFontSize();
      this.saveSettings();
    }
  },
  
  decreaseFontSize() {
    if (this.state.fontSize > 0.5) {
      this.state.fontSize -= 0.1;
      this.applyFontSize();
      this.saveSettings();
    }
  },
  
  applyFontSize() {
    const container = document.querySelector('.quran-text');
    if (container) {
      container.style.fontSize = `${this.state.fontSize}em`;
    }
  },
  
  setFontFamily(family) {
    this.state.fontFamily = family;
    this.applyFontFamily();
    this.saveSettings();
  },
  
  applyFontFamily() {
    const container = document.querySelector('.quran-text');
    if (container) {
      container.className = `quran-text quran-text-${this.state.fontFamily}`;
    }
  },
  
  toggleDarkMode() {
    this.state.darkMode = !this.state.darkMode;
    this.applyDarkMode();
    this.saveSettings();
  },
  
  applyDarkMode() {
    document.body.classList.toggle('dark-mode', this.state.darkMode);
  },
  
  // ==================== Bookmarks ====================
  async addBookmark(ayahId, type = 'BOOKMARK', note = '') {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ayahId, type, note })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  },
  
  async removeBookmark(bookmarkId) {
    try {
      await fetch(`/api/bookmarks/${bookmarkId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  },
  
  // ==================== Search ====================
  async search(query) {
    try {
      const response = await fetch(`/api/quran/search?q=${encodeURIComponent(query)}`);
      return response.json();
    } catch (error) {
      console.error('Search failed:', error);
      return { success: false, data: [] };
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => QuranReader.init());

// Export for global access
window.QuranReader = QuranReader;

export default QuranReader;
