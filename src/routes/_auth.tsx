import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full grid md:grid-cols-12 min-h-screen">
      <div className="md:col-span-6 w-full px-6 flex flex-col">
        <header className="py-6">
          <Link
            to="/"
            className="font-semibold flex items-center gap-2 text-block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              viewBox="0 -960 960 960"
              fill="#d4a011"
            >
              <path d="M177-560q14-36 4.5-64T149-680q-33-40-43.5-75.5T102-840h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78ZM200-160q-50 0-85-35t-35-85v-200h561q5-34 27-59.5t54-36.5l185-62 25 76-185 62q-12 4-19.5 14.5T720-462v182q0 50-35 85t-85 35H200Zm0-80h400q17 0 28.5-11.5T640-280v-120H160v120q0 17 11.5 28.5T200-240Zm200-80Z" />
            </svg>
            <span>Cucayo Learning</span>
          </Link>
        </header>

        <div className="grow flex items-center justify-center">
          <div className="mb-20 max-w-lg mx-auto w-full md:px-6">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="col-span-6 max-md:hidden relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2070"
          alt="Cocina artesanal"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-br from-primary/40 via-primary-text/80 to-primary-text flex flex-col items-center justify-center p-12 text-center">
          <div className="max-w-md">
            <div className="mb-6 inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                width="48px"
                viewBox="0 -960 960 960"
                fill="#fdfbf7"
              >
                <path d="M177-560q14-36 4.5-64T149-680q-33-40-43.5-75.5T102-840h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78ZM200-160q-50 0-85-35t-35-85v-200h561q5-34 27-59.5t54-36.5l185-62 25 76-185 62q-12 4-19.5 14.5T720-462v182q0 50-35 85t-85 35H200Zm0-80h400q17 0 28.5-11.5T640-280v-120H160v120q0 17 11.5 28.5T200-240Zm200-80Z" />
              </svg>
            </div>

            <h3 className="text-4xl font-black text-background-light mb-4 tracking-tight">
              Donde se cocina el futuro.
            </h3>
            <p className="text-white/80 text-lg font-medium italic">
              "El conocimiento es el único plato que sabe mejor cuando se
              comparte y se raspa del fondo."
            </p>
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-white/40 border-t border-white/10 pt-8">
            <span className="text-xs font-bold uppercase tracking-widest">
              2026
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Learning Management System (LMS)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
