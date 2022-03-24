class Booking {
    constructor(){
        
    }
}

export default Booking;

/*
Zadbaj, aby metoda ta:

znajdowała kontener widgetu do rezerwacji stron, którego selektor mamy zapisany w select.containerOf.booking,

tworzyła nową instancję klasy Booking i przekazywała do konstruktora kontener, który przed chwilą znaleźliśmy,


Czyli od tego momentu, JS powinien na starcie aplikacji "z automatu" uruchamiać metodę app.initBooking, która utworzy nową instancję Booking, przekazując jej dostęp do całego kontenera na podstronie /booking. Musimy teraz zadbać, aby ta klasa faktycznie generowała cały widok, na razie bowiem nie robi nic. Jest pusta.

W samej klasie Booking przygotuj więc konstruktor, który:

odbiera referencję do kontenera przekazaną w app.initBooking, jako argument (np. o nazwie element),
wywołuje metodę render, przekazując tę referencję dalej (render musi mieć w końcu dostęp do kontenera),
wywołuje metodę initWidgets bez argumentów.
Następnie zajmij się metodą render.

Jej zadaniem jest:

generowanie kodu HTML za pomocą szablonu templates.bookingWidget, przy czym nie musimy przekazywać do niego żadnych danych, gdyż ten szablon nie oczekuje na żaden placeholder,
utworzenie pustego obiektu thisBooking.dom,
dodanie do tego obiektu właściwości wrapper i przypisanie do niej referencji do kontenera (jest dostępna w argumencie metody),
zmiana zawartości wrappera (innerHTML) na kod HTML wygenerowany z szablonu.
Etap 2
Na końcu, czas zająć się naszymi inputami "Hours amount" i "People amount".

Musimy zacząć od przygotowania dostępu do obu inputów. W metodzie render dodaj więc dwie nowe właściwości: dom.peopleAmount i dom.hoursAmount. Powinny być one referencjami odpowiednio do inputów "People amount" i "Hours amount". Selektory do nich znajdziesz w obiekcie select.booking. Żeby z niego korzystać, koniecznie go najpierw zaimportuj.

Następnie zajmij się metodą initWidgets. Zanim jednak do niej przejdziesz, zaimportuj do pliku klasę AmountWidget. Potem, już w samej metodzie, zadbaj o utworzenie nowych instancji AmountWidget na obu przygotowanych wcześniej elementach. Możesz wzorować się na metodzie CartProduct.initAmountWidget. Pamiętaj, że teraz tworzymy dwa widgety, a nie jeden, i nie potrzebujemy jeszcze robić nic w momencie wykrycia zmiany. Nasłuchiwacze mogą więc już istnieć, ale ich funkcje callback nie muszą niczego przeliczać ani uruchamiać. Na dobrą sprawę, funkcje callback mogą być nawet na razie puste.

W efekcie tych zmian powinniśmy zobaczyć na podstronie Booking formularz z mapą restauracji, wygenerowany na podstawie szablonu, a klikanie guzików z plusem i minusem na inputach "People amount" i "Hours amount" powinno zmieniać wartości dla liczby osób oraz godzin.

Zauważ, że nasza klasa stosuje dokładnie te same pomysły, które znamy chociażby z klasy Cart. Wszystkie właściwości trzymamy w obiekcie this.dom. Widgety ilości tworzymy w initWidgets itd.
*/