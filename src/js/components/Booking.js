import {
    templates,
    settings,
    select,
    classNames
} from '../settings.js';
import utils from '../utils.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import AmountWidget from './AmountWidget.js';

class Booking {
    constructor(element) {
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.tableSelected;
    }

    render(element) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hourAmount = document.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
        thisBooking.dom.table = document.querySelector(select.booking.table);
        thisBooking.dom.floorPlan = document.querySelector(select.booking.floorPlan);
        thisBooking.dom.address = document.querySelector(select.booking.address);
        thisBooking.dom.phone = document.querySelector(select.booking.phone);
        thisBooking.dom.tableSelected = document.querySelector(select.booking.tableSelected);
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.allTables);
    }

    initWidgets() {
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hourAmount = new AmountWidget(thisBooking.dom.hourAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        thisBooking.dom.wrapper.addEventListener('updated', function () {
            thisBooking.updateDOM();
            thisBooking.initTables();
        });
        thisBooking.dom.floorPlan.addEventListener('click', function () {
            thisBooking.initTables();
        });
    }

    getData() {
        const thisBooking = this;
        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

        const params = {
            bookings: [startDateParam, endDateParam],
            eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
            eventsRepeat: [settings.db.repeatParam, endDateParam],
        };

        const urls = {
            bookings: settings.db.url + '/' + settings.db.bookings + '?' + params.bookings.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'),
            eventsRepeat: settings.db.url + '/' + settings.db.events + '?' + params.eventsRepeat.join('&'),
        };

        Promise.all([
                fetch(urls.bookings),
                fetch(urls.eventsCurrent),
                fetch(urls.eventsRepeat),
            ])
            .then(function (allResponses) {
                const bookingsResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingsResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]);
            })
            .then(function ([bookings, eventsCurrent, eventsRepeat]) {
                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            });
    }

    parseData(bookings, eventsCurrent, eventsRepeat) {
        const thisBooking = this;
        thisBooking.booked = {};

        for (let item of bookings) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for (let item of eventsCurrent) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for (let item of eventsRepeat) {
            if (item.repeat == 'daily') {
                for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }
        thisBooking.updateDOM();
    }

    updateDOM() {
        const thisBooking = this;
        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false;

        if (typeof thisBooking.booked[thisBooking.date] == 'undefined' || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined') {
            allAvailable = true;
        }

        for (let table of thisBooking.dom.tables) {
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if (!isNaN(tableId)) {
                tableId = parseInt(tableId);
            }

            if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }


    makeBooked(date, hour, duration, table) {
        const thisBooking = this;
        if (typeof thisBooking.booked[date] == 'undefined') {
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);
        for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
            if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
                thisBooking.booked[date][hourBlock] = [];
            }
            thisBooking.booked[date][hourBlock].push(table);
        }
    }

    initTables(event) {
        const thisBooking = this;
        const clickedTable = event.target;

        if (clickedTable.classList.contains(select.booking.table) && clickedTable.classList.contains(classNames.booking.tableSelected) || clickedTable.classList.contains(classNames.booking.tableBooked)) { 
            alert('table is reserved; please choose another one');
        } else {
            clickedTable.classList.toggle(classNames.booking.tableSelected);
        }
        for (let table of thisBooking.dom.tables) {
            if (table !== clickedTable) {
                table.classList.remove(classNames.booking.tableSelected);
            }
        }
    }

    sendBooking() {
        const thisBooking = this;
        const url = settings.db.url + '/' + settings.db.bookings;
        const payload = {
            date: thisBooking.datePicker.value,
            hour: thisBooking.hourPicker.value,
            table: thisBooking.tables,
            duration: thisBooking.hourPicker,
            ppl: thisBooking.peopleAmount,
            starters: [],
            phone: thisBooking.phone.value,
            address: thisBooking.address.value,
        };


        for (let starter of thisBooking.payload) {
            payload.starters.push(starter.getData());
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        fetch(url, options)
            .then(function (response) {
                return response.json();
            }).then(function (parsedResponse) {
                console.log('parsedResponse', parsedResponse);
            });
    }
}


export default Booking;

/*
Pamiętaj przy tym, że zanim dodasz do wybranego stolika klasę selected, to należy sprawdzić, czy czasem inny stolik już takiej nie ma. I jeśli ma, to mu ją zabrać. Samej właściwości nie musimy jednak wcześniej zerować, bo przecież i tak za moment nadpiszemy ją numerkiem nowego stolika. Musimy więc zadbać tylko o zabranie klasy staremu stolikowi, samą właściwością się nie martw.

To już naprawdę dużo. Od tej chwili kliknięcie na stolik zajęty, powinno pokazywać od razu alert z informacją o zajętości. Kliknięcie na wolny stolik powinno powodować zmianę jego wyglądu i, co ważniejsze, przypisywać do jakiejś właściwości w Booking informacje o numerze tego wybranego stolika. Co więcej, jeśli w momencie wyboru nowego stoliku, inny był już wybrany wcześniej, to ten wcześniejszy powinien wrócić wyglądem do normalności, czyli stracić klasę selected.

To, co Ci pozostało, to już tylko poniższe funkcjonalności:

wybór stolika powinien być resetowany przy zmianie godziny, daty, liczby gości oraz liczby godzin,
kliknięcie na zaznaczony już stolik po raz kolejny, powinno również resetować wybór zapisany w JS oraz zabierać klasę "wyboru".

*/
