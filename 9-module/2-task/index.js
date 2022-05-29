import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {
  carousel = null;
  ribbonMenu = null;
  stepSlider = null;
  cartIcon = null;
  cart = null;
  products = null;

  constructor() {

  }

  async render() {
    this.renderCarousel();
    this.renderRibbonMenu();
    this.renderStepSlider();
    this.renderCartIcon();
    this.renderCart();

    this.products = await this.getProducts();

    this.renderProductGrid(this.products);

    this.addEventListeners();

    this.productGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });
  }

  renderCarousel () {
    this.carousel = new Carousel(slides);
    document.querySelector('[data-carousel-holder]').append(this.carousel.elem);
  }

  renderRibbonMenu () {
    this.ribbonMenu = new RibbonMenu(categories);
    document.querySelector('[data-ribbon-holder]').append(this.ribbonMenu.elem);
  }

  renderStepSlider () {
    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    document.querySelector('[data-slider-holder]').append(this.stepSlider.elem);
  }

  renderCartIcon () {
    this.cartIcon = new CartIcon();
    document.querySelector('[data-cart-icon-holder]').append(this.cartIcon.elem);
  }

  renderCart () {
    this.cart = new Cart (this.cartIcon);
  }

  async getProducts () {
    const response = await fetch('./products.json');
    return response.json();
  }

  renderProductGrid (products) {
    this.productGrid = new ProductsGrid(products);
    document.querySelector('[data-products-grid-holder]').innerHTML = "";
    document.querySelector('[data-products-grid-holder]').append(this.productGrid.elem);
  }

  addProduct (id) {
    return this.products.find( (product) => product.id === id );
  }

  addEventListeners () {
    document.body.addEventListener('product-add', ({ detail }) => {
      const product = this.addProduct(detail);
      this.cart.addProduct(product);
    });

    this.stepSlider.elem.addEventListener('slider-change', ({ detail }) => {
      this.productGrid.updateFilter({ maxSpiciness: detail });
    });

    this.ribbonMenu.elem.addEventListener('ribbon-select', ({ detail }) => {
      this.productGrid.updateFilter({ category: detail });
    });

    document.querySelector('#nuts-checkbox')
      .addEventListener('change', ({ target: { checked } }) => {
        this.productGrid.updateFilter({ noNuts: checked });
      });

    document.querySelector('#vegeterian-checkbox')
      .addEventListener('change', ({ target: { checked } }) => {
        this.productGrid.updateFilter({ vegeterianOnly: checked });
      });
  }
}
