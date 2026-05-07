import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const MyComponent = ({ value, onChange }) => {
    return (
        <div>
            <SunEditor
                setContents={value}
                setOptions={{
                    height: 400,
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle', 'blockquote'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor', 'textStyle'],
                        ['removeFormat'],
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['table', 'link', 'image', 'video', 'audio'],
                        ['imageGallery'],
                        ['fullScreen', 'showBlocks', 'codeView'],
                        ['preview', 'print'],
                    ],
                    imageUploadUrl: 'https://your-server/upload',
                    videoFileInput: true,
                    audioFileInput: true,
                    imageGalleryUrl: 'https://your-server/gallery',
                    placeholder: 'Start writing your amazing content...',
                    defaultStyle: 'font-family: Arial; font-size: 16px;',
                }}
                onChange={onChange}
            />
        </div>
    );
};

export default MyComponent;