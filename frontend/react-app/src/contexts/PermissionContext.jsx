import React, { createContext, useContext, useState } from 'react'

const PermissionContext = createContext({ canEdit: true })

export function PermissionProvider({ children }){
  const [canEdit] = useState(true)
  return <PermissionContext.Provider value={{ canEdit }}>{children}</PermissionContext.Provider>
}

export function usePermissions(){ return useContext(PermissionContext) }

export default PermissionContext
