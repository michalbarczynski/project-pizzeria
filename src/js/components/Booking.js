import {templates, settings, select} from '../settings.js';
import utils from '../utils.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import AmountWidget from './AmountWidget.js';

class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
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
    }

    initWidgets() {
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hourAmount = new AmountWidget(thisBooking.dom.hourAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    }

    getData() {
        const thisBooking = this;
        const params = {
            booking: [
            settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate), 
            settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate), 
        ],
            eventsCurrent: [],
            eventsRepeeat: [],
        };   

        console.log('getData params', params);

        const urls = {
            booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
            eventsRepeeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeeat.join('&'),
        };

        console.log(urls);
    }
}

export default Booking;

