import {
  select,
  templates,
  settings
} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};

    thisCart.dom.productList = document.querySelector(select.cart.productList);

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.deliveryFee = document.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = document.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = document.querySelector(select.cart.totalPrice);
    thisCart.dom.totalNumber = document.querySelector(select.cart.totalNumber);
    thisCart.dom.form = document.querySelector(select.cart.form);
    thisCart.dom.phone = '';
    thisCart.dom.address = '';
  }

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle('active');
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  update() {
    const thisCart = this;
    const deliveryFee = select.cart.deliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (const product of thisCart.products) {
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }

    if (thisCart.totalNumber !== 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
    } else {
      thisCart.deliveryFee = 0;
      thisCart.totalPrice = 0;
    }
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
  }

  //W BLOKACH POSZCZEGÓLNYCH LOOPÓW TRZEBA ZMIENIĆ LET NA CONST
  add(menuProduct) {
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }

  remove(deletedProduct) {
    const thisCart = this;

    /* delete cartProduct in HTML */
    deletedProduct.dom.wrapper.remove();

    /* delete cartProduct from thisCart.products array */
    const indexOfProduct = thisCart.products.indexOf(deletedProduct);
    thisCart.products.splice(indexOfProduct, 1);
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {
      address: '',
      phone: '',
      totalPrice: '',
      subtotalPrice: '',
      totalNumber: '',
      deliveryFee: '',
      products: [],
    };

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch(url, options);
  }
}

export default Cart;

/*
Aby dojść do wartości elementu input, skorzystaj z jego właściwości value.
Bardzo łatwo możesz dojść do wartości totalPrice. Dlaczego? Gdy pisaliśmy metodę update, to zadbaliśmy o to, aby właśnie ta informacja była zapisana jako właściwość (thisCart.totalPrice). Zrobiliśmy to z myślą o przyszłości. Tak, żeby właśnie w takiej sytuacji jak ta, móc łatwo dojść do tej informacji. totalNumber czy subtotalPrice były już jednak w tamtej funkcji zapisywane tylko jako stałe, a co za tym idzie, dostępne tylko w niej... Może więc warto zmodyfikować tamtą metodę? Tak, aby totalNumber i subtotalPrice były również właściwościami? Wtedy będzie można dojść do ich wartości również poza metodę update. Właśnie np. w sendOrder!
*/