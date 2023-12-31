import Link from "next/link";

export default function NotFound () {
  return (
    <main className="grid md:h-screen place-items-center dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-2xl font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white-900 sm:text-5xl">Página no encontrada</h1>
        <p className="mt-6 text-base leading-7 text-gray-100">Disculpe, no hemos podido encontrar la página que estaba buscando.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/home/campaign" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ir a las campañas</Link>
        </div>
      </div>
    </main>
  )
}