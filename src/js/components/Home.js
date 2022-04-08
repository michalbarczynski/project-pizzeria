import {templates} from '../settings.js';
console.log(templates);

class Home {
    constructor(element){
        const thisHomePage = this;
        thisHomePage.render(element);
        thisHomePage.initWidgets();
    }

    render(element) {
        const thisHomePage = this;
        const generatedHTML = templates.homePage();
        thisHomePage.dom = {};
        thisHomePage.dom.wrapper = element;
        thisHomePage.dom.wrapper.innerHTML = generatedHTML;

    }

    initWidgets() {
        //const thisHomePage = this;
    }
}

export default Home;