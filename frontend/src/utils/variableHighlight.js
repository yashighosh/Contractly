import { Node, mergeAttributes } from '@tiptap/core';

/**
 * Custom TipTap Node extension for variables.
 * Using a Node instead of a Mark makes it atomic (users can't edit inside it).
 */
const VariableHighlight = Node.create({
  name: 'variableHighlight',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      'data-var': {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span.variable-highlight',
        getAttrs: (element) => ({
          'data-var': element.getAttribute('data-var') || element.innerText.replace(/[{}]/g, '').trim(),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const varName = HTMLAttributes['data-var'];
    return [
      'span', 
      mergeAttributes({ class: 'variable-highlight', 'data-var': varName }, HTMLAttributes), 
      `{{${varName}}}`
    ];
  },

  addCommands() {
    return {
      insertVariable: (key) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { 'data-var': key },
        });
      },
    };
  },
});

export default VariableHighlight;
