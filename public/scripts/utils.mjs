const keys = ['KeyL', 'KeyS'];
export const save = async (content, withBackup) => {
  return await fetch(`/save?payload=${btoa(unescape(encodeURIComponent(content)))}${withBackup ? '&backup=1' : ''}`);
}
export const load = async () => {
  const result = await fetch(`/load`);
  return decodeURIComponent(escape(atob(await result.text())));
}

export const initEditor = async (editor) => {
  document.body.addEventListener('keydown', async (e) => {
    const altCtrlKey = e.ctrlKey || e.altKey;
    const shiftKey = e.shiftKey;
    // console.log(e)
    if(!altCtrlKey || !keys.includes(e.code)) {
      return;
    }
    e.preventDefault();
    const command = e.code === 'KeyL' ? 'load' : 'save';
    console.log(editor.get());
    if(command === 'load') editor.set(await load());
    if(command === 'save') await save(editor.get(), shiftKey);
    return false;
  })
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
    this.#config.elements.forEach(props => {
      const { element, id } = props;
      const el = document.createElement(element);
      el.id = id;
      document.body.appendChild(el);
      this.#elements[id] = el;
    })
    
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
    this.#commandBar = undefined;
  }
}
