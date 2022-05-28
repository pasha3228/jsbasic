import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

const mappingFilters = {
  noNuts: (value, product) => {
    if (!value) {
      return true;
    }

    return product.nuts != value;
  },

  vegeterianOnly: (value, product) => {
    if (!value) {
      return true;
    }

    return product.vegeterian == value;
  },

  maxSpiciness: (value, product) => product.spiciness <= value,

  category: (value, product) => {
    if (value === "") {
      return true;
    }

    return product.category === value;
  },
};



export default class ProductGrid {
  #products;
  #filters;
  #templateProductGrid;
  #templateProductGridInner;
  #activeFilters;

  constructor(products) {
    this.#products = products;
    this.#filters = {};
    this.#render(products);
  }

  #render () {
    this.elem = this.#renderProductsGrid(this.#products, this.#filters);
  }

  #getFilteredProducts (products, filters) {
    let filteredProducts = products.filter((product) => {
      this.#activeFilters = Object.entries(filters);

      if (this.#activeFilters.length == 0) {
        return true;
      }

      return this.#activeFilters.every(
        ([ filterName, filterValue ]) => mappingFilters[filterName](filterValue, product)
      )
    });

    return filteredProducts;
  }

  #renderProductsGridInner (products) {
    this.#templateProductGrid = document.createElement('div');

    this.#templateProductGrid.classList.add('products-grid__inner');

    this.#templateProductGrid.append(...products.map((product) => {
      let productCard = new ProductCard(product);
      return productCard.elem;
      }));
      return this.#templateProductGrid;
    }

  #renderProductsGrid (products, filters) {
    let productGrid = document.createElement('div');
    productGrid.classList.add('products-grid');

    let filteredProducts = this.#getFilteredProducts(products, filters);

    productGrid.append(this.#renderProductsGridInner(filteredProducts));

    this.#templateProductGrid = productGrid;
    return this.#templateProductGrid;
  }

  updateFilter (filters) {
    this.#filters = {...this.#filters, ...filters};

    this.elem.innerHTML = '';
    let filteredProducts = this.#getFilteredProducts(this.#products, this.#filters);

    this.elem.append(this.#renderProductsGridInner(filteredProducts));
  }
}


