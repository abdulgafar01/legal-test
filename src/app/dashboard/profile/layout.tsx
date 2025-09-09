'use client'
import React from "react"
import ProfileAuthGuard from "@/components/ProfileAuthGuard"

const ProfileLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <ProfileAuthGuard>
      {children}
    </ProfileAuthGuard>
  )
}

export default ProfileLayout
