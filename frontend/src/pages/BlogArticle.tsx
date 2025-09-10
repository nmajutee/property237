import { useParams } from 'react-router-dom'

export default function BlogArticle() {
  const { slug } = useParams()
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Article</h1>
      <p className="text-gray-600">Slug: {slug}</p>
    </div>
  )
}
