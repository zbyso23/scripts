export const createElements = (elements, outputNode) => {
    const nodes = {};
    const node = outputNode ? outputNode : document.body;
    elements.forEach(item => {
      const { content, element, id, style } = item;
      const el = document.createElement(element);
      if(id) el.id = id;
      if(style) el.style = style;
      if(content) el.innerHTML = content;
      node.appendChild(el);
      nodes[id] = el;
    });
    return nodes;
  }