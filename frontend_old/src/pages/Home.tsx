import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Search, MapPin, Home as HomeIcon, Building2, Bath, BedDouble, List, Map } from 'lucide-react'

type PropertyItem = {
  id: number | string
  slug: string
  title?: string
  price?: number
  property_type?: { name?: string }
}

export default function Home() {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [form, setForm] = useState({
    location: '',
    type: 'house',
    minBeds: 0,
    minBaths: 0,
    maxPrice: ''
  })

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .get('/properties/')
      .then((res) => {
        if (!alive) return
        const data = Array.isArray(res.data?.results)
          ? res.data.results
          : Array.isArray(res.data)
            ? res.data
            : []
        setProperties(data)
      })
      .catch(() => setProperties([]))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="property237-hero-section">
        <div className="property237-hero-inner">
          <h1 className="property237-hero-title">Buy, Rent, & Sell Property</h1>
          <p style={{maxWidth:620, margin:'0 auto 1.5rem', color:'#475569', fontWeight:500}}>
            Find your best property — browse curated listings, trusted agents, and real market insights.
          </p>
          {/* Search Pill */}
          <div className="property237-hero-search">
            <form
              className="search-pill"
              onSubmit={(e) => {
                e.preventDefault()
                // TODO: route to /search with params
              }}
            >
              <div style={{display:'flex', alignItems:'center', gap:8, flex:1}}>
                <MapPin size={18} color="#475569" />
                <input
                  placeholder="Location (City, Region)"
                  className="property237-hero-search-input"
                  value={form.location}
                  onChange={e => setForm(f => ({...f, location: e.target.value}))}
                />
              </div>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <HomeIcon size={18} color="#475569" />
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({...f, type: e.target.value}))}
                  style={{border:'none', background:'transparent', outline:'none', fontSize:'.9rem'}}
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <BedDouble size={18} color="#475569" />
                <input
                  type="number"
                  min={0}
                  value={form.minBeds}
                  onChange={e => setForm(f => ({...f, minBeds: Number(e.target.value)}))}
                  style={{width:60, border:'none', background:'transparent', outline:'none'}}
                  placeholder="Beds"
                />
              </div>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <Bath size={18} color="#475569" />
                <input
                  type="number"
                  min={0}
                  value={form.minBaths}
                  onChange={e => setForm(f => ({...f, minBaths: Number(e.target.value)}))}
                  style={{width:60, border:'none', background:'transparent', outline:'none'}}
                  placeholder="Baths"
                />
              </div>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <span style={{fontSize:12, fontWeight:600, color:'#475569'}}>Max</span>
                <input
                  type="number"
                  min={0}
                  value={form.maxPrice}
                  onChange={e => setForm(f => ({...f, maxPrice: e.target.value}))}
                  style={{width:100, border:'none', background:'transparent', outline:'none'}}
                  placeholder="Price"
                />
              </div>
              <button type="submit" className="property237-hero-search-btn" aria-label="Search properties">
                <Search size={22} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Simplified listing preview below hero */}
      <div className="property237-main-container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
            <h2 style={{fontSize:'1.25rem', fontWeight:700}}>Popular Listings</h2>
            <div style={{display:'flex', gap:8}}>
              <button
                className={`px-3 py-1 rounded ${viewMode === 'map' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setViewMode('map')}
              >
                <Map size={16} /> Map
              </button>
              <button
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} /> List
              </button>
            </div>
        </div>
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {properties.map((p) => (
              <a
                key={p.id}
                href={`/property/${p.slug}`}
                className="block rounded-lg border p-3 hover:shadow"
              >
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Building2 size={14} /> {p.property_type?.name || 'Type'}
                </div>
                <div className="text-emerald-700 font-bold mt-1">{p.price?.toLocaleString()} XAF</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
