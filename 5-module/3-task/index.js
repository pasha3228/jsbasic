function initCarousel() {
  const arrowNext = document.querySelector('.carousel__arrow_right');
  const arrowPrev = document.querySelector('.carousel__arrow_left');
  const carousel = document.querySelector('.carousel__inner')
  let currentSlide = 0;

  arrowPrev.style.display = 'none';

  arrowNext.addEventListener('click', moveForward);
  arrowPrev.addEventListener('click', moveBackward);


  function moveForward () {
    arrowPrev.style.display = ''
    currentSlide += 1;

    let carouselSlide = document.querySelector('.carousel__slide');
    let width = carouselSlide.offsetWidth * currentSlide;

    document.querySelector('.carousel__inner').style.transform = `translateX(-${width}px)`;

    if (currentSlide == +carousel.children.length - 1) {
      arrowNext.style.display = 'none';
    };
  };


  function moveBackward () {
    arrowNext.style.display = ''
    currentSlide -= 1;

    let carouselSlide = document.querySelector('.carousel__slide');
    let width = carouselSlide.offsetWidth * currentSlide;

    document.querySelector('.carousel__inner').style.transform = `translateX(-${width}px)`;

    if (currentSlide == 0) {
      arrowPrev.style.display = 'none';
    };
  };
};
