'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '')

  const handleFilter = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (minPrice) params.set('minPrice', minPrice)
      else params.delete('minPrice')
      if (maxPrice) params.set('maxPrice', maxPrice)
      else params.delete('maxPrice')
      if (sortBy) params.set('sortBy', sortBy)
      else params.delete('sortBy')
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="w-full md:w-64 space-y-4">
      <div>
        <Label htmlFor="minPrice">Min Price</Label>
        <Input
          type="number"
          id="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
        />
      </div>
      <div>
        <Label htmlFor="maxPrice">Max Price</Label>
        <Input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
        />
      </div>
      <div>
        <Label htmlFor="sortBy">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
            <SelectItem value="name_desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleFilter} disabled={isPending}>
        {isPending ? 'Applying...' : 'Apply Filters'}
      </Button>
    </div>
  )
}

