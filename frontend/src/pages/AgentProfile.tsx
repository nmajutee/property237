import { useParams } from 'react-router-dom'

export default function AgentProfile() {
  const { id } = useParams()
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Agent Profile</h1>
      <p className="text-gray-600">Agent ID: {id}</p>
    </div>
  )
}
