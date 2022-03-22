
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
    }

    initActions() {
      //const thisCartProduct = this;
    }

    initAmountWidget() {
      //const thisCartProduct = this;
    }

    remove() {
      //const thisCartProduct = this;
    }

    getData() {
      //const thisCartProduct = this;
    }
  } 
  export default CartProduct; 