import Sidebar from "@/app/components/Sidebar"

export default function CampaignDetailLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="p-4 bg-white rounded">
            {children}
        </div>
      </div>
    </div>
  )
}