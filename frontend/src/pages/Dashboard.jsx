import React from 'react'
import DeadlineList from '../components/DeadlineList'

function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      <DeadlineList />
    </div>
  )
}

export default Dashboard
