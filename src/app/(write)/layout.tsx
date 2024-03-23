import GlobalLayout from "../GlobalLayout"






export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalLayout>
      <div className="container">
        {children}
      </div>
    </GlobalLayout>
  )
}
