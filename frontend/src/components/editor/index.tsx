import { useEffect, useState } from "react";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
  type EditorInstance,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";

import "./prosemirror.css";
import { slashCommand, suggestionItems } from "./slash-commands";
import { defaultExtensions } from "./extensions";
import { Separator } from "./ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";

import { useDebouncedCallback } from "use-debounce";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  pageId: number;
  initialValue?: JSONContent;
  onChange?: (value: JSONContent) => void;
}

const Editor = ({ pageId, initialValue }: EditorProp) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    initialValue === undefined ? null : initialValue,
  );

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-expect-error - highlightElement is not in the types
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      if (pageId === undefined) return;

      const json = editor.getJSON();
      window.localStorage.setItem(
        "html-content",
        highlightCodeblocks(editor.getHTML()),
      );
      window.localStorage.setItem(pageId.toString(), JSON.stringify(json));
      window.localStorage.setItem(
        "markdown",
        editor.storage.markdown.getMarkdown(),
      );
    },

    500,
  );

  useEffect(() => {
    const content = window.localStorage.getItem(pageId.toString());
    if (content) setInitialContent(JSON.parse(content));
  }, [pageId]);

  console.log(initialContent);

  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialContent === null ? undefined : initialContent}
        className="relative h-[720px] w-[520px] overflow-auto border-muted bg-background bg-white sm:rounded-lg sm:border sm:shadow-lg"
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
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
        }}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:cursor-pointer hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
        >
          {" "}
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <MathSelector />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;
