import LexicalComposer from "@lexical/react/LexicalComposer";
import LexicalContentEditable from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalOnChangePlugin from "@lexical/react/LexicalOnChangePlugin";
import LexicalRichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import { $getRoot, EditorState } from "lexical";
import { useState } from "react";
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
  const [html, setHtml] = useState("");

  function updateData(editorState: EditorState) {
    editorState.read(() => {
      const root = $getRoot();
      const editor = document.querySelector(".lex-wrapper div[contenteditable=true]");

      setText(JSON.stringify(root.getAllTextNodes(), null, 2));
      setHtml(formatHtml(editor?.innerHTML || ""));
    });
  }

  return (
    <div className={"container my-3 lex-wrapper"}>
      <h1 className={"text-muted mb-4 pb-2"}>Popup Based Rich Text Editor</h1>
      <LexicalComposer initialConfig={initialConfig} >
        <CharacterStylesPopupPlugin />
        <LexicalRichTextPlugin
          contentEditable={<LexicalContentEditable />}
          placeholder={<div className="text-muted text-center">Select text to see popup</div>}
        />
        <HistoryPlugin />
        <LexicalOnChangePlugin onChange={updateData} />
        <div className="row">
          {text && text != "[]" ? (
            <>
              <div className="col-6">
                <pre className="container card bg-light my-3 p-3 editor-state-display">{text}</pre>
              </div>
              <div className="col-6">
                <pre className="text-secondary container card bg-light my-3 p-3 html-code-display">{html}</pre>
                <div className="container card bg-light my-3 p-3 html-result-display" dangerouslySetInnerHTML={{ __html: html }}></div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </LexicalComposer>
    </div>
  );
}


function formatHtml(code: string | null): string {
  let whitespace = ' '.repeat(2);
  let currentIndent = 0;
  let char = null;
  let nextChar = null;
  let result = '';

  code = code || "";

  for (var pos = 0; pos <= code.length; pos++) {
    char = code.substring(pos, pos + 1);
    nextChar = code.substring(pos + 1, pos + 2);

    if (char === '<' && nextChar !== '/') {
      result += '\n' + whitespace.repeat(currentIndent);
      currentIndent++;
    }
    else if (char === '<' && nextChar === '/') {
      if (--currentIndent < 0) currentIndent = 0;
      result += '\n' + whitespace.repeat(currentIndent);
    }
    else if (char === ' ' && nextChar === ' ') {
      char = '';
    }
    else if (char === '\n') {
      if (code.substring(pos, pos + code.substring(pos).indexOf("<")).trim() === '') char = '';
    }
    result += char;
  }

  return result.trim()
}