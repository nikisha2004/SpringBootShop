document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }

  // Hero carousel functionality
  const heroImages = document.querySelector('.hero-images');
  const heroDots = document.querySelectorAll('.hero-dot');
  
  if (heroImages && heroDots.length > 0) {
    let currentHero = 0;
    const totalHero = heroDots.length;
    
    const updateHero = (index) => {
      currentHero = index;
      const translateX = -(currentHero * (100 / totalHero));
      heroImages.style.transform = `translateX(${translateX}%)`;
      
      heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentHero);
      });
    };
    
    const nextHero = () => updateHero((currentHero + 1) % totalHero);
    const prevHero = () => updateHero((currentHero - 1 + totalHero) % totalHero);
    
    // Auto-scroll every 4 seconds
    let heroTimer = setInterval(nextHero, 4000);
    
    // Dot click handlers
    heroDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(heroTimer);
        updateHero(index);
        heroTimer = setInterval(nextHero, 4000);
      });
    });

    // Pause on hover/touch
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
      heroCarousel.addEventListener('mouseenter', () => clearInterval(heroTimer));
      heroCarousel.addEventListener('mouseleave', () => {
        heroTimer = setInterval(nextHero, 4000);
      });

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      
      heroCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(heroTimer);
      });
      
      heroCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            nextHero();
          } else {
            prevHero();
          }
        }
        
        heroTimer = setInterval(nextHero, 4000);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const isFormField = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
      if (isFormField) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        clearInterval(heroTimer);
        prevHero();
        heroTimer = setInterval(nextHero, 4000);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        clearInterval(heroTimer);
        nextHero();
        heroTimer = setInterval(nextHero, 4000);
      }
    });
  }

  // Search modal functionality
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchQuery = document.getElementById('searchQuery');
  
  if (searchModal && searchInput) {
    const openModal = () => {
      searchModal.classList.add('open');
      searchModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => searchQuery?.focus(), 100);
    };
    
    const closeModal = () => {
      searchModal.classList.remove('open');
      searchModal.setAttribute('aria-hidden', 'true');
    };

    // Open on search input focus
    searchInput.addEventListener('focus', openModal);
    
    // Close on overlay click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Search panel chip selection
  function wireChips(container) {
    if (!container) return;
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      
      // Single select within group
      [...container.querySelectorAll('.chip')].forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  }

  wireChips(document.getElementById('typeChips'));
  wireChips(document.getElementById('durChips'));

  // Price range sync
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const minInput = document.getElementById('minInput');
  const maxInput = document.getElementById('maxInput');
  const minLbl = document.getElementById('minLbl');
  const maxLbl = document.getElementById('maxLbl');

  function clamp(val, min, max) { 
    return Math.max(min, Math.min(max, val)); 
  }
  
  function formatINR(n) {
    if (n >= 100000) return Math.floor(n / 100000) + 'L';
    if (n >= 1000) return Math.floor(n / 1000) + 'k';
    return n.toString();
  }
  
  function syncFromSliders() {
    if (!priceMin || !priceMax) return;
    
    let minV = parseInt(priceMin.value, 10) || 0;
    let maxV = parseInt(priceMax.value, 10) || 0;
    
    if (minV > maxV) [minV, maxV] = [maxV, minV];
    
    if (minInput) minInput.value = minV;
    if (maxInput) maxInput.value = maxV;
    if (minLbl) minLbl.textContent = formatINR(minV);
    if (maxLbl) maxLbl.textContent = formatINR(maxV);
  }
  
  function syncFromInputs() {
    if (!minInput || !maxInput) return;
    
    let minV = clamp(parseInt(minInput.value, 10) || 0, 0, 500000);
    let maxV = clamp(parseInt(maxInput.value, 10) || 0, 0, 500000);
    
    if (minV > maxV) [minV, maxV] = [maxV, minV];
    
    if (priceMin) priceMin.value = String(minV);
    if (priceMax) priceMax.value = String(maxV);
    if (minLbl) minLbl.textContent = formatINR(minV);
    if (maxLbl) maxLbl.textContent = formatINR(maxV);
  }

  priceMin?.addEventListener('input', syncFromSliders);
  priceMax?.addEventListener('input', syncFromSliders);
  minInput?.addEventListener('input', syncFromInputs);
  maxInput?.addEventListener('input', syncFromInputs);
  
  // Initialize price sync
  syncFromSliders();

  // Search submit functionality
  const searchSubmit = document.getElementById('searchSubmit');
  if (searchSubmit) {
    searchSubmit.addEventListener('click', performSearch);
  }
  
  if (searchQuery) {
    searchQuery.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  function performSearch() {
    const query = searchQuery?.value.trim() || '';
    const typeChips = document.getElementById('typeChips');
    const durChips = document.getElementById('durChips');
    const withFlights = document.getElementById('withFlights');
    
    const type = typeChips?.querySelector('.chip.active')?.dataset.type || '';
    const duration = durChips?.querySelector('.chip.active')?.dataset.dur || '';
    const minPrice = minInput?.value || '';
    const maxPrice = maxInput?.value || '';
    const flights = withFlights?.checked ? '1' : '';
    
    // Build Thrillophilia search URL
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (type) params.set('type', type);
    if (duration) params.set('duration', duration);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (flights) params.set('with_flights', flights);
    
    const searchUrl = `https://www.thrillophilia.com/search?${params.toString()}`;
    
    // Show loading state
    const originalText = searchSubmit.textContent;
    searchSubmit.textContent = 'Searching...';
    searchSubmit.disabled = true;
    
    setTimeout(() => {
      window.open(searchUrl, '_blank', 'noopener');
      searchSubmit.textContent = originalText;
      searchSubmit.disabled = false;
      searchModal.classList.remove('open');
    }, 1000);
  }

  // Vibes carousel functionality
  const cardsRow = document.getElementById('cardsRow');
  const vibesDots = document.querySelectorAll('.vibes-dot');
  
  if (cardsRow && vibesDots.length > 0) {
    let isScrolling = false;
    let scrollTimeout;

    // Update dots based on scroll position
    const updateVibesDots = () => {
      if (isScrolling) return;
      
      const scrollLeft = cardsRow.scrollLeft;
      const cardWidth = cardsRow.querySelector('.card')?.offsetWidth || 280;
      const gap = 16; // Gap between cards
      const totalCardWidth = cardWidth + gap;
      const activeIndex = Math.round(scrollLeft / totalCardWidth);
      
      vibesDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    };

    // Throttled scroll handler
    cardsRow.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateVibesDots, 100);
    }, { passive: true });

    // Dot click handlers
    vibesDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const cardWidth = cardsRow.querySelector('.card')?.offsetWidth || 280;
        const gap = 16;
        const scrollTarget = index * (cardWidth + gap);
        
        isScrolling = true;
        cardsRow.scrollTo({
          left: scrollTarget,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          isScrolling = false;
          updateVibesDots();
        }, 500);
      });
    });

    // Touch/drag support for cards
    let isDragging = false;
    let startX;
    let scrollStart;
    
    cardsRow.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - cardsRow.offsetLeft;
      scrollStart = cardsRow.scrollLeft;
      cardsRow.style.cursor = 'grabbing';
      cardsRow.style.userSelect = 'none';
    });
    
    cardsRow.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - cardsRow.offsetLeft;
      const walk = (x - startX) * 1.5;
      cardsRow.scrollLeft = scrollStart - walk;
    });
    
    cardsRow.addEventListener('mouseup', () => {
      isDragging = false;
      cardsRow.style.cursor = 'grab';
      cardsRow.style.userSelect = 'auto';
      setTimeout(updateVibesDots, 100);
    });
    
    cardsRow.addEventListener('mouseleave', () => {
      isDragging = false;
      cardsRow.style.cursor = 'grab';
      cardsRow.style.userSelect = 'auto';
    });

    // Touch events for mobile
    let touchStartX = 0;
    
    cardsRow.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    cardsRow.addEventListener('touchend', () => {
      setTimeout(updateVibesDots, 100);
    }, { passive: true });

    // Initialize
    cardsRow.style.cursor = 'grab';
    updateVibesDots();
  }

  // Video hover play/pause functionality
  document.querySelectorAll('.card').forEach((card) => {
    const video = card.querySelector('video');
    const speaker = card.querySelector('.speaker');
    const speakerIcon = speaker?.querySelector('img');
    
    if (video) {
      // Ensure video is muted and paused initially
      video.muted = true;
      video.loop = true;
      video.preload = 'metadata';
      
      // Play on hover (desktop) or intersection (mobile)
      card.addEventListener('mouseenter', () => {
        video.play().catch(e => console.log('Video play failed:', e));
      });
      
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
      
      // Touch play/pause for mobile
      let touchTimeout;
      card.addEventListener('touchstart', () => {
        touchTimeout = setTimeout(() => {
          if (video.paused) {
            video.play().catch(e => console.log('Video play failed:', e));
          } else {
            video.pause();
          }
        }, 200);
      });
      
      card.addEventListener('touchend', () => {
        clearTimeout(touchTimeout);
      });
    }
    
    // Speaker toggle functionality
    if (speaker && video && speakerIcon) {
      speaker.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        video.muted = !video.muted;
        
        // Update speaker icon
        if (video.muted) {
          speakerIcon.src = 'assets/icons/volume-off-dark.svg';
          speakerIcon.alt = 'unmute';
        } else {
          speakerIcon.src = 'assets/icons/volume-on-dark.svg';
          speakerIcon.alt = 'mute';
        }
      });
    }
  });

  // Navbar search typing animation
  const searchDisplayText = document.querySelector('.search-display-text');
  const boldPart = document.querySelector('.bold-part');
  
  if (searchDisplayText && boldPart) {
    const words = ['Countries', 'Destinations', 'Activities', 'Tours'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeAnimation() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        boldPart.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        boldPart.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 1000; // Pause before deleting
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 200;
      }
      
      setTimeout(typeAnimation, typingSpeed);
    }
    
    // Start typing animation when search is not focused
    let typingInterval;
    const startTyping = () => {
      if (!typingInterval) {
        typingInterval = setTimeout(typeAnimation, 500);
      }
    };
    
    const stopTyping = () => {
      if (typingInterval) {
        clearTimeout(typingInterval);
        typingInterval = null;
      }
    };
    
    searchInput.addEventListener('focus', () => {
      searchDisplayText.style.display = 'none';
      stopTyping();
    });
    
    searchInput.addEventListener('blur', () => {
      if (!searchInput.value.trim()) {
        searchDisplayText.style.display = 'block';
        startTyping();
      }
    });
    
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim()) {
        searchDisplayText.style.display = 'none';
        stopTyping();
      } else {
        searchDisplayText.style.display = 'block';
        startTyping();
      }
    });
    
    // Initialize
    startTyping();
  }

  // Utility functions
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Resize handler for responsive adjustments
  const handleResize = throttle(() => {
    // Close mobile menu if screen becomes larger
    if (window.innerWidth >= 768) {
      mobileToggle?.classList.remove('active');
      mobileMenu?.classList.remove('active');
    }
    
    // Update vibes dots on resize
    if (cardsRow) {
      setTimeout(() => {
        const updateVibesDots = () => {
          const scrollLeft = cardsRow.scrollLeft;
          const cardWidth = cardsRow.querySelector('.card')?.offsetWidth || 280;
          const gap = 16;
          const totalCardWidth = cardWidth + gap;
          const activeIndex = Math.round(scrollLeft / totalCardWidth);
          
          document.querySelectorAll('.vibes-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
          });
        };
        updateVibesDots();
      }, 100);
    }
  }, 250);

  window.addEventListener('resize', handleResize);

  // Intersection Observer for performance optimization
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards for animation
  document.querySelectorAll('.card').forEach(card => {
    cardObserver.observe(card);
  });

  // Accessibility improvements
  document.addEventListener('keydown', (e) => {
    // Skip if typing in form elements
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    
    switch(e.key) {
      case 'Escape':
        // Close any open modals/menus
        searchModal?.classList.remove('open');
        mobileMenu?.classList.remove('active');
        mobileToggle?.classList.remove('active');
        break;
      case 'Tab':
        // Ensure focus is visible
        document.body.classList.add('keyboard-nav');
        break;
    }
  });

  // Remove keyboard navigation class on mouse use
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Prevent zoom on double tap for iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Service Worker registration for offline support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    });
  }

  // Error handling for images and videos
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      console.log('Image failed to load:', this.src);
      this.style.display = 'none';
    });
  });

  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', function() {
      console.log('Video failed to load:', this.src);
      this.style.display = 'none';
    });
  });

  // Performance monitoring
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      }
    }, 0);
  });

  // Initialize fade-in animations for elements in viewport
  const initializeVisibleElements = () => {
    document.querySelectorAll('.card, .hero-gradient').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('fade-in');
      }
    });
  };

  // Run on load
  initializeVisibleElements();

  console.log('Vietnam Tour Website initialized successfully');
});