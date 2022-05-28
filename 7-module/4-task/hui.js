import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {

  #elem = null;
  steps = null;
  value = null;

  #template = null;

  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;

    this.#render();
    this.#addEventListeners();
  }

  get elem() {
    return this.#elem;
  }

  #render () {
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

  #changeValue () {
    let sliderValue = this.#elem.querySelector('.slider__value');
    let sliderThumb = this.#elem.querySelector('.slider__thumb');
    let sliderProgress = this.#elem.querySelector('.slider__progress');

    let segments = this.steps - 1;
    let valuePercents = this.value / segments * 100;

    sliderThumb.style.left = `${valuePercents}%`;
    sliderProgress.style.width = `${valuePercents}%`;

    this.#elem.querySelector('.slider__value').textContent = this.value;

    let sliderSteps = this.#elem.querySelector('.slider__steps');
    for ( let i = 0; i < sliderSteps.children.length; i++) {
      sliderSteps.children[i].classList.remove('slider__step-active');
    }
    sliderSteps.children[this.value].classList.add('slider__step-active');
  }

  #addEventListeners () {
    this.#elem.onclick = (event) => {
      let left = event.clientX - this.#elem.getBoundingClientRect().left;
      let leftRelative = left / this.#elem.offsetWidth;
      let segments = this.steps - 1;
      let newValue = Math.round(leftRelative * segments);

      if ( newValue != this.value) {
        this.value = newValue;
        this.#elem.dispatchEvent (new CustomEvent ('slider-change', {
          detail: this.value,
          bubbles: true,
        }))
        this.#changeValue();
      }
    }

    let slider = this.#elem;
    let thumb = this.#elem.querySelector('.slider__thumb');
    let progress = this.#elem.querySelector('.slider__progress');
    let thumbValue = this.#elem.querySelector('.slider__value');
    let sliderSteps = this.#elem.querySelector('.slider__steps');
    let segments = this.steps - 1;
    let checkNewValue;

    thumb.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      thumb.ondragstart = (event) => {
        event.preventDefault();
      }

      let shiftX = event.clientX - thumb.getBoundingClientRect().left;

      let onMove = (event) => {
        event.preventDefault();
        slider.classList.add('slider_dragging');


        let newLeft = event.clientX - slider.getBoundingClientRect().left - shiftX;
        let rightBoundary = slider.offsetWidth - thumb.offsetWidth;

        if (newLeft < 0) {
          newLeft = 0;
        }

        if (newLeft > slider.offsetWidth) {
          newLeft = slider.offsetWidth;
        }


        let leftRelative = newLeft / slider.offsetWidth;

        if (leftRelative < 0) {
          leftRelative = 0;
        }

        if (leftRelative > 1) {
          leftRelative = 1;
        }



        let newValue = Math.round(leftRelative * segments);

        for ( let i = 0; i < sliderSteps.children.length; i++) {
          sliderSteps.children[i].classList.remove('slider__step-active');
        }
        sliderSteps.children[newValue].classList.add('slider__step-active');

        let leftPercents = leftRelative * 100;
        thumb.style.left = `${leftPercents}%`;
        progress.style.width = `${leftPercents}%`;

        thumbValue.textContent = newValue;
        if (this.value != newValue){
          this.value = newValue;
          checkNewValue = true;
        } else {
          checkNewValue = false;
        }


      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', () => {
        if (checkNewValue) {
          this.#elem.dispatchEvent(new CustomEvent('slider-change', {
            detail: this.value,
            bubbles: true,
          }))
        }
        slider.classList.remove('slider_dragging');
        document.removeEventListener('pointermove', onMove);
        this.#changeValue();
        document.onpointerup = null;
      })
    })
  }
}
