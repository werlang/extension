import gasTimer from './gas.js';
import chart from './chart.js';
import api from './api.js';
import { network, cookies, Dropdown, menu } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // cookies.delete('apikey');

    const networkSwitcher = {
        element: document.querySelector('#network-btn'),
        bound: false,

        reload: function() {
            if (!this.bound){
                this.bound = true;
                this.bindClick();
                gasTimer.init();
                chart.init();
            }

            document.querySelector('#header #link').href = `https://owlracle.info/${network.get().symbol}`;

            this.element.removeAttribute('class');
            this.element.classList.add(network.get().symbol);
            this.element.querySelector('img').src = `https://owlracle.info/img/${network.get().symbol}.png`;
            this.element.querySelector('span').innerHTML = network.get().name;

            if (menu.getActive() == 'gas'){
                gasTimer.update();
            }
            if (menu.getActive() == 'chart'){
                chart.timeframeSwitch();
            }
        },

        get: function() {
            return this.element;
        },

        bindClick: function() {
            // network button action
            new Dropdown({
                button: this.element,
                itemList: Object.values(network.getList()).map(e => { return { id: e.symbol, innerHTML: `<img class="icon" src="${e.icon.src}" alt="${e.name} icon"><span class="name">${e.name}</span>` }}),
                clickFn: e => {
                    network.set(e.id);
                    this.reload();
                },
            });
        }
    };

    menu.init();

    // function for gas menu button
    menu.setClick('gas', () => networkSwitcher.reload());
    menu.setClick('chart', () => networkSwitcher.reload());
    menu.setClick('key', () => api.check());

    // check if user is logged with an api key
    let menuOpt = null;
    if (!cookies.get('logged')){
        // cookies.set('apikey', 'd766098dd42c4caebdf0fa7e344a2743',);
        menuOpt = 'key';
    }
    
    menu.click(menuOpt);
});