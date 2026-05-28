type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

const headingStyles: Record<HeadingTag, string> = {
  h1: 'text-3xl lg:text-5xl font-bold',
  h2: 'text-2xl lg:text-4xl font-semibold',
  h3: 'text-xl lg:text-3xl font-medium',
  h4: 'text-lg lg:text-2xl font-normal',
  h5: 'text-base lg:text-xl font-normal',
}

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag
  children: React.ReactNode
}

export default function Heading({
  as: Component = 'h1',
  children,
  className = '',
}: Props) {
  const style = headingStyles[Component] + className
  return <Component className={style}>{children}</Component>
}
