import { createElements } from './dom.mjs';

export class Markdown
{
  #defaultConfig = {
    elements: [
      { element: 'div', id: 'toolbar' },
      { element: 'div', id: 'editor' },
    ]
  }
  #config = {};
  #elements = {};
  #TinyMDE;
  #tinyMDE;
  #commandBar;

  constructor(TinyMDE, config)
  {
    this.#TinyMDE = TinyMDE;
    this.#config = config ? config : this.#defaultConfig;
  }

  mount = async () => {
    this.#elements = createElements(this.#config.elements);
    this.#tinyMDE = new this.#TinyMDE.Editor({element: 'editor'});
    this.#commandBar = new this.#TinyMDE.CommandBar({element: 'toolbar', editor: this.#tinyMDE});
    return {
      id: 'markdown',
      editor: this.#tinyMDE,
      elements: this.#elements, 
      get: () => this.#tinyMDE.getContent(),
      set: (content) => this.#tinyMDE.setContent(content)
    };
  }

  unmount = () => {
    Object.values(this.#elements).forEach(element => {
      document.body.removeChild(element);
    })
    this.#commandBar = undefined;
    this.#tinyMDE = undefined;
  }
}