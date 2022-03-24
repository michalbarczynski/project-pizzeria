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
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom);
      thisCartProduct.amountWidgetElem.addEventListener('updated', function () {
      thisCartProduct.amount; //ZAKTUALIZUJ
      thisCartProduct.price ; //ZAKTUALIZUJ
      thisCartProduct.processOrder();
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
    }
  }
  export default CartProduct;


  /*
    Ćwiczenie
    Zadbaj o to, aby funkcja w nasłuchiwaczu (nasz handler) poprawnie aktualizowała wartość thisCartProduct.amount oraz thisCartProduct.price.

    Powinna również aktualizować kwotę widoczną w samej reprezentacji HTML-a tego produktu. To będzie jednak dość proste zadanie. Na tym etapie cena w thisCartProduct.price będzie już zaktualizowana. Wystarczy więc znaleźć referencję do odpowiedniego elementu w HTML i zaktualizować jego wartość. Przeszukaj w tym celu metodę getElements. Na pewno jest już tam przygotowana odpowiednia referencja.

    HINT:
    Pamiętaj, że aktualna wartość widgetu (czyli liczby sztuk) jest dostępna pod odpowiednią właściwością thisCartProduct.amountWidget
  */