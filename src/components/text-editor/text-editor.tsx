'use client';

import { Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div>loading ...</div>,
});

type Props = {
    state?: string;
    dispatch?: Dispatch<SetStateAction<string>>;
};

const toolbarOptions = [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['image'],

    // [{ header: 1 }, { header: 2 }], // custom button values
    // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    // [{ direction: 'rtl' }], // text direction

    // [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
];

const modules = {
    toolbar: toolbarOptions,
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};

const StyledReactQuill = styled(ReactQuill)`
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #333;

    &:focus-within {
        outline: 2px solid var(--cold-color);
        border-color: var(--cold-color);
    }

    .ql-editor {
        min-height: 360px;
    }

    .quill .text-editor__StyledReactQuill-sc-43a4fe60-0 .cHQnRg {
        overflow: hidden;
        border-radius: 8px;
    }
`;

const TextEditor = ({ state, dispatch }: Props) => {
    return <StyledReactQuill theme="snow" modules={modules} value={state!} onChange={dispatch!} />;
};

export default TextEditor;
