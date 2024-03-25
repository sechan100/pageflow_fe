import { cn } from "@/shared/libs/utils"
import GlobalLayout from "../GlobalLayout"






export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalLayout>
      <div className={cn("h-[100vh]")}>
        {children}
      </div>
    </GlobalLayout>
  )
}
