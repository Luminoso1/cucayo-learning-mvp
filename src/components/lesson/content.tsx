import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

import 'highlight.js/styles/github-dark.css'

const MarkdownComponents = {
  p: ({ children }: any) => (
    <p className="mb-6 text-lg md:text-2xl leading-12 text-secondary-text/90 font-light">
      {children}
    </p>
  ),
  h1: ({ children }: any) => (
    <h1 className="text-2xl md:text-4xl font-bold mb-6 text-primary-text tracking-tight border-b border-primary/20 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xl md:text-3xl font-semibold mt-10 mb-4 text-primary-text flex items-center">
      <span className="mr-2 text-primary">#</span>
      {children}
    </h2>
  ),
  li: ({ children }: any) => (
    <li className="text-base md:text-xl leading-12 text-secondary-text/90 font-light">
      {children}
    </li>
  ),
  pre: ({ children }: any) => <pre className="p-0">{children}</pre>,
  code: ({ node, inline, className, children, ...props }: any) => {
    return !inline ? (
      <div className="rounded-xl overflow-hidden shadow-2xl">
        <code className={className} {...props}>
          {children}
        </code>
      </div>
    ) : (
      <code
        className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-base md:text-xl font-mono"
        {...props}
      >
        {children}
      </code>
    )
  },

  table: ({ children }: any) => (
    <div className="w-full overflow-x-auto border border-primary/10 rounded-xl shadow-sm">
      <table className="w-full min-w-max text-left border-collapse mt-0 mb-4">
        {children}
      </table>
    </div>
  ),

  th: ({ children }: any) => (
    <th className="text-base md:text-xl font-semibold p-4 bg-primary/5 text-primary-text border-b border-primary/10">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="text-base md:text-xl p-4 text-secondary-text/90 border-b border-primary/5">
      {children}
    </td>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="text-lg md:text-2xl leading-12 text-primary-text font-semibold">
      {children}
    </blockquote>
  ),
}

function Content({ content }: { content: string }) {
  return (
    <>
      {/* 
          - 'prose': Activa los estilos por defecto (h1, p, ul, etc)
          - 'prose-slate': Elige una paleta base para el texto
          - 'max-w-none': Permite que el texto use todo el ancho del contenedor padre
          - 'prose-headings:text-primary': Ejemplo de cómo usar tus variables @theme
        */}
      <section
        className="prose prose-slate max-w-none 
                        prose-headings:text-primary-text
                        prose-p:text-secondary-text
                        prose-a:text-primary
                        prose-strong:text-primary-text"
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={MarkdownComponents}
        >
          {content}
        </Markdown>
      </section>
    </>
  )
}

export default Content
