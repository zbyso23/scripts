import { load, save } from './files.mjs';
import { createElements } from './dom.mjs';
import { keys } from './constants.mjs';

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

export const initStatus = async (language) => {
  const config = {
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
        element: 'div', id, content: id, style: `width: 100vw; background-color: #DDD; padding: 20px 30px; cursor: pointer; color: #333; font-weight: bold; font-size: 24px; text-transform: uppercase; box-sizing: border-box;`
      }
    })
  }
  const nodes = createElements(config.elements);
  const menuNodes = createElements(config.menuElements, nodes.list);
  Object.entries(menuNodes).forEach(([id, node]) => node.addEventListener('click', (e) => {
    console.log('click '+id, node);
    const current = window.location.pathname.substring(1) === '' ? 'markdown' : window.location.pathname.substring(1);
    if(id === current) return;
    window.location.pathname = id === 'markdown' ? '/' : `/${id}`;
  }));
  let menuOpen = false;
  nodes.menu.addEventListener('click', (e) => {
    menuOpen = !Boolean(menuOpen);
    nodes.list.style.display = menuOpen ? 'block' : 'none';
    // if(!menuOpen) return;
  })
  return nodes;
}

