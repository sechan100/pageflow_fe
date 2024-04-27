import { ReactNode } from "react"





export const FieldErrorMessage = ({children, when}: {children: ReactNode, when: boolean}) => {
  return ( 
    <div className="text-sm font-medium text-destructive">
      {when ? children : null}
    </div>
  )
}