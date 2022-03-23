  import {select} from '../settings.js';
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
      //const thisCartProduct = this;
    }

    initAmountWidget() {
      const thisCartProduct = this;

      //TUTEJ MUSI BYĆ POZMIENIANE
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.amountWidgetElem);
      thisCartProduct.amountWidgetElem.addEventListener('updated', function () {
        thisCartProduct.amount; //ZAKTUALIZUJ
        thisCartProduct.price; //ZAKTUALIZUJ
        thisCartProduct.processOrder();
      });
    }

    remove() {
      //const thisCartProduct = this;
    }

    getData() {
      //const thisCartProduct = this;
    }
  }
  export default CartProduct;