import { $getRoot, $getSelection, EditorState } from "lexical";
import { useEffect, useState } from "react";

import LexicalComposer from "@lexical/react/LexicalComposer";
import LexicalRichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalContentEditable from "@lexical/react/LexicalContentEditable";
import LexicalOnChangePlugin from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import CharacterStylesPopupPlugin from "../plugins/CharacterStylesPopupPlugin";

const theme = {};

const onError = (error: Error) => {
  console.error(error);
};

export default function Rich() {
  const initialConfig = {
    theme,
    onError,
  };

  const [text, setText] = useState("");

  function updateText(editorState: EditorState) {
    editorState.read(() => {
      const root = $getRoot();

      setText(
        root.getTextContent()
      );
    });
  }

  return (
    <div className={"container my-3 lex-wrapper"}>
      <h1 className={"text-muted mb-4 pb-2"}>Rich Text Editor</h1>
      <LexicalComposer initialConfig={initialConfig}>
        <CharacterStylesPopupPlugin />
        <LexicalRichTextPlugin
          contentEditable={<LexicalContentEditable />}
          placeholder={null}
        />
        <HistoryPlugin />
        <LexicalOnChangePlugin onChange={updateText} />
        {text ? (
          <div className="container card bg-light my-3 p-3">{text}</div>
        ) : (
          <></>
        )}
      </LexicalComposer>
    </div>
  );
}
