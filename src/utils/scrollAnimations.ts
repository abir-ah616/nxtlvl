export const initializeScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        element.classList.add('animate-scrollReveal');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all elements with scroll-reveal class
  const elementsToAnimate = document.querySelectorAll('.scroll-reveal');
  elementsToAnimate.forEach((el) => {
    const element = el as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(element);
  });

  return observer;
};

export const addScrollRevealClass = (element: HTMLElement) => {
  element.classList.add('scroll-reveal');
};