import Sidebar from "@/app/components/Sidebar"

export default function CampaignDetailLayout ({
  params,
  children
}: {
  params: {id: string}
  children: React.ReactNode
}) {
  return (
    <div className="dark:bg-gray-900">
      <Sidebar campaignId={params}/>
      <div className="p-4 sm:ml-64 pt-20">
        <div className="p-4 rounded">
            {children}
        </div>
      </div>
    </div>
  )
}