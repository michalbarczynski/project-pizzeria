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
        thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan); //dom.wrapper
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.allTables);
        thisBooking.dom.tableSelected = document.querySelector(select.booking.tableSelected);
        thisBooking.dom.address = document.querySelector(select.booking.address);
        thisBooking.dom.phone = document.querySelector(select.booking.phone);
        thisBooking.dom.button = document.querySelector(select.booking.button);
        thisBooking.dom.starters = document.querySelectorAll(select.booking.starters);
    }

    initWidgets() {
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hourAmount = new AmountWidget(thisBooking.dom.hourAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        thisBooking.dom.wrapper.addEventListener('updated', function (event) {
            thisBooking.updateDOM();
            thisBooking.initTables(event);
        });
        thisBooking.dom.floorPlan.addEventListener('click', function (event) {
            thisBooking.initTables(event);
        });
        thisBooking.dom.button.addEventListener('submit', function (event) {
            event.preventDefault();
            thisBooking.sendBooking();
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
    
    clearSelected(tableID) {
        const thisBooking = this;
        for (let table of thisBooking.dom.tables) {
            if (table.getAttribute(settings.booking.tableIdAttribute) !== tableID) {
                table.classList.remove(classNames.booking.tableSelected);
            }
        }
        thisBooking.tableNumber = null;
    }

    initTables(event) {
        const thisBooking = this;
        const clickedTable = event.target;
        let tableID = clickedTable.getAttribute(settings.booking.tableIdAttribute);
      
        if (clickedTable.classList.contains('table')) {
            if (clickedTable.classList.contains(classNames.booking.tableBooked)) {
                alert('table is reserved; please choose another one');
            } else {
            if (!clickedTable.classList.contains(classNames.booking.tableSelected)) {
                thisBooking.tableNumber = tableID; 
            }
            thisBooking.clearSelected(tableID);
            clickedTable.classList.toggle(classNames.booking.tableSelected);
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
            phone: thisBooking.dom.phone.value,
            address: thisBooking.dom.address.value,
        };

        for (let starter of thisBooking.dom.starters) {
            if(starter.checked)
            payload.starters.push(starter.value);
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
            })
            .then(function (parsedResponse) {
                console.log('parsedResponse', parsedResponse);
                //thisBooking.clearSelected();
            })
            .then(function () {
                thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
            });
    }
}

export default Booking;

/*
Zadbanie o to, aby próba wysyłki formularza, kończyła się włączeniem funkcji sendBooking.
Przygotowanie funkcji sendBooking, która wyśle pod adres localhost:3131/bookings obiekt o następującej strukturze:
*/