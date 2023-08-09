import ProjectTable from "@/app/components/project/ProjectTable";

export default function Farmer () {
  return (
    <div>
      <div className="md:h-screen dark:bg-gray-900">
        <div className="mx-auto max-w-8xl sm:px-6 lg:px-8 pt-20">
          <div className="flex justify-between">
            <div className="block w-full mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-100 p-6 text-center">Listado de Sectores</p>
              <ProjectTable />
            </div>
            <div className="block w-full mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-100 p-6 text-center">Listado de Proyectos</p>
              <ProjectTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}