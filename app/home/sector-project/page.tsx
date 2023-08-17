import ProjectTable from "@/app/components/project/ProjectTable";
import SectorTable from "@/app/components/sector/SectorTable";

export default function Farmer () {
  return (
    <div>
      <div className="md:h-screen dark:bg-gray-900">
        <div className="mx-auto max-w-8xl sm:px-6 lg:px-8 pt-20">
          <div className="flex justify-between">
            <div className="block w-3/5 mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-100 p-6 text-center">Listado de Sectores</p>
              <SectorTable />
            </div>
            <div className="block w-4/5 mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-100 p-6 text-center">Listado de Proyectos</p>
              <ProjectTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}