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
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import "./prosemirror.css";
import { slashCommand, suggestionItems } from "./slash-commands";
import { defaultExtensions } from "./extensions";
import { Separator } from "./ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";

const extensions = [...defaultExtensions, slashCommand];

type EditorUpdateEvent = {
  editor: EditorInstance;
};
interface EditorProp {
  pageId: number;
  initialContent?: JSONContent;
  onEditorUpdate?: (event: EditorUpdateEvent) => void;
  ydoc: Y.Doc;
  provider: WebsocketProvider;
}

const Editor = ({
  initialContent,
  onEditorUpdate,
  ydoc,
  provider,
}: EditorProp) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  return (
    <EditorRoot>
      <EditorContent
        className=""
        enableContentCheck={true}
        onContentError={({ disableCollaboration }) => {
          disableCollaboration();
        }}
        onCreate={({ editor: currentEditor }) => {
          provider.on("synced", () => {
            console.log(ydoc);

            if (
              !ydoc.getMap("config").get("initialContentLoaded") &&
              currentEditor
            ) {
              ydoc.getMap("config").set("initialContentLoaded", true);
              currentEditor.commands.setContent(initialContent as JSONContent);
            }
          });
        }}
        extensions={[
          ...extensions,
          Collaboration.extend().configure({
            document: ydoc,
          }),
          CollaborationCursor.extend().configure({
            provider,
          }),
        ]}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        slotAfter={<ImageResizer />}
        onUpdate={onEditorUpdate}
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
