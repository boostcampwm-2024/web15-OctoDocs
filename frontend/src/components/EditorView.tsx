import usePageStore from "@/store/usePageStore";
import Editor from "./editor";
import { JSONContent } from "novel";

interface Page {
  title: string;
  content?: JSONContent;
}

const pages: Page[] = [
  {
    title: "Page 1",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is page 1" }],
        },
      ],
    },
  },

  {
    title: "Page 2",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is page 2" }],
        },
      ],
    },
  },

  {
    title: "Page 3",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is page 3" }],
        },
      ],
    },
  },
];

const getPageFromID = (id: number) => {
  return pages[id];
};

export default function EditorView() {
  const { currentPage } = usePageStore();
  if (currentPage === null) {
    return null;
  }

  const defaultEditorContent = getPageFromID(currentPage).content;
  if (!defaultEditorContent) {
    return (
      <div>
        페이지를 로딩할 수 없었습니다<div className=""></div>
      </div>
    );
  }

  return (
    <Editor
      key={currentPage}
      initialValue={defaultEditorContent}
      pageId={currentPage}
    />
  );
}
