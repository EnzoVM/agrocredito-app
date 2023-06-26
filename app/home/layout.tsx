import Navbar from "../components/Navbar"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-full">
      <Navbar />
      {children}
    </div>
  )
}
