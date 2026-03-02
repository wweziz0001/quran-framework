/**
 * Memorization Module JavaScript
 * ==============================
 * Client-side functionality for memorization
 */

const MemorizationModule = {
  // State
  state: {
    currentPlan: null,
    revisionQueue: [],
    currentIndex: 0,
    isRevising: false
  },
  
  // SM-2 Algorithm Implementation
  sm2: {
    /**
     * Calculate next interval using SM-2 algorithm
     */
    calculate(quality, previousEF, previousInterval, repetitionCount) {
      let ef = previousEF;
      let interval = 1;
      let repetition = repetitionCount;
      
      // Quality: 0-5 (0=complete failure, 5=perfect)
      if (quality >= 3) {
        // Correct response
        if (repetition === 0) {
          interval = 1;
        } else if (repetition === 1) {
          interval = 6;
        } else {
          interval = Math.round(previousInterval * ef);
        }
        repetition++;
      } else {
        // Incorrect response - reset
        repetition = 0;
        interval = 1;
      }
      
      // Update ease factor
      ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      ef = Math.max(1.3, ef);
      
      return { interval, ef, repetition };
    }
  },
  
  // Initialize module
  init() {
    this.bindEvents();
    console.log('MemorizationModule initialized');
  },
  
  bindEvents() {
    document.querySelectorAll('.quality-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quality = parseInt(e.target.dataset.quality);
        this.submitQuality(quality);
      });
    });
  },
  
  async startRevision(planId) {
    try {
      const response = await fetch(`/api/memorization/revisions/today?plan_id=${planId}`);
      const data = await response.json();
      
      if (data.success) {
        this.state.revisionQueue = data.data;
        this.state.currentIndex = 0;
        this.state.isRevising = true;
        this.showCurrentAyah();
      }
    } catch (error) {
      console.error('Failed to start revision:', error);
    }
  },
  
  showCurrentAyah() {
    const item = this.state.revisionQueue[this.state.currentIndex];
    if (!item) {
      this.endRevision();
      return;
    }
    
    // Update UI with current ayah
    const ayahElement = document.querySelector('.revision-ayah');
    if (ayahElement) {
      ayahElement.textContent = item.ayah.textArabic;
    }
  },
  
  async submitQuality(quality) {
    const item = this.state.revisionQueue[this.state.currentIndex];
    
    try {
      await fetch('/api/memorization/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: item.planId,
          ayahId: item.ayahId,
          surahId: item.surahId,
          userId: item.userId,
          qualityRating: quality
        })
      });
      
      // Move to next
      this.state.currentIndex++;
      this.showCurrentAyah();
    } catch (error) {
      console.error('Failed to submit quality:', error);
    }
  },
  
  endRevision() {
    this.state.isRevising = false;
    // Show completion screen
    const container = document.querySelector('.revision-session');
    if (container) {
      container.innerHTML = `
        <h2>تمت المراجعة!</h2>
        <p>لقد أكملت جميع الآيات المستحقة اليوم</p>
      `;
    }
  },
  
  // Streak tracking
  async updateStreak() {
    // Implementation for streak tracking
  }
};

document.addEventListener('DOMContentLoaded', () => MemorizationModule.init());
window.MemorizationModule = MemorizationModule;

export default MemorizationModule;
