/**
 * Property Category Selector Component
 * Cameroon-Specific Implementation
 *
 * Features:
 * - Parent category selection (Residential, Commercial, Land, Investment)
 * - Dynamic subcategory dropdown based on parent selection
 * - State/status selection
 * - Multi-select tags with category filtering
 */

'use client';

import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/services/api';

// Type definitions
interface Category {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  is_active: boolean;
  parent: number | null;
  subcategories?: Category[];
}

interface PropertyTag {
  id: number;
  name: string;
  description: string;
  color: string;
  icon?: string;
  is_active: boolean;
}

interface PropertyState {
  id: number;
  name: string;
  code: string;
  description: string;
  color: string;
  is_publicly_visible: boolean;
  allows_inquiries: boolean;
  is_active: boolean;
}

interface FormData {
  category: string;
  subcategory: string;
  state: string;
  tags: string[];
}

interface PropertyCategorySelectorProps {
  onChange: (data: FormData) => void;
  initialValues?: Partial<FormData>;
}

export default function PropertyCategorySelector({
  onChange,
  initialValues = {},
}: PropertyCategorySelectorProps) {
  // Get the correct API base URL (works in both dev and production)
  const apiBaseUrl = `${getApiBaseUrl()}/properties`;
  // State management
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [states, setStates] = useState<PropertyState[]>([]);
  const [tags, setTags] = useState<PropertyTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form values
  const [selectedCategory, setSelectedCategory] = useState(initialValues.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialValues.subcategory || '');
  const [selectedState, setSelectedState] = useState(initialValues.state || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialValues.tags || []);

  // Fetch parent categories on mount
  useEffect(() => {
    fetchParentCategories();
    fetchStates();
  }, []);

  // Fetch subcategories when parent category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
      fetchTagsForCategory(selectedCategory);
    } else {
      setSubcategories([]);
      setTags([]);
      setSelectedSubcategory('');
      setSelectedTags([]);
    }
  }, [selectedCategory]);

  // Notify parent component of changes
  useEffect(() => {
    onChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      state: selectedState,
      tags: selectedTags,
    });
  }, [selectedCategory, selectedSubcategory, selectedState, selectedTags]);

  // API calls
  const fetchParentCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/categories/parents/`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      // Ensure data is an array
      setParentCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching parent categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      setParentCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categorySlug: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/categories/${categorySlug}/subcategories/`);
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      // Ensure data is an array
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/states/`);
      if (!response.ok) throw new Error('Failed to fetch states');
      const data = await response.json();
      // Ensure data is an array
      setStates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching states:', err);
      setStates([]);
    }
  };

  const fetchTagsForCategory = async (categorySlug: string) => {
    try {
      const category = parentCategories.find(c => c.slug === categorySlug);
      if (!category) return;

      const response = await fetch(`${apiBaseUrl}/tags/for_category/${category.id}/`);
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      // Ensure data is an array
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setTags([]);
    }
  };

  // Event handlers
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Parent Category Selection */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Property Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select a category...</option>
          {parentCategories.map(category => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <p className="mt-1 text-sm text-gray-500">
            {parentCategories.find(c => c.slug === selectedCategory)?.description}
          </p>
        )}
      </div>

      {/* Subcategory Selection (appears after parent is selected) */}
      {selectedCategory && subcategories.length > 0 && (
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            id="subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a type...</option>
            {subcategories.map(subcategory => (
              <option key={subcategory.id} value={subcategory.slug}>
                {subcategory.name}
              </option>
            ))}
          </select>
          {selectedSubcategory && (
            <p className="mt-1 text-sm text-gray-500">
              {subcategories.find(c => c.slug === selectedSubcategory)?.description}
            </p>
          )}
        </div>
      )}

      {/* State Selection */}
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
          Property Status <span className="text-red-500">*</span>
        </label>
        <select
          id="state"
          value={selectedState}
          onChange={handleStateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select a status...</option>
          {states.map(state => (
            <option key={state.id} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
        {selectedState && (
          <p className="mt-1 text-sm text-gray-500">
            {states.find(s => s.code === selectedState)?.description}
          </p>
        )}
      </div>

      {/* Tags Selection (Multi-select) */}
      {selectedCategory && tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag.id.toString())
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedTags.includes(tag.id.toString()) ? tag.color : undefined,
                }}
              >
                {tag.icon && <span className="mr-1">{tag.icon}</span>}
                {tag.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Select all tags that apply to this property
          </p>
        </div>
      )}

      {/* Summary */}
      {selectedCategory && selectedSubcategory && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Selection Summary</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              <strong>Category:</strong>{' '}
              {parentCategories.find(c => c.slug === selectedCategory)?.name}
            </li>
            <li>
              <strong>Type:</strong>{' '}
              {subcategories.find(c => c.slug === selectedSubcategory)?.name}
            </li>
            {selectedState && (
              <li>
                <strong>Status:</strong> {states.find(s => s.code === selectedState)?.name}
              </li>
            )}
            {selectedTags.length > 0 && (
              <li>
                <strong>Tags:</strong> {selectedTags.length} selected
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
