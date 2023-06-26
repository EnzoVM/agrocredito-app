export default function CampaignDetail ({ params }: { params: { id: string }}) {
  return (
    <>
          <p className="text-2xl font-bold text-gray-900">Detalle de la campaña: {params.id}</p>

    </>
  )
}