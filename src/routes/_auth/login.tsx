import { createFileRoute, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '@/hooks/useSignIn'
import toast from 'react-hot-toast'
import { ChefHat, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export const LoginSchema = z.object({
  email: z.email({ message: 'Email no valido' }),
  password: z.string().min(6, 'Minimo 6 caracteres'),
})

export type Login = z.infer<typeof LoginSchema>

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    /*
      defaultValues: {
        email: 'acalderonh@unicartagena.edu.co',
        password: 'AcalderonHPassword#',
      },
    */
    defaultValues: {
      email: 'anovoaa@unicartagena.edu.co',
      password: 'Escuela2014@',
    },
  })

  const password = watch('password')
  const isFormReady = password.length > 5

  const signInMutatation = useSignIn({
    onSuccess: () => {
      toast.success('login successfully')
      router.navigate({
        to: '/student',
        viewTransition: { types: [] },
      })
    },
    onError: (error) => {
      toast.error('Something went wrong :' + error.message)
    },
  })

  const onSubmit = async (data: Login) => {
    signInMutatation.mutate(data)
  }

  return (
    <section className="max-w-md w-full bg-white p-10 rounded-4xl shadow-sm border border-stone-200/60 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 opacity-[0.08] rotate-12 group-hover:rotate-45 transition-transform duration-700">
        <ChefHat className="size-48 text-primary" />
      </div>

      <header className="mb-10 relative">
        <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <ChefHat className="text-primary size-7" />
        </div>
        <h2 className="text-3xl font-black text-primary-text tracking-tight">
          ¡Bienvenido, Cucayero!
        </h2>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-secondary-text ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
              <input
                {...register('email')}
                className={`w-full rounded-2xl border-2 pl-12 pr-4 py-4 outline-none transition-all duration-200 ${
                  errors.email
                    ? 'border-red-200 bg-red-50 focus:border-red-500'
                    : 'border-stone-100 bg-background-light focus:border-primary focus:bg-white'
                }`}
                placeholder="tu@correo.com"
              />
            </div>
            {errors.email && (
              <span className="text-xs font-bold text-red-500 ml-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Campo Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-secondary-text ml-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
              <input
                {...register('password')}
                type="password"
                className={`w-full rounded-2xl border-2 pl-12 pr-4 py-4 outline-none transition-all duration-200 ${
                  errors.password
                    ? 'border-red-200 bg-red-50 focus:border-red-500'
                    : 'border-stone-100 bg-background-light focus:border-primary focus:bg-white'
                }`}
                placeholder="••••••••••••"
              />
            </div>
            {errors.password && (
              <span className="text-xs font-bold text-red-500 ml-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Botón con el color primario (Dorado) */}
          <button
            disabled={isSubmitting || !isFormReady}
            className="w-full group/btn relative mt-4 overflow-hidden bg-primary text-primary-text font-black text-lg py-4 rounded-2xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.97]"
            type="submit"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin size-6" />
            ) : (
              <>
                <span>Encender Fogones</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <footer className="pt-4 border-t border-stone-100 flex flex-col items-center gap-4">
            <p className="text-secondary-text text-xs font-medium italic">
              "El Cucayo de hoy es el conocimiento de mañana"
            </p>
          </footer>
        </div>
      </form>
    </section>
  )
}
