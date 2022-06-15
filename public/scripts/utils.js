const keys = ['KeyL', 'KeyS'];
const save = async (content, withBackup) => {
  return await fetch(`/save?payload=${btoa(unescape(encodeURIComponent(content)))}${withBackup ? '&backup=1' : ''}`);
}
const load = async () => {
  const result = await fetch(`/load`);
  return decodeURIComponent(escape(atob(await result.text())));
}

const initEditor = async (editor) => {
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