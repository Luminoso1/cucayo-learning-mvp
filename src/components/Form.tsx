import {
  useForm,
  useController,
  FormProvider,
  type Control,
  type Path,
  type FieldValues,
} from 'react-hook-form'

interface Login {
  email: string
  password: string
}

function Form() {
  const methods = useForm<Login>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = () => {}
  const isSubmitting = methods.formState.isSubmitting
  const control = methods.control

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Input control={control} name="email" placeholder="example@gmail.com" />
        <Input
          control={control}
          name="password"
          type="password"
          placeholder="******"
        />

        <button
          disabled={isSubmitting}
          className="w-full disabled:cursor-not-allowed flex-1 bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          type="submit"
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar sesion'}
        </button>
      </form>
    </FormProvider>
  )
}

interface InputProps<
  T extends object,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>
  name: Path<T>
}

function Input<T extends FieldValues>({
  control,
  name,
  ...rest
}: InputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue: '' as any,
  })
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold capitalize">{name}</label>
      <input
        {...field}
        {...rest}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition-all ${
          error
            ? 'border-red-500 bg-red-50'
            : 'border-slate-200 bg-slate-50 focus:border-indigo-500'
        }`}
      />
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  )
}

export default Form
