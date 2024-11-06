export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "그라운드 룰 작성" }],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "코어 시간" }],
    },
    {
      type: "codeBlock",
      attrs: { language: "js" },
      content: [
        { type: "text", text: "const boostcamp = {\n  growth: True;\n}" },
      ],
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "📅 데일리 스크럼",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "text",
              text: "🧑🏻‍💻 코드 리뷰 & 머지",
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "text",
              text: "📝 문서화",
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "text",
              text: "📢 모더레이터 (각종 회의 및 스크럼)",
            },
          ],
        },
      ],
    },

    {
      type: "paragraph",
      content: [
        {
          type: "math",
          attrs: {
            latex: "E = mc^2",
          },
        },
      ],
    },
  ],
};
