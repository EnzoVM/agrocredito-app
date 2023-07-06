import CampaignTable from "@/app/components/campaign/CampaignTable"

export default function Campaign () {

  return (
    <div>
      <div className="md:h-screen dark:bg-gray-900">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 pt-20">
          <p className="text-3xl font-bold text-gray-100 p-6 text-center">Listado de campañas</p>
          <CampaignTable />
        </div>
      </div>
    </div>
  )
}