import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  #template = null;



  constructor() {
    this.#template = `
    <div class="modal">
      <div class="modal__overlay"></div>

      <div class="modal__inner">
        <div class="modal__header">
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>

          <h3 class="modal__title">

          </h3>
        </div>

        <div class="modal__body">

        </div>
      </div>

    </div>`;

    this.#render();

  }

  #render () {
    this.#template = createElement(this.#template);
  }

  open () {
    document.body.append(this.#template);
    document.body.classList.add('is-modal-open');
    this.#addEventListeners();
  }

  setTitle (modalTitle) {
    let title = this.#template.querySelector('.modal__title');
    title.textContent = modalTitle;
  }

  setBody (node) {
    let body = this.#template.querySelector('.modal__body');

    if (body) {
      body.innerHTML = '';
      body.append(node);
    }
  }

  close () {
    let modal = document.body.querySelector('.modal');

    if (modal) {
      modal.remove();
      document.body.classList.remove('is-modal-open');
    }
  }

  #addEventListeners () {
    let button = this.#template.querySelector('.modal__close');
    button.onclick = () => {
      this.close();
    }

    let escapeClose = function (event) {
      if (event.code == 'Escape') {
        let modal = document.body.querySelector('.modal');

        if(modal) {
          modal.remove();
          document.body.classList.remove('is-modal-open');
        }
      }
      document.removeEventListener('keydown', escapeClose);
    }

    document.addEventListener('keydown', escapeClose);
  }
}
