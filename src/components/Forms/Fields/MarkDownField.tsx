import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import RemarkMathPlugin from 'remark-math';

import 'katex/dist/katex.min.css';
import { ChangeEvent } from 'react';
import 'react-markdown-editor-lite/lib/index.css';

type MarkDownFieldProps = {
  value: string;
  onChange: (
    data: {
      text: string;
      html: string;
    },
    event?: ChangeEvent<HTMLTextAreaElement> | undefined
  ) => void;
};

// TODO: html validation, possible xss attack
const MarkDownField = ({ value, onChange }: MarkDownFieldProps) => {
  return (
    <MdEditor
      style={{ height: '500px' }}
      renderHTML={(text) => (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, RemarkMathPlugin]}
          components={ChakraUIRenderer()}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {text}
        </ReactMarkdown>
      )}
      value={value}
      onChange={onChange}
    />
  );
};

export default MarkDownField;
