import { createElements } from './dom.mjs';
import { validLanguages } from './constants.mjs';

export class Code
{
  #defaultConfig = {
    elements: [
      { element: 'div', id: 'container', style: 'height:95vh;border:1px solid black;' },
    ]
  }
  #monaco;
  #monacoEditor;
  #config = {};
  #elements = {};

  constructor(monaco, config)
  {
    this.#monaco = monaco;
    this.#monacoEditor = monaco.editor;
    this.#config = config ? config : this.#defaultConfig;
  }

  mount = async (language) => {
    this.#elements = createElements(this.#config.elements);
    const validLanguage = language && validLanguages.includes(language) ? language : 'javascript';
    const instance = this.#monacoEditor.create(this.#elements.container, {
      value: '',
      language: validLanguage,
      theme: 'vs-dark',
    });
    return {
      id: 'code',
      editor: this.#monacoEditor,
      elements: {},
      get: () => this.#monacoEditor.getModels()[0].getValue(),
      set: (content) => this.#monacoEditor.getModels()[0].setValue(content)
    }
  }

  unmount = async () => {
    Object.values(this.#elements).forEach(element => {
      document.body.removeChild(element);
    })
    
  }
}