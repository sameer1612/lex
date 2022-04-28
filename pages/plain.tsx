import {$getRoot, $getSelection, EditorState} from "lexical";
import {useEffect, useState} from "react";

import LexicalComposer from "@lexical/react/LexicalComposer";
import LexicalPlainTextPlugin from "@lexical/react/LexicalPlainTextPlugin";
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalContentEditable from "@lexical/react/LexicalContentEditable";
import LexicalOnChangePlugin from "@lexical/react/LexicalOnChangePlugin";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";

const theme = {};

function onChange(editorState: EditorState) {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

function onError(error: Error) {
  console.error(error);
}

export default function Plain() {
  const [text, setText] = useState("");

  const initialConfig = {
    theme,
    onError,
  };

  function updateText(editorState: EditorState) {
    editorState.read(() => {
      const root = $getRoot();

      setText(root.getTextContent());
    });
  }

  return (
    <div className={"container my-3 lex-wrapper"}>
      <h1 className={"text-muted mb-4 pb-2"}>Plain Text Editor</h1>
      <LexicalComposer initialConfig={initialConfig}>
        <LexicalPlainTextPlugin
          contentEditable={<LexicalContentEditable/>}
          placeholder={null}
        />
        <HistoryPlugin />
        <LexicalOnChangePlugin onChange={onChange}/>
        <LexicalOnChangePlugin onChange={updateText}/>
        <MyCustomAutoFocusPlugin/>
        {text ? <div className="container card bg-light my-3 p-3">{text}</div> : <></>}
      </LexicalComposer>
    </div>
  );
}
