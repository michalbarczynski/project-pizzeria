import {
    templates, classNames, select
} from '../settings.js';
console.log(templates);

class Home {
    constructor(element) {
        const thisHomePage = this;
        thisHomePage.render(element);
        thisHomePage.initWidgets();
        thisHomePage.getElements();
    }

    render(element) {
        const thisHomePage = this;
        const generatedHTML = templates.homePage();
        thisHomePage.dom = {};
        thisHomePage.dom.wrapper = element;
        thisHomePage.dom.wrapper.innerHTML = generatedHTML;
    }

    getElements() {
        const thisHomePage = this;

        thisHomePage.pages = document.querySelector(select.containerOf.pages).children;
        thisHomePage.navLinks = document.querySelectorAll(select.nav.links);

        thisHomePage.homeLinks = document.querySelectorAll(select.containerOf.homeLinks);
    }

    initWidgets() {
        const thisHomePage = this;
        for (let link of thisHomePage.navLinks) {
            link.addEventListener('click', function (event) {
                const clickedElement = this;
                event.preventDefault();
                const id = clickedElement.getAttribute('href').replace('#', '');
                thisHomePage.activatePage(id);
                window.location.hash = '#/' + id;
                console.log('pagechange');
            });
        }
    }

    activatePage(pageId) {
        const thisHomePage = this;

        for (let page of thisHomePage.pages) {
            page.classList.toggle(classNames.pages.active, page.id === pageId);
        }
        for (let link of thisHomePage.navLinks) {
            link.classList.toggle(
                classNames.nav.active,
                link.getAttribute('href') === '#' + pageId
            );
        }
    }
}

export default Home;