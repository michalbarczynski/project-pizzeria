import {select, templates} from './settings.js';
import utils from './utils.js';

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

      thisCart.dom.productList = document.querySelector(select.containerOf.menu);

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    }

    initActions() {
      const thisCart = this;
      //CZY TU MA BYĆ EVENT.PREVENTDEFAULT
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle('active');
      });
    }

    update() {

    }

    //W BLOKACH POSZCZEGÓLNYCH LOOPÓW TRZEBA ZMIENIĆ LET NA CONST
    add(menuProduct) {
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      //menuProduct.appendChild(thisCart.element);
      thisCart.dom.productList.appendChild(generatedDOM);

      console.log('adding product', menuProduct);
      
      thisCart.products.push(menuProduct);
      console.log('thisCart.products', thisCart.products);
    }

    remove(cartProduct) {
        console.log(cartProduct);
    }

    sendOrder() {

    }
  }

  export default Cart;