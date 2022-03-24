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
    }

    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};

      thisCart.dom.productList = document.querySelector(select.cart.productList);

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.deliveryFee = '' ; //UZUPEŁNIC
      thisCart.dom.subtotalPrice = '' ; //UZUPEŁNIC
      thisCart.dom.totalPrice = ' '; //UZUPEŁNIC
      thisCart.dom.totalNumber = '' ; //UZUPEŁNIC
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
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

      thisCart.update();
    }

    remove(cartProduct) {
        console.log(cartProduct);
    }

    sendOrder() {

    }
  }

  export default Cart;

/*
Dodaj do klasy Cart metodę update i – jak zwykle – zadeklaruj w niej stałą thisCart.

Zacznij od przygotowania stałej z informacją o cenie dostawy. Nazwij ją deliveryFee i nadaj jej wartość zapisaną w odpowiedniej właściwości obiektu settings.

Następnie dodaj dwie kolejne zmienne totalNumber i subtotalPrice. Pierwsza będzie odpowiadała całościowej liczbie sztuk, a druga zsumowanej cenie za wszystko (chociaż bez kosztu dostawy). Każdej z nich przypisz startowo wartość 0.

W kolejnym kroku dodaj pętle for...of, która przejdzie po thisCart.products. Zadbaj o to, aby zwiększała totalNumber o liczbę sztuk danego produktu. Podobnie zwiększ również subtotalPrice o jego cenę całkowitą (właściwość price).

Po zamknięciu pętli zapisz dodatkową właściwość koszyka – thisCart.totalPrice. Jej wartością ma być nasza cena całkowita, czyli kwota potrzebna do kupna wszystkich produktów z koszyka i koszt dostawy.

Uwaga! Pamiętaj, że jeśli w koszyku nie ma ani jednego produktu, to nie ma sensu w cenie końcowej wliczać deliveryFee. Nie ma produktów, więc nie ma dostawy, czyli nie ma kosztów dostawy. Wtedy cena końcowa powinna być a po prostu równa zero. Dlatego na pewno przy ustalaniu thisCart.totalPrice nie obędzie się bez jakiegoś ifa, który sprawdzi, czy w ogóle jest sens doliczać deliveryFee.

Dlaczego tym razem, zamiast tworzyć nową stałą, przypisujemy ją jako właściwość? Z prostego powodu. Stałe są dostępne tylko w danym zakresie. W tym przypadku w zakresie funkcji update. Właściwości są za to dostępne w całej instancji. Tym samym możemy je używać również w innych metodach. deliveryFee czy totalNumber nie będzie nam potrzebne "na zewnątrz", dlatego są one stałymi. totalPrice jednak będziemy już używać w innej metodzie. Tej, która będzie odpowiedzialna za wysyłkę danych do serwera. Musimy więc mieć do niej dostęp na zewnątrz.

Oczywiście możesz się teraz zastanawiać, skąd masz to wiedzieć na tym etapie. Odpowiedź jest prosta – nie musisz. Tak naprawdę, gdybyśmy na razie skorzystali ze zwykłej stałej, nic by się nie stało. Później, podczas pisania funkcji służącej do wysyłania danych do serwera, i tak zauważylibyśmy potrzebę dostępu do tej informacji. Nic nie stałoby na przeszkodzie, żeby dopiero wtedy zrobić z naszej stałej właściwość. My wyprzedzamy teraz trochę przyszłe potrzeby, ale tylko dlatego, że wiemy, jak całość na końcu będzie wyglądać. Nie oczekujemy jednak podobnego przewidywania od Ciebie. To nie jest jeszcze ten etap nauki, w którym mielibyśmy prawo tego oczekiwać.

zadbaj o to, aby konsola pokazała Ci wszystkie stałe oraz właściwość totalPrice. 

Wróć do metody update i zadbaj o to, aby odpowiednio aktualizowała ona HTML naszego koszyka. W taki sposób, aby użytkownik widział poprawną liczbę sztuk, cenę subTotal oraz całkowitą, a także koszt dostawy. Przy czym, jeśli w koszyku jest zero produktów, to koszt dostawy powinien być równy zero.

+ZADANIE: WYCHWYCENIE EVENTU Z KOŃCA 8.6.
*/