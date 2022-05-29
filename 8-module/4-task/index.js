import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

const isEarlyAdded = (items, product) => !items
  .find((item) => item.product.id === product.id);

const getIndex = (items, id) => items.findIndex((item) => item.product.id === id);

const mappingCartCounterButtons = {
  'cart-counter__button_minus': -1,
  'cart-counter__button_plus': 1,
};

const cartCounterButtons = ['cart-counter__button_minus', 'cart-counter__button_plus'];

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    let newProduct;

    if (isEarlyAdded(this.cartItems, product)) {
      newProduct = { product, count: 1 };
      this.cartItems = [...this.cartItems, newProduct];
    } else {
      let index = getIndex(this.cartItems, product.id);
      newProduct = { ...this.cartItems[index], count: this.cartItems[index].count + 1};
      this.cartItems = [...this.cartItems.slice(0, index), newProduct, ...this.cartItems.slice(index + 1)];
    }

    this.onProductUpdate(newProduct);
  }

  updateProductCount(productId, amount) {
    let index = getIndex(this.cartItems, productId);
    let newProductCount = this.cartItems[index].count += amount;
    let newProduct = {...this.cartItems[index], count: newProductCount};

    if (newProductCount === 0) {
      this.cartItems = [...this.cartItems.slice(0 , index), ... this.cartItems.slice(index + 1)];
    } else {
      this.cartItems = [...this.cartItems.slice(0 , index), newProduct, ...this.cartItems.slice(index + 1)];
    }

    this.onProductUpdate(newProduct);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((totalCount, item) => totalCount += item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((totalPrice , item) => totalPrice += item.count * item.product.price, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');

    let modalBody = document.createElement('div');
    this.cartItems.forEach((item) => {
      modalBody.append(this.renderProduct(item.product, item.count));
    });
    modalBody.append(this.renderOrderForm());

    this.modal.setBody(modalBody);

    this.addModalEventListeners(modalBody);

    this.modal.open();
  }

  onProductUpdate(cartItem) {
    if (!this.modal) {
      this.cartIcon.update(this);

      return;
    }

    let productIdSelector = `[data-product-id="${cartItem.product.id}"]`;
    let modalBody= this.modal.elem;

    if (cartItem.count === 0) {
      let cartItemElement = modalBody.querySelector(productIdSelector);
      cartItemElement.remove();
    } else {
      let productCount = modalBody.querySelector(`${productIdSelector} .cart-counter__count`);
      let productPrice = modalBody.querySelector(`${productIdSelector} .cart-product__price`);

      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
    }

    if (modalBody.querySelectorAll('[data-product-id').length === 0) {
      this.modal.close();
      delete this.modal;
      this.cartIcon.update(this);

      return;
    }

    let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

    this.cartIcon.update(this);
  }

  onSubmit(event) {
    event.preventDefault();

    let modalForm = this.modal.elem.querySelector('.cart-form');

    let submitButton = modalForm.querySelector('button[type="submit"]');
    submitButton.classList.add('is-loading');

    let data = new FormData(event.target);

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: data,
    }).then (() => {
      this.modal.setTitle('Success!');
      this.cartItems = [];

      const newModalBody = createElement(`
        <div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="/assets/images/delivery.gif">
          </p>
        </div>
      `);

      this.modal.setBody(newModalBody);
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }

  addModalEventListeners(modal) {
    let cartProducts = modal.querySelectorAll('.cart-product');

    cartProducts.forEach((product) => {
      let productId = product.dataset.productId;

      cartCounterButtons.forEach((button) => {
        let buttonElement = product.querySelector(`.${button}`);

        buttonElement.addEventListener('click', () => {
          this.updateProductCount(productId, mappingCartCounterButtons[button]);
        });
      });
    });

    let cartForm = modal.querySelector('.cart-form');

    cartForm.addEventListener('submit', (event) => {
      this.onSubmit(event);
    });
  }
}

