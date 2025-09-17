import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

type Property = { title?: string; description?: string; price?: number }

export default function PropertyDetail() {
  const { slug } = useParams()
  const [data, setData] = useState<Property | null>(null)

  useEffect(() => {
    if (!slug) return
    api
      .get(`/properties/${slug}/`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
  }, [slug])

  if (!data) return <div className="p-6 max-w-4xl mx-auto">Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="text-gray-600">{data.description}</p>
      <div className="mt-2 font-semibold">Price: {data.price?.toLocaleString()} XAF</div>
    </div>
  )
}
