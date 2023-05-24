import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Departments() {
  return (
    <div>
      <Button component={Link} to="/admin/departments/edit/646cb53d6b34aa97ea7a2467">Edit Department</Button>
    </div>
  )
}
