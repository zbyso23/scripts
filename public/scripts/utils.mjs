const keys = ['KeyL', 'KeyS'];
export const save = async (editor, withBackup) => {
  console.log('save', editor)
  return await fetch(`/save?payload=${btoa(unescape(encodeURIComponent(editor.get())))}${withBackup ? '&backup=1' : ''}${editor ? '&type=' + editor.id : ''}`);
}
export const load = async (editor) => {
  console.log('load', editor)
  const result = await fetch(`/load?${editor ? 'type=' + editor.id : ''}`);
  editor.set(decodeURIComponent(escape(atob(await result.text()))));
}

export const initEditor = async (editor) => {
  document.body.addEventListener('keydown', async (e) => {
    const altCtrlKey = e.ctrlKey || e.altKey;
    const shiftKey = e.shiftKey;
    console.log(e, editor)
    if(!altCtrlKey || !keys.includes(e.code)) {
      return;
    }
    e.preventDefault();
    const command = e.code === 'KeyL' ? 'load' : 'save';
    if(command === 'load') await load(editor);
    if(command === 'save') await save(editor, shiftKey);
    return false;
  })
}

export const createElements = (elements, outputNode) => {
  const nodes = {};
  const node = outputNode ? outputNode : document.body;
  elements.forEach(item => {
    const { element, id, style } = item;
    const el = document.createElement(element);
    if(id) el.id = id;
    if(style) el.style = style;
    node.appendChild(el);
    nodes[id] = el;
  });
  return nodes;
}

export const initStatus = async () => {
  const config = {
    elements: {
      element: 'div', id: 'menu', style: `
      position: absolute; witdh: 200px; height: 200px; background-color: #FFF;
      `
    }
  }
  const nodes = createElements(config.elements);
  return nodes;
}

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

export class Code
{
  #defaultConfig = {
    elements: [
      { element: 'div', id: 'container', style: 'height:400px;border:1px solid black;' },
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
    const validLanguages = ['javascript', 'typescript', 'python', 'markdown', 'sql', 'php', 'html', 'css'];
    const validLanguage = language && validLanguages.includes(language) ? language : 'javascript';
    const instance = this.#monacoEditor.create(this.#elements.container, {
      value: '',
      language: validLanguage,
      theme: 'vs-dark',
    });
    console.log('instance', instance);
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

