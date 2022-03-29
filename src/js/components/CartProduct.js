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
        event.preventDefault();
        //TUTEJ FUNKCJA
      });
      thisCartProduct.dom.remove.addEventListener('click', function() {
        event.preventDefault();
        thisCartProduct.remove();
        //TUTEJ FUNKCJA
      });
    }

    initAmountWidget() {
      const thisCartProduct = this;

      //TUTEJ MUSI BYĆ POZMIENIANE
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom);//dom.amount??
      thisCartProduct.amountWidgetElem.addEventListener('updated', function () { ////dom.amount zamiast amountwidgetelem??
      thisCartProduct.amount = thisCartProduct.amountWidget.value; 
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price; 
      thisCartProduct.processOrder(); //jest potrzebne?
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
      console.log('remove button clckd!!!!!!11');
    }

    getData() {
      const thisCartProduct = this;
      console.log(thisCartProduct);
      
      /*
      Zadbaj o to, aby zwracała ona nowy obiekt, z całej instancji thisCartProduct, które naprawdę będą potrzebne w momencie zapisywania zamówienia, a więc id, amount, price, priceSingle, name i params.
      */
    }
  }
  export default CartProduct;
