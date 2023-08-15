export default function CampaignDetail ({ params }: { params: { id: string }}) {
  return (
    <>
      <p className="text-2xl font-bold text-gray-100 py-4">Bienvenido a la campaña: {params.id}</p>
    </>
  )
}