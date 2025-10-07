import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  const safe = content ?? '';
  if (!safe.trim()) return null;
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      disallowedElements={['img', 'iframe', 'video', 'audio', 'script', 'style']}
      unwrapDisallowed
      components={{
  p: (props: React.ComponentPropsWithoutRef<'p'>) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  strong: (props: React.ComponentPropsWithoutRef<'strong'>) => <strong className="font-semibold" {...props} />,
  em: (props: React.ComponentPropsWithoutRef<'em'>) => <em className="italic" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => <ul className="list-disc ml-5 mb-2 space-y-1" {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => <ol className="list-decimal ml-5 mb-2 space-y-1" {...props} />,
  li: (props: React.ComponentPropsWithoutRef<'li'>) => <li className="leading-snug" {...props} />,
        code: (props: any) => {
          const { inline, className, children, ...rest } = props;
            return (
              <code className={"rounded bg-gray-200/70 px-1 py-0.5 text-[11px] font-mono " + (inline ? '' : 'block')} {...rest}>
                {children}
              </code>
            );
        },
  a: (props: React.ComponentPropsWithoutRef<'a'>) => <a className="text-blue-600 underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />,
  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-700 mb-2" {...props} />
      } as Components}
    >
      {safe}
    </ReactMarkdown>
  );
};

export default MarkdownMessage;
