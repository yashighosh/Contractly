import { Mark, mergeAttributes } from '@tiptap/core';

/**
 * Custom TipTap Mark extension that preserves <span class="variable-highlight">
 * elements in the editor. Without this, TipTap strips the spans on content parse/load,
 * causing {{variable}} placeholders to render as plain text or get lost entirely.
 */
const VariableHighlight = Mark.create({
  name: 'variableHighlight',

  // Allow it inside any inline context
  group: 'inline',
  inline: true,

  // Don't let other marks overlap (keep it atomic)
  excludes: '',

  parseHTML() {
    return [
      {
        tag: 'span.variable-highlight',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ class: 'variable-highlight' }, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setVariableHighlight: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      unsetVariableHighlight: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});

export default VariableHighlight;
