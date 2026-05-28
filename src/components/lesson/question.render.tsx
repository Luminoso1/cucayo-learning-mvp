import {
  ClozeQuestion,
  MultiClozeComponent,
  OptionCard,
  OrderingComponent,
} from './utils'

interface QuestionRendererProps {
  question: any
  value: any
  onChange: (val: any) => void
  disabled: boolean
  isCorrect: boolean | null
}

export const questionRenderers: Record<
  string,
  React.ComponentType<QuestionRendererProps>
> = {
  cloze: ({ question, value, onChange, disabled, isCorrect }) => (
    <ClozeQuestion
      statement={question.statement}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      isCorrect={isCorrect}
    />
  ),
  multiple_cloze: ({ question, value, onChange, disabled, isCorrect }) => (
    <MultiClozeComponent
      question={question}
      value={value}
      onChange={onChange}
      disabled={disabled}
      isCorrect={isCorrect}
    />
  ),
  multiple_choise: ({ question, value, onChange, disabled }) => (
    <>
      <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-4">
        {question.statement}
      </h2>
      {question.options.map((opt: any) => (
        <OptionCard
          key={opt.id}
          content={opt.content}
          selected={value === opt.id}
          disabled={disabled}
          onClick={() => onChange(opt.id)}
        />
      ))}
    </>
  ),
  ordering: ({ question, value, onChange, disabled }) => (
    <>
      <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-4">
        {question.statement}
      </h2>
      <OrderingComponent
        key={question.id}
        options={question.options}
        onChange={onChange}
        disabled={disabled}
      />
    </>
  ),
  text_input: ({ question, value, onChange, disabled, isCorrect }) => (
    <>
      <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-4">
        {question.statement}
      </h2>
      <textarea
        autoFocus
        placeholder="Escribe tu respuesta..."
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full p-6 text-xl font-bold rounded-3xl border-2 transition-all outline-none resize-none ${
          disabled
            ? isCorrect
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'bg-red-50 border-red-500 text-red-700'
            : 'bg-stone-50 border-stone-200 focus:border-primary focus:bg-white shadow-[0_4px_0_#e7e5e4]'
        }`}
        rows={3}
      />
    </>
  ),
}
