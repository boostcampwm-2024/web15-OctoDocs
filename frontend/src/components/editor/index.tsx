import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
  EditorBubbleItem,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultExtensions } from "./extensions";

import { slashCommand } from "./slash-commands";

import "./prosemirror.css";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  initialValue?: JSONContent;
  onChange?: (value: JSONContent) => void;
}
const Editor = ({ initialValue }: EditorProp) => {
  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialValue}
        className="border-muted bg-background relative min-h-[500px] w-[520px] sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="border-muted bg-background z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="text-muted-foreground px-2">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            <EditorCommandItem
              value={"Text"}
              onCommand={(val) => console.log(val)}
              className={`hover:bg-accent aria-selected:bg-accent flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm`}
            >
              <div>
                <p className="font-medium">Text</p>
                <p className="text-muted-foreground text-xs">텍스트</p>
              </div>
            </EditorCommandItem>
            <EditorCommandItem
              value={"Text"}
              onCommand={(val) => console.log(val)}
              className={`hover:bg-accent aria-selected:bg-accent flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm`}
            >
              <div>
                <p className="font-medium">Image</p>
                <p className="text-muted-foreground text-xs">이미지</p>
              </div>
            </EditorCommandItem>
          </EditorCommandList>
        </EditorCommand>
        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="border-muted bg-background flex w-fit max-w-[90vw] overflow-hidden rounded-md border shadow-xl"
        >
          <EditorBubbleItem>안녕</EditorBubbleItem>
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;
