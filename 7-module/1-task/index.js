import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  #categories = [];
  #elem = null;



  constructor(categories) {
    this.#categories = categories;

    this.#render();
    this.#addEventListeners();
  }

  get elem() {
    return this.#elem;
  }

  #render () {
    let template = `
    <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <nav class="ribbon__inner">` + this.#categories.map ( ({id, name}) => `
        <a href="#" class="ribbon__item" data-id="${id}">${name}</a>
        `).join('') +
      `</nav>
      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    </div>`;

    this.#elem = createElement(template);
  }

  #scrollForward () {
    let ribbonInner = this.#elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(350, 0);
  }

  #scrollBackward () {
    let ribbonInner = this.#elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(-350, 0);
  }

  #updateButtons () {
    let ribbonInner = this.#elem.querySelector('.ribbon__inner');
    let scrollLeft = ribbonInner.scrollLeft;

    let scrollWidth = ribbonInner.scrollWidth;
    let clientWidth = ribbonInner.clientWidth;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;

    if (scrollLeft == 0) {
      this.#elem.querySelector('.ribbon__arrow_left').classList.remove('ribbon__arrow_visible');
    } else {
      this.#elem.querySelector('.ribbon__arrow_left').classList.add('ribbon__arrow_visible');
    }

    if (scrollRight < 1) {
      this.#elem.querySelector('.ribbon__arrow_right').classList.remove('ribbon__arrow_visible');
    } else {
      this.#elem.querySelector('.ribbon__arrow_right').classList.add('ribbon__arrow_visible');
    }
  }

  #addEventListeners () {
    this.#elem.onclick = ({target}) => {
      if (target.closest('.ribbon__item')) {

        if (target.nodeName == 'A') {
          event.preventDefault();
        }

        this.#elem.dispatchEvent( new CustomEvent ('ribbon-select', {
          detail: target.closest('[data-id]').dataset.id,
          bubbles: true,
        }));

        let ribbonInner = this.#elem.querySelector('.ribbon__inner');
        for (let i = 0; i < ribbonInner.children.length; i++) {
          ribbonInner.children[i].classList.remove('ribbon__item_active');
        }
        target.classList.add('ribbon__item_active');
      }

      this.#elem.querySelector('.ribbon__inner').onscroll = () => {
        this.#updateButtons();
      }

      if (target.closest('.ribbon__arrow_right')) {
        this.#scrollForward();
      }

      if (target.closest('.ribbon__arrow_left')) {
        this.#scrollBackward();
      }
    }
  }
}
