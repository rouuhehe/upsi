import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

interface GuideContentProps {
  content: string;
}

export const GuideContent = ({ content }: GuideContentProps) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <article className="rounded-2xl shadow-xl  overflow-hidden">
          <div className="px-12 ">
            <div className="prose prose-lg max-w-none
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-[var(--c-text)] [&_h1]:mb-8 [&_h1]:mt-0 [&_h1]:leading-tight
              [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-[var(--c-text)] [&_h2]:mb-6 [&_h2]:mt-12 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-3
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-[var(--c-text)]text-slate-600 [&_h3]:mb-4 [&_h3]:mt-8
              [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-[var(--c-text)]text-slate-600 [&_h4]:mb-3 [&_h4]:mt-6
              [&_p]:leading-relaxed [&_p]:text-[var(--c-text)]text-slate-700 [&_p]:mb-6 [&_p]:text-base
              [&_blockquote]:border-l-4  [&_blockquote]:border-sky-400 [&_blockquote]:pl-8 [&_blockquote]:pr-8 [&_blockquote]:pb-0.5  [&_blockquote]:py-4 [&_blockquote]:my-8 [&_blockquote]:bg-sky-400/9 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-[var(--c-text)]/70 
              [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:mb-6 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-6 [&_ol]:space-y-2
              [&_li]:leading-relaxed [&_li]:text-[var(--c-text)]text-slate-700 [&_li]:mb-2
              [&_td]:px-6 [&_td]:py-4 [&_td]:text-[var(--c-text)] [&_td]:border-b [&_td]:border-slate-100
              [&_hr]:border-slate-300 [&_hr]:my-12 [&_hr]:border-t-2
              [&_a]:text-sky-600 [&_a]:hover:text-sky-800 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:hover:decoration-blue-500 [&_a]:underline-offset-2 [&_a]:transition-colors
              [&_strong]:text-[var(--c-text)] [&_strong]:font-semibold"
            >
              <ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};