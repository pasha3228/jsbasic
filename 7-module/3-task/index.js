import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {

  #elem = null;
  steps = null;
  value = null;

  #template = null;

  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;

    this.#renderSlider();
    this.#addEventListeners();
  }

  get elem() {
    return this.#elem;
  }

  #renderSlider () {
    this.#template = `
    <div class="slider">
      <div class="slider__thumb" style="left: 0%;">
        <span class="slider__value">${this.value}</span>
      </div>
      <div class="slider__progress" style="width: 0%;"></div>
      <div class="slider__steps">
      </div>
    </div>`;

    this.#elem = createElement(this.#template);

    for (let i = 0; i < this.steps; i++) {
      let span = document.createElement('span');
      this.#elem.querySelector('.slider__steps').append(span);
    }

    this.#elem.querySelector('.slider__steps').firstElementChild.classList.add('slider__step-active');
  }

  #changeValue (newValue) {
    let sliderValue = this.#elem.querySelector('.slider__value');

    this.value = newValue;
    sliderValue.textContent = this.value;

    this.#elem.dispatchEvent (new CustomEvent ('slider-change', {
      detail: this.value,
      bubbles: true,
    }))
  }

  #changeProgress (segments) {
    let sliderThumb = this.#elem.querySelector('.slider__thumb');
    let sliderProgress = this.#elem.querySelector('.slider__progress');
    let sliderSteps = this.#elem.querySelector('.slider__steps');

    let valuePercents = this.value / segments * 100;

    sliderThumb.style.left = `${valuePercents}%`;
    sliderProgress.style.width = `${valuePercents}%`;

    for ( let i = 0; i < sliderSteps.children.length; i++) {
      sliderSteps.children[i].classList.remove('slider__step-active');
    }
    sliderSteps.children[this.value].classList.add('slider__step-active');
  }

  #getValue (event) {
    let left = event.clientX - this.#elem.getBoundingClientRect().left;
    let leftRelative = left / this.#elem.offsetWidth;
    let segments = this.steps - 1;
    let newValue = Math.round(leftRelative * segments);

    if ( newValue != this.value) {
      this.#changeValue(newValue);
      this.#changeProgress(segments);
    }

  }

  #addEventListeners () {
    this.#elem.onclick = (event) => {
      this.#getValue(event);
    };
  }
}
