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
  }

  #changeProgress (valuePercents) {
    let sliderThumb = this.#elem.querySelector('.slider__thumb');
    let sliderProgress = this.#elem.querySelector('.slider__progress');
    let sliderSteps = this.#elem.querySelector('.slider__steps');

    sliderThumb.style.left = `${valuePercents}%`;
    sliderProgress.style.width = `${valuePercents}%`;

    for ( let i = 0; i < sliderSteps.children.length; i++) {
      sliderSteps.children[i].classList.remove('slider__step-active');
    }
    sliderSteps.children[this.value].classList.add('slider__step-active');
  }

  #getValue (event, clientCoordinate) {
    let left = clientCoordinate - this.#elem.getBoundingClientRect().left;
    let leftRelative = left / this.#elem.offsetWidth;
    let segments = this.steps - 1;
    let newValue = Math.round(leftRelative * segments);

    let valuePercents = newValue / segments * 100;
    this.#changeValue(newValue);
    this.#changeProgress(valuePercents);
  }

  #getDragAndDropValue (event, slider, clientCoordinate) {
    let newLeft = clientCoordinate - slider.getBoundingClientRect().left;
    let leftRelative = newLeft / slider.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    };

    if (leftRelative > 1) {
      leftRelative = 1;
    };

    let valuePercents = leftRelative * 100;
    let segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    let newValue = Math.round(approximateValue);

    this.#changeValue(newValue);
    this.#changeProgress(valuePercents);
  }

  #addEventListeners () {
    const slider = this.#elem;
    const sliderThumb = slider.querySelector('.slider__thumb');

    this.#elem.onclick = (event) => {
      this.#getValue(event, event.clientX);

      this.#elem.dispatchEvent (new CustomEvent ('slider-change', {
        detail: this.value,
        bubbles: true,
      }));
    };

    sliderThumb.ondragstart = () => false;

    sliderThumb.addEventListener('pointerdown', (event) => {
      event.preventDefault();

      slider.classList.add('slider_dragging');

      const thumbMove = (event) => {
        event.preventDefault();

        this.#getDragAndDropValue(event, slider, event.clientX);
      };

      const thumbDrop = (event) => {
        slider.classList.remove('slider_dragging');

        let { right, left } = slider.getBoundingClientRect();

        let clientCoordinate = event.clientX;

        if (event.clientX > right) {
          clientCoordinate = right;
        }

        if (event.clientX < left) {
          clientCoordinate = left;
        }

        this.#getValue(event, clientCoordinate);

        slider.dispatchEvent(new CustomEvent('slider-change', {
          detail: this.value,
          bubbles: true,
        }));

        document.removeEventListener('pointermove', thumbMove);
        document.removeEventListener('pointerup', thumbDrop);
      };

      document.addEventListener('pointermove', thumbMove);
      document.addEventListener('pointerup', thumbDrop);
    });
  }
}
