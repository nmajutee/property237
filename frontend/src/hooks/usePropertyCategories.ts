/**
 * React Hook for Property Categories
 * Cameroon-Specific Implementation
 *
 * Provides easy access to categories, states, and tags data
 */

'use client';

import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/services/api';

// Type definitions
export interface Category {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  is_active: boolean;
  parent: number | null;
  subcategories?: Category[];
}

export interface PropertyTag {
  id: number;
  name: string;
  description: string;
  color: string;
  icon?: string;
  is_active: boolean;
  applies_to_categories: number[];
}

export interface PropertyState {
  id: number;
  name: string;
  code: string;
  description: string;
  color: string;
  is_publicly_visible: boolean;
  allows_inquiries: boolean;
  is_active: boolean;
}

export interface CategoryFormData {
  parents: Category[];
  subcategories: Category[];
  states: PropertyState[];
  tags: PropertyTag[];
}

// Helper function to get API base URL
const getPropertiesApiUrl = () => `${getApiBaseUrl()}/properties`;

/**
 * Hook to fetch all parent categories
 */
export function useParentCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = getPropertiesApiUrl();
        const response = await fetch(`${API_BASE_URL}/categories/parents/`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        // Ensure data is an array
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook to fetch subcategories for a specific parent category
 */
export function useSubcategories(parentSlug: string | null) {
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentSlug) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = getPropertiesApiUrl();
        const response = await fetch(`${API_BASE_URL}/categories/${parentSlug}/subcategories/`);
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        const data = await response.json();
        // Ensure data is an array
        setSubcategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subcategories');
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [parentSlug]);

  return { subcategories, loading, error };
}

/**
 * Hook to fetch all property states
 */
export function usePropertyStates(publicOnly: boolean = false) {
  const [states, setStates] = useState<PropertyState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = getPropertiesApiUrl();
        const endpoint = publicOnly ? '/states/public/' : '/states/';
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Failed to fetch states');
        const data = await response.json();
        // Handle paginated response (data.results) or direct array
        const statesArray = data.results || data;
        setStates(Array.isArray(statesArray) ? statesArray : []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load states');
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [publicOnly]);

  return { states, loading, error };
}

/**
 * Hook to fetch tags for a specific category
 */
export function usePropertyTags(categoryId: number | null = null) {
  const [tags, setTags] = useState<PropertyTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = getPropertiesApiUrl();
        const endpoint = categoryId
          ? `/tags/for_category/${categoryId}/`
          : '/tags/';
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Failed to fetch tags');
        const data = await response.json();
        // Handle paginated response (data.results) or direct array
        const tagsArray = data.results || data;
        setTags(Array.isArray(tagsArray) ? tagsArray : []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tags');
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [categoryId]);

  return { tags, loading, error };
}

/**
 * Hook to fetch complete form data (optimized single request)
 */
export function useCategoryFormData(categoryId: number | null = null) {
  const [formData, setFormData] = useState<CategoryFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = getPropertiesApiUrl();
        const endpoint = categoryId
          ? `/form-data/for_category/${categoryId}/`
          : '/form-data/';
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Failed to fetch form data');
        const data = await response.json();
        // Validate formData structure
        if (data && typeof data === 'object') {
          setFormData({
            parents: Array.isArray(data.parents) ? data.parents : [],
            subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
            states: Array.isArray(data.states) ? data.states : [],
            tags: Array.isArray(data.tags) ? data.tags : [],
          });
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form data');
        setFormData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [categoryId]);

  return { formData, loading, error };
}

/**
 * Utility function to get category by slug
 */
export function getCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

/**
 * Utility function to get state by code
 */
export function getStateByCode(states: PropertyState[], code: string): PropertyState | undefined {
  return states.find(state => state.code === code);
}

/**
 * Utility function to filter tags by category
 */
export function filterTagsByCategory(tags: PropertyTag[], categoryId: number): PropertyTag[] {
  return tags.filter(tag =>
    tag.applies_to_categories.length === 0 ||
    tag.applies_to_categories.includes(categoryId)
  );
}
