import { Schema } from 'prosemirror-model';

export const novelEditorSchema = new Schema({
  nodes: {
    doc: { content: 'block+' }, // 문서 루트 노드

    paragraph: {
      content: 'text*',
      group: 'block',
      toDOM: () => ['p', 0],
      parseDOM: [{ tag: 'p' }],
    },

    text: { group: 'inline' }, // 텍스트 노드

    taskList: {
      content: 'taskItem+',
      group: 'block',
      toDOM: () => ['ul', 0],
      parseDOM: [{ tag: 'ul' }],
    },

    taskItem: {
      content: 'paragraph*',
      attrs: { checked: { default: false } },
      toDOM: (node) => [
        'li',
        { class: node.attrs.checked ? 'checked' : '' },
        0,
      ],
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom) {
            return { checked: dom.classList.contains('checked') };
          },
        },
      ],
    },

    heading: {
      attrs: { level: { default: 1 } },
      content: 'text*',
      group: 'block',
      toDOM: (node) => [`h${node.attrs.level}`, 0],
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
      ],
    },

    bulletList: {
      content: 'listItem+',
      group: 'block',
      attrs: { tight: { default: false } },
      toDOM: () => ['ul', 0],
      parseDOM: [{ tag: 'ul' }],
    },

    orderedList: {
      content: 'listItem+',
      group: 'block',
      attrs: { tight: { default: false }, start: { default: 1 } },
      toDOM: (node) => ['ol', { start: node.attrs.start }, 0],
      parseDOM: [{ tag: 'ol' }],
    },

    listItem: {
      content: 'paragraph*',
      toDOM: () => ['li', 0],
      parseDOM: [{ tag: 'li' }],
    },

    codeBlock: {
      content: 'text*',
      attrs: { language: { default: null } },
      toDOM: (node) => ['pre', ['code', { class: node.attrs.language }, 0]],
      parseDOM: [
        {
          tag: 'pre',
          getAttrs(dom) {
            return { language: dom.getAttribute('class') };
          },
        },
      ],
    },

    blockquote: {
      content: 'paragraph+',
      group: 'block',
      toDOM: () => ['blockquote', 0],
      parseDOM: [{ tag: 'blockquote' }],
    },

    youtube: {
      attrs: {
        src: {},
        start: { default: 0 },
        width: { default: 640 },
        height: { default: 480 },
      },
      toDOM: (node) => [
        'iframe',
        {
          src: node.attrs.src,
          width: node.attrs.width,
          height: node.attrs.height,
          frameborder: '0',
          allow:
            'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: true,
        },
      ],
      parseDOM: [
        {
          tag: 'iframe',
          getAttrs(dom) {
            return {
              src: dom.getAttribute('src'),
              width: dom.getAttribute('width'),
              height: dom.getAttribute('height'),
            };
          },
        },
      ],
    },

    twitter: {
      attrs: {
        src: {},
      },
      toDOM: (node) => [
        'blockquote',
        { class: 'twitter-tweet' },
        ['a', { href: node.attrs.src }, 0],
      ],
      parseDOM: [
        {
          tag: 'blockquote.twitter-tweet',
          getAttrs(dom) {
            return { src: dom.querySelector('a')?.getAttribute('href') };
          },
        },
      ],
    },
  },

  marks: {},
});
