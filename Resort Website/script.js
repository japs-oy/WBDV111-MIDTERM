document.addEventListener('DOMContentLoaded', function() {
  function initCarousel(carouselElement) {
    const slides = carouselElement.querySelectorAll('.slide');
    const dots = carouselElement.querySelectorAll('.dot');
    const prevBtn = carouselElement.querySelector('.carousel-btn.prev');
    const nextBtn = carouselElement.querySelector('.carousel-btn.next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    const totalSlides = slides.length;
    
    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      
      currentSlide = index;
    }
    
    function nextSlide() {
      const nextIndex = (currentSlide + 1) % totalSlides;
      showSlide(nextIndex);
    }
    
    function prevSlide() {
      const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(prevIndex);
    }
    
    showSlide(0);
    
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
      });
    });
    
    // Auto-slide functionality
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    }
    
    // Pause when mouse hovers
    carouselElement.addEventListener('mouseenter', stopAutoSlide);
    carouselElement.addEventListener('mouseleave', startAutoSlide);
    
    startAutoSlide();
  }

  document.querySelectorAll('.carousel').forEach(initCarousel);
});

