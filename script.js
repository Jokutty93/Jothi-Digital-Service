/*
   Jothi Digital Service - JavaScript Interactions
   Premium, Interactive, Optimized & SEO Friendly
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. LOADING SCREEN DISMISSAL
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    window.addEventListener('load', () => {
      loadingOverlay.style.opacity = '0';
      loadingOverlay.style.visibility = 'hidden';
      setTimeout(() => {
        loadingOverlay.remove();
      }, 500);
    });
    // Fallback if load event takes too long
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      loadingOverlay.style.visibility = 'hidden';
    }, 2500);
  }

  // 2. HEADER SCROLL EFFECT
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load

  // 3. DARK MODE TOGGLE WITH PERSISTENCE
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      // Add a transition class to body to prevent flashing transition on all elements
      document.body.classList.add('theme-transition');
      
      const currentTheme = document.documentElement.getAttribute('data-theme');
      let newTheme = 'light';
      
      if (currentTheme === 'light') {
        newTheme = 'dark';
      }
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Clean up transition class
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 250);
    });
  }

  // 4. MOBILE NAVIGATION MENU
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });

    // Close side menu if clicked outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target) && mobileNav.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      }
    });
  }

  // 5. TESTIMONIALS SLIDER
  const sliderWrapper = document.getElementById('sliderWrapper');
  const slides = document.querySelectorAll('.slide-item');
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let slideInterval;

  if (sliderWrapper && slides.length > 0) {
    // Create dots dynamically
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetSlideTimer();
      });
      
      if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const goToSlide = (n) => {
      currentSlide = n;
      sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    };

    const nextSlide = () => {
      let next = currentSlide + 1;
      if (next >= slides.length) next = 0;
      goToSlide(next);
    };

    const startSlideTimer = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };

    const resetSlideTimer = () => {
      clearInterval(slideInterval);
      startSlideTimer();
    };

    startSlideTimer();

    // Swipe/Touch events for testimonial slider
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      if (touchStartX - touchEndX > 50) {
        // Swipe left -> Next slide
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        goToSlide(next);
        resetSlideTimer();
      } else if (touchEndX - touchStartX > 50) {
        // Swipe right -> Prev slide
        let prev = currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        goToSlide(prev);
        resetSlideTimer();
      }
    };
  }

  // 6. NUMERIC COUNTER ANIMATIONS (IntersectionObserver)
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-num');
  let animated = false;

  const startCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;
      
      const timer = setInterval(() => {
        current += 1;
        stat.textContent = current;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        }
      }, Math.max(stepTime, 10)); // Min 10ms step to avoid locking main thread
    });
  };

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          startCounters();
          animated = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  // 7. SCROLL-BASED GRAPHICS ANIMATIONS (IntersectionObserver)
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length > 0) {
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animObserver.unobserve(entry.target); // Trigger only once
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => animObserver.observe(el));
  }

  // 8. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. FAQ ACCORDION TIMELINES
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const body = parent.querySelector('.faq-body');
      
      // Close other FAQs if active
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parent && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-body').style.maxHeight = '0';
        }
      });

      parent.classList.toggle('active');
      if (parent.classList.contains('active')) {
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.style.maxHeight = '0';
      }
    });
  });

  // 10. LIVE CONTACT FORM VALIDATION
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const phoneInput = document.getElementById('formPhone');
  const messageInput = document.getElementById('formMessage');

  const setError = (element, message) => {
    const group = element.parentElement;
    const errorDisplay = group.querySelector('.form-error-msg');
    
    group.classList.add('error');
    if (errorDisplay) errorDisplay.textContent = message;
  };

  const setSuccess = (element) => {
    const group = element.parentElement;
    group.classList.remove('error');
  };

  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val) {
      setError(nameInput, 'Name is required.');
      return false;
    }
    if (val.length < 2) {
      setError(nameInput, 'Name must be at least 2 characters.');
      return false;
    }
    setSuccess(nameInput);
    return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setError(emailInput, 'Email address is required.');
      return false;
    }
    if (!emailRegex.test(val)) {
      setError(emailInput, 'Please enter a valid email address.');
      return false;
    }
    setSuccess(emailInput);
    return true;
  };

  const validatePhone = () => {
    const val = phoneInput.value.trim();
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    if (!val) {
      setError(phoneInput, 'Phone number is required.');
      return false;
    }
    if (!phoneRegex.test(val)) {
      setError(phoneInput, 'Please enter a valid phone number (10+ digits).');
      return false;
    }
    setSuccess(phoneInput);
    return true;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    if (!val) {
      setError(messageInput, 'Message is required.');
      return false;
    }
    if (val.length < 10) {
      setError(messageInput, 'Message must be at least 10 characters.');
      return false;
    }
    setSuccess(messageInput);
    return true;
  };

  if (contactForm) {
    // Add real-time change validation
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);
    messageInput.addEventListener('input', validateMessage);

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameVal = validateName();
      const isEmailVal = validateEmail();
      const isPhoneVal = validatePhone();
      const isMsgVal = validateMessage();

      if (isNameVal && isEmailVal && isPhoneVal && isMsgVal) {
        // Form is valid! Perform live asynchronous email post
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner" style="width: 20px; height: 20px; display: inline-block; border-width: 2px;"></span> Sending Inquiry...';
        
        const payload = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          message: messageInput.value.trim()
        };

        fetch("https://formsubmit.co/ajax/jothi.rams@protonmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (response.ok) {
            alert(`Thank you, ${payload.name}! Your inquiry has been sent successfully. We will get back to you shortly.`);
            contactForm.reset();
            // Clear error highlights
            document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('error'));
          } else {
            alert("Oops! Something went wrong. Please try again or email us directly at jothi.rams@protonmail.com.");
          }
        })
        .catch(error => {
          console.error("Form submission network error:", error);
          alert("Network error. Please check your internet connection or email us directly at jothi.rams@protonmail.com.");
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
      }
    });
  }

  // 11. NEWSLETTER FORM HANDLER
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const email = input.value.trim();
      
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert(`Thank you for subscribing to our newsletter!`);
        input.value = '';
      } else {
        alert(`Please enter a valid email address.`);
      }
    });
  }
});
