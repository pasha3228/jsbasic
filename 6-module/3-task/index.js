import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  #elem = null;
  #slides = [];
  #currentSlideNum = 0;

  constructor(slides) {
    this.#slides = slides;
    this.#elem = document.createElement('div');

    this.#render();
    this.#addEventListeners();
  }

  get elem() {
    return this.#elem;
  }

  #render() {
    let template = `
    <div class="carousel">
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__inner">` + this.#slides.map( ({ name, price, image, id }) => `
        <div class="carousel__slide" data-id="${id}">
          <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${price.toFixed(2)}</span>
            <div class="carousel__title">${name}</div>
            <button type="button" class="carousel__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>
        `).join('') +
      `</div>
    </div>`;

    this.#elem = createElement(template);

    this.#newPosition();
  }

  #newPosition() {
    let carouselSlide = this.#elem.querySelector('.carousel__slide');
    let width = carouselSlide.offsetWidth * this.#currentSlideNum;

    this.#elem.querySelector('.carousel__inner').style.transform = `translateX(-${width}px)`;

    if (this.#currentSlideNum == 0) {
      this.#elem.querySelector('.carousel__arrow_left').style.display = 'none';
    } else {
      this.#elem.querySelector('.carousel__arrow_left').style.display = '';
    };

    if (this.#currentSlideNum == this.#slides.length - 1) {
      this.#elem.querySelector('.carousel__arrow_right').style.display = 'none';
    } else {
      this.#elem.querySelector('.carousel__arrow_right').style.display = '';
    };

  }

  #nextSlide () {
    this.#currentSlideNum += 1;
    this.#newPosition();
  }

  #prevSlide () {
    this.#currentSlideNum -= 1;
    this.#newPosition();
  }

  #addEventListeners () {
    this.#elem.onclick = ({ target }) => {
      if (target.closest('.carousel__button')) {
          this.#elem.dispatchEvent( new CustomEvent('product-add', {
            detail: target.closest('[data-id]').dataset.id,
            bubbles: true,
          }));
      }


      if (target.closest('.carousel__arrow_left')) {
        this.#prevSlide();
      }

      if (target.closest('.carousel__arrow_right')) {
        this.#nextSlide();
      }
    }
  }
}
