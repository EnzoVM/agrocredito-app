export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div>
        <p>Este es el layou de hhome</p>
        {children}
      </div>
  )
}
