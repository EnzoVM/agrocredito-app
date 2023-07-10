import FarmerTable from "@/app/components/farmer/FarmerTable";

export default function Farmer () {
  return (
    <div>
      <div className="md:h-screen dark:bg-gray-900">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-20">
          <p className="text-3xl font-bold text-gray-100 p-6 text-center">Listado de agricultores</p>
          <FarmerTable />
        </div>
      </div>
    </div>
  )
}