import { Link, useNavigate, useRouteContext } from '@tanstack/react-router'
import {
  Heater,
  CookingPot,
  Component,
  Trophy,
  Settings,
  LogOut,
} from 'lucide-react'
import type { FullUserProfile } from '@/types'

function Aside() {
  const user = useRouteContext({
    from: '__root__',
    select: (context) => context.user,
  })

  const navigate = useNavigate()
  if (!user) return null

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 p-6 pb-10 bg-white flex flex-col justify-between border-r border-stone-200">
      {/* profile */}

      <div>
        <Profile value={user} />
        {/* routes */}

        <Navigation role={user.role} />
      </div>

      <footer className="relative">
        <button
          onClick={() => navigate({ to: '/logout' })}
          className="px-8 py-4 flex items-center gap-4 text-sm border border-slate-300 hover:text-primary hover:border-primary cursor-pointer transition-colors rounded-full w-full"
        >
          <LogOut />
          Cerrar Sesion
        </button>
      </footer>
    </aside>
  )
}

const Profile = ({ value }: { value: FullUserProfile }) => {
  const { firstName, lastName, student, teacher } = value
  return (
    <div>
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <div className="rounded-full h-12 w-12 border-2 border-primary/20 overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCknzDX6RKQy4dT-80SXfqpJJ2tLw5q2bBFIzYjjiNfSGD51l_38Mc_yOl8yGgUfURY17o4IrXe2RDyZj-RnyG2kPvZbp12AS0oo32RTclhtncThkzQFIYBekcsaQSubf3yTz_oXlI-C3N5KRTAEic9AiaQzWwUW89G69RjeV2c2tJNmtKckZ346xocYP3WI1O0GPmpkUiC4lDDa-4WWy8gVHtrK8tliMNdIZc2_7KTGLTEdiWBrlut9JN2AgsRBJ-3u7PfKMy17H1f"
            alt="User profile picture"
          />
        </div>
        <div>
          <h2 className="text-primary-text text-base font-bold leading-tight">
            {firstName} {lastName}
          </h2>
          <p className="text-secondary-text text-xs font-normal">
            {student?.careerName} {teacher?.specialty}
            <br />
            {student && (
              <span className="text-xs">Semestre {student?.semester}</span>
            )}
            {teacher && <span className="text-xs">Teacher</span>}
          </p>
        </div>
      </Link>
    </div>
  )
}

const Navigation = ({ role }: { role: FullUserProfile['role'] }) => {
  const STUDENT_ROUTES = [
    { name: 'mi cocina', to: '/student', Icon: Heater },
    { name: 'mis calderos', to: '/student/calderos', Icon: CookingPot },
    { name: 'mis compas', to: '/student/compas', Icon: Component },
    { name: 'los mejores', to: '/student/mejores', Icon: Trophy },
    { name: 'configuracion', to: '/student/configuracion', Icon: Settings },
  ]

  const TEACHER_ROUTES = [
    { name: 'cursos', to: '/tutor/courses', Icon: CookingPot },
    { name: 'configuracion', to: '/tutor/configuracion', Icon: Settings },
  ]

  const ROUTES = role === 'student' ? STUDENT_ROUTES : TEACHER_ROUTES

  return (
    <nav className="my-10 space-y-2">
      {ROUTES.map(({ name, to, Icon }) => (
        <Link
          key={name}
          to={to}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-text font-medium hover:bg-stone-100 transition-colors"
          activeOptions={{ exact: true }}
          activeProps={{
            className: 'text-primary! bg-primary/10 font-bold',
          }}
        >
          <Icon size={24} />
          <span className="capitalize text-sm">{name}</span>
        </Link>
      ))}
    </nav>
  )
}

export default Aside
