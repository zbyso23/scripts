import { createElements } from './dom.mjs';
import { validLanguages } from './constants.mjs';


const styleMenuItem = `width: 100vw; background-color: #DDD; padding: 20px 30px; cursor: pointer; color: #333; font-weight: bold; font-size: 24px; text-transform: uppercase; box-sizing: border-box;`;


export class Status {
    #defaultConfig = {
      elements: [
        {
          element: 'div', id: 'menu', style: `position: absolute; width: 100px; height: 100px; background-color: #EEE; top: 0; right: 0; z-index: 1000; cursor: pointer; box-sizing: border-box;`
        },
        {
          element: 'div', id: 'list', style: `position: absolute; width: 100vw; height: 100vh; padding-top: 100px; background-color: #FFF; top: 0; left: 0; z-index: 900; display:none; box-sizing: border-box;`
        },
      ],
      menuElements: ['code', 'markdown'].map(id => {
        return {
          element: 'div', id, content: id, style: styleMenuItem
        }
      })
    }
    #config = {};
    #elements = {};
    #menuElements = {};
    #menuOpen = false;
    #listeners = [];
    #languageElements = {};

    constructor(config) {
      this.#config = config ? config : this.#defaultConfig;
    }

    mount = async () => {
      this.#elements = createElements(this.#config.elements);
      this.#menuElements = createElements(this.#config.menuElements, this.#elements.list);
      Object.entries(this.#menuElements).forEach(([id, node]) => {
        const listener = () => {
          console.log('click '+id, node);
          const current = window.location.pathname.substring(1) === '' ? 'markdown' : window.location.pathname.substring(1);
          if(id === current) return;
          const urlCode = id === 'markdown' ? '' : id;
          window.location = [window.location.origin, urlCode].join('/');
          // window.location.pathname = id === 'markdown' ? '/' : `/${id}`;
          // window.location.hash = '';
          // window.location.reload();
        }
        
        node.addEventListener('click', listener);
        this.#listeners.push([node, listener]);
        if(id !== 'code') return;
        const languages = [];
        validLanguages.forEach(validLanguage => {
          const idLanguage = `${id}#language=${validLanguage}`;
          const contentLanguage = `${id}#language=${validLanguage}`;
          languages.push({
            element: 'div', id: idLanguage, content: contentLanguage, style: styleMenuItem
          })          
        })
        if(languages.length) {
          this.#languageElements = createElements(languages, this.#elements.list);
          Object.entries(this.#languageElements).forEach(([idLanguage, node]) => {
            const listener = () => {
              window.location = `${[window.location.origin, id].join('/')}${'#language='+idLanguage}`;
              window.location.reload();
            }
            node.addEventListener('click', listener);
            this.#listeners.push([node, listener]);
          })
        }
      }
      );
      this.#elements.menu.addEventListener('click', this.toggle);

    }

    toggle = () => {
      this.#menuOpen = !Boolean(this.#menuOpen);
      this.#elements.list.style.display = this.#menuOpen ? 'block' : 'none';
    }

    unmount = async () => {
      this.#elements.menu.removeEventListener('click', this.toggle);
      this.#listeners.forEach(item => {
        const [node, listener] = item;
        node.removeEventListener(listener);
      })
      this.#listeners.length = 0;
    }
}