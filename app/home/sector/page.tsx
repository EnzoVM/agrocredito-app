import ProjectTable from "@/app/components/project/ProjectTable";
import SectorTable from "@/app/components/sector/SectorTable";

export default function Sector () {
  return (
    <div>
      <div className="md:h-screen dark:bg-gray-900">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 pt-20">
          <p className="text-3xl font-bold text-gray-100 p-6 text-center">Listado de Sectores</p>
          <SectorTable />
        </div>
      </div>
    </div>
  )
}