import DeliveryPlanModelCard from "@/app/components/delivery-plan-model/DeliveryPlanModelCards"

export default function CampaignDetail ({ params }: { params: { id: string }}) {
  return (
    <>
    <div className="mx-auto sm:px-6 lg:px-8">
      <DeliveryPlanModelCard campaignId={params.id}/>
    </div>
    </>
  )
}