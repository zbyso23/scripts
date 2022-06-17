export const save = async (editor, withBackup) => {
    console.log('save', editor)
    return await fetch(`/save?payload=${btoa(unescape(encodeURIComponent(editor.get())))}${withBackup ? '&backup=1' : ''}${editor ? '&type=' + editor.id : ''}`);
  }
  export const load = async (editor) => {
    console.log('load', editor)
    const result = await fetch(`/load?${editor ? 'type=' + editor.id : ''}`);
    editor.set(decodeURIComponent(escape(atob(await result.text()))));
  }