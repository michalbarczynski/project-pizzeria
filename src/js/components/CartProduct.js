  import {
    select
  } from '../settings.js';
  import AmountWidget from './AmountWidget.js';

  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.amount = menuProduct.amount;

      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
    }

    getElements(element) {
      const thisCartProduct = this;
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amount = element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
    }

    initActions() {
      const thisCartProduct = this;
      thisCartProduct.dom.edit.addEventListener('click', function() {
      });
      thisCartProduct.dom.remove.addEventListener('click', function() {
        thisCartProduct.remove();
      });
    }

    initAmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amount);
      thisCartProduct.dom.amount.addEventListener('updated', function () { 
      thisCartProduct.amount = thisCartProduct.amountWidget.value; 
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price; 
      });
    }

    remove() {
      const thisCartProduct = this;
      
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        }
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    getData() {
      const thisCartProduct = this;
      return {
        id: thisCartProduct.id, 
        amount: thisCartProduct.amount,
        price: thisCartProduct.price,
        priceSingle: thisCartProduct.priceSingle,
        name: thisCartProduct.name,
        params: thisCartProduct.params,
      };
    }
  }
  export default CartProduct;
