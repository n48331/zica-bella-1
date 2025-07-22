import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { 
  isCacheValid, 
  getCacheKey, 
  clearCache, 
  getCache, 
  setCache, 
  getCachedData 
} from '@/lib/productCache'

// GET /api/products - Get all products with categories as array
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active') !== 'false' // Default to true
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '0')
    const includeRelations = searchParams.get('include_relations') !== 'false' // Default to true
    const forceRefresh = searchParams.get('refresh') === 'true' // Force refresh parameter

    // Build the query for products
    let query = supabaseAdmin
      .from('products')
      .select(`*, product_colors:product_colors(id, color_id, available, colors:color_id(id, name, value)), product_sizes:product_sizes(id, size_id, available, sizes:size_id(id, name, display_order))`)
      .eq('is_active', active)
      .order('created_at', { ascending: false });
    if (category) {
      query = query.eq('deprecated_category', category);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (limit > 0) {
      const offset = page * limit;
      query = query.range(offset, offset + limit - 1);
    }
    const { data: products, error } = await query;
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }
    // For each product, fetch categories
    const productIds = (products || []).map((p: any) => p.id);
    let categoriesMap: Record<number, string[]> = {};
    if (productIds.length > 0) {
      const { data: pcRows, error: pcErr } = await supabaseAdmin
        .from('product_categories')
        .select('product_id, category_id, categories!inner(name)')
        .in('product_id', productIds);
      if (!pcErr && pcRows) {
        for (const row of pcRows) {
          if (!categoriesMap[row.product_id]) categoriesMap[row.product_id] = [];
          if (row.categories) {
            if (Array.isArray(row.categories)) {
              for (const cat of row.categories as any[]) {
                if (cat && cat.name) categoriesMap[row.product_id].push(cat.name);
              }
            } else if ((row.categories as any).name) {
              categoriesMap[row.product_id].push((row.categories as any).name);
            }
          }
        }
      }
    }
    // Attach categories array to each product
    const productsWithCategories = (products || []).map((p: any) => ({
      ...p,
      categories: categoriesMap[p.id] || (p.deprecated_category ? [p.deprecated_category] : [])
    }));
    // Prepare response
    const response = {
      products: productsWithCategories,
      totalCount: productsWithCategories.length,
      page,
      limit,
      hasMore: limit > 0 ? (productsWithCategories.length === limit) : false,
    };
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    const {
      name,
      description,
      price,
      images = [],
      categories = [], // now array
      selectedColors = [],
      selectedSizes = [],
      stock_quantity = 0,
      sku,
      is_featured = false,
      is_active = true
    } = body

    // Validation
    if (!name || !price || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Name, price, and at least one category are required' },
        { status: 400 }
      )
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }

    // Check if SKU already exists (only if SKU is provided and not empty)
    if (sku && sku.trim() !== '') {
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('sku', sku.trim())
        .single()

      if (existingProduct) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Insert product (deprecated_category for backward compatibility)
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        images,
        deprecated_category: categories[0], // for legacy support
        stock_quantity: parseInt(stock_quantity),
        sku: sku && sku.trim() !== '' ? sku.trim() : null, // Set to null if empty
        is_featured,
        is_active
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    // Insert product-category relationships
    if (categories && categories.length > 0) {
      // Get category IDs for the given names
      const { data: categoryRows, error: catErr } = await supabaseAdmin
        .from('categories')
        .select('id, name')
        .in('name', categories)
      if (catErr) {
        console.error('Error fetching categories:', catErr)
      } else {
        const categoryInserts = (categoryRows || []).map((cat: any) => ({
          product_id: product.id,
          category_id: cat.id
        }))
        if (categoryInserts.length > 0) {
          const { error: pcErr } = await supabaseAdmin
            .from('product_categories')
            .insert(categoryInserts)
          if (pcErr) {
            console.error('Error inserting product_categories:', pcErr)
          }
        }
      }
    }

    // Handle colors and sizes relationships (unchanged)
    if (selectedColors && selectedColors.length > 0) {
      const colorInserts = selectedColors.map((colorId: number) => ({
        product_id: product.id,
        color_id: colorId,
        available: true
      }))
      const { error: colorError } = await supabaseAdmin
        .from('product_colors')
        .insert(colorInserts)
      if (colorError) {
        console.error('Error inserting product colors:', colorError)
      }
    }
    if (selectedSizes && selectedSizes.length > 0) {
      const sizeInserts = selectedSizes.map((sizeId: number) => ({
        product_id: product.id,
        size_id: sizeId,
        available: true
      }))
      const { error: sizeError } = await supabaseAdmin
        .from('product_sizes')
        .insert(sizeInserts)
      if (sizeError) {
        console.error('Error inserting product sizes:', sizeError)
      }
    }

    // Clear cache after creating new product
    clearCache();

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 