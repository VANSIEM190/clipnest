import { useDarkMode } from '../context'

const ErrorPage = () => {
  const { isDarkMode } = useDarkMode()

  return (
    <main
      className={`grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'
      }`}
    >
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-5xl font-bold sm:text-7xl">
          Page non trouvée
        </h1>
        <p className="mt-6 text-lg leading-8">
          Oups ! La page que vous cherchez n'existe pas.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Retour à l’accueil
          </a>
        </div>
      </div>
    </main>
  )
}

export default ErrorPage
