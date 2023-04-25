import React, { Component, useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function MyEditor(props) {
  const [editorState, SeteditorState] = useState(EditorState.createEmpty());
  const [textContent, SettextContent] = useState("");

  const onEditorStateChange = (editorState) => {
    SeteditorState(editorState);
    props.updateFun(
      props.setKey,
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  // to show already selected value
  React.useEffect(() => {
    if (props.setVal !== "") {
      const html =
        props.setVal === "" || props.setVal === undefined
          ? "<p></p>"
          : props.setVal;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        SeteditorState(editorState);
      }
    }
  }, [props.setVal]);

  return (
    <div className="border1px pd-10">
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}

export default MyEditor;
