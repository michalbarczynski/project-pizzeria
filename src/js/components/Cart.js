import {select, classNames, settings, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

console.log(classNames);
console.log(settings);

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

      thisCart.dom.productList = document.querySelector(select.cart.productList);

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    }

    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle('active');
      });
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
    }

    update() {
      const thisCart = this;
      const deliveryFee = select.cart.deliveryFee;
      thisCart.totalNumber = 0; 
      thisCart.subtotalPrice = 0;

      for(const product of thisCart.products){
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      }

      if (thisCart.totalNumber !== 0) {
        thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
      } else {
        thisCart.deliveryFee = 0;
        thisCart.totalPrice = 0;
      }
      
    }

    //W BLOKACH POSZCZEGÓLNYCH LOOPÓW TRZEBA ZMIENIĆ LET NA CONST
    add(menuProduct) {
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      thisCart.dom.productList.appendChild(generatedDOM);
      console.log(thisCart.dom.productList);
      console.log('adding product', menuProduct);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

      console.log('thisCart.products', thisCart.products);
      thisCart.update();
    }

    remove(cartProduct) {
        console.log(cartProduct);
    }

    sendOrder() {

    }
  }

  export default Cart;
