import {
    templates, classNames, select
} from '../settings.js';

class Home {
    constructor(element) {
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
        const thisHomePage = this;
        thisHomePage.homeLinks = document.querySelectorAll(select.all.links);

        for (let link of thisHomePage.homeLinks) {
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
        thisHomePage.pages = document.querySelector(select.containerOf.pages).children;
        thisHomePage.navLinks = document.querySelectorAll(select.nav.links);

        for (let page of thisHomePage.pages) {
            page.classList.toggle(classNames.pages.active, page.id == pageId);
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