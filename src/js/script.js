/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      toggleTrigger: '.cart__summary',
    }
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    db: {
      url: '//localhost:3131',
      products: 'products',
      orders: 'orders',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }

    renderInMenu() {
      const thisProduct = this;

      const generatedHTML = templates.menuProduct(thisProduct.data);

      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }


    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      /* START: add event listener to clickable trigger on event click */
      clickableTrigger.addEventListener('click', function (event) {
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const activeProduct = document.querySelector(select.all.menuProductsActive);
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if (activeProduct && activeProduct != thisProduct.element) {
          activeProduct.classList.remove('active');
        }
        /* toggle active class on thisProduct.element */
        (thisProduct.element).classList.toggle('active');
      });
    }

    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      let price = thisProduct.data.price;

      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];

        for (let optionId in param.options) {
          const option = param.options[optionId];
          const activeProduct = classNames.menuProduct.imageVisible;
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);

          if (optionSelected) {
            if (!option.default) {
              price = price + option.price;
            }
          } else if (option.default) {
            price = price - option.price;
          }
          if (optionImage) {
            if (optionSelected) {
              optionImage.classList.add(activeProduct);
            } else {
              optionImage.classList.remove(activeProduct);
            }
          }
        }
      }
      thisProduct.priceSingle = price;
      price *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
    }

    initOrderForm() {
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });

    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
    }

    addToCart() {
      const thisProduct = this;

      app.cart.add(thisProduct);
    }

    prepareCartProduct() {
      const thisProduct = this;

      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.name,
        amount: thisProduct.amount,
        price: thisProduct.price,
        priceSingle: thisProduct.priceSingle,
        params: {}
      };
      
      return productSummary;
    }
  } 

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.value);
      thisWidget.initActions();
    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      /* Add validation 
      if (thisWidget.value == value && !newValue == null/NaN ) {
        thisWidget.value = newValue;
      }
      JAKA JEST RÓŻNICA MIĘDZY SPRAWDZENIEM CZY INPUT JEST RÓWNY STARTEJ WARTOŚCI A SPRAWDZENIEM CZY NIE JEST RÓWNY NOWEJ WARTOŚCI
      */
      /* TODO: Add validation */

      thisWidget.value = settings.amountWidget.defaultValue;

      if (thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
      } //czy dwa ostatnie warunki w drugim ifie?

      thisWidget.input.value = thisWidget.value;
      thisWidget.announce();
    }

    initActions() {
      const thisWidget = this;
      //CZY TU MA BYĆ EVENT.PREVENTDEFAULT
      thisWidget.input.addEventListener('change', function () {
        thisWidget.setValue(thisWidget.value); 
      });
      thisWidget.linkIncrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value + 1);
      });
      thisWidget.linkDecrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value - 1);
      });
    }

    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element) {
      const thisCart = this;
      
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    }

    initActions() {
      const thisCart = this;
      //CZY TU MA BYĆ EVENT.PREVENTDEFAULT
      thisCart.dom.toggleTrigger.addEventListener('click', function() {
        thisCart.dom.wrapper.classList.toggle('active');
      });
    }

    add(menuProduct) {
      //const thisCart = this;  
      
      console.log('adding product', menuProduct);
    }
  }
  const app = {
    initMenu: function() {
      const thisApp = this;

      for (let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function() {
      const thisApp = this;
      const url = settings.db.url + '/' + settings.db.products;

      fetch(url)
        .then(function (rawResponse) {
          return rawResponse.json();
        })
        .then(function (parsedResponse) {
          /* save parsedResponse as thisApp.data.products */
          thisApp.data.products = parsedResponse;
          /*execute initMenu method */
          return thisApp.initMenu();

        });



      thisApp.data = {};
    },

    initCart: function() {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function() {
      const thisApp = this;
      thisApp.initData();
      thisApp.initCart();
    },
  };

  app.init();
}

//na spotkanie warsztaty zadanie 9.0.3 funkcja sort
