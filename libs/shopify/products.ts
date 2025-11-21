export interface ProductInfo {
  id: string
  title: string
  description: string
}

export interface ProductsResponse {
  data: {
    products: {
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
      products: {
        product: ProductInfo
      }[]
    }
  }
}

export interface ProductDetailResponse {
  data: {
    product: {
      id: string
      title: string
      images: {
        data: {
          url: string
          altText: string | null
        }[]
      }
      variants: {
        data: {
          id: string
          title: string
          price: {
            amount: string
            currencyCode: string
          }
          sku: string
          availableForSale: boolean
          quantityAvailable: number
        }[]
      }
    }
  }
}

export async function invokeShopifyAdminApi<T, Variables extends object>(
  query: string,
  variables: Variables
): Promise<T> {
  return (await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2025-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    }
  ).then<T>((res) => res.json())) as T
}

export async function invokeStorefrontApi<T, Variables extends object>(
  query: string,
  variables: Variables
): Promise<T> {
  const result = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}.myshopify.com/api/2025-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    }
  ).then<T>((res) => res.json())

  return result
}

const queryProducts = `
query ($first: Int, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    products: edges {
      product: node {
        id
        title
        description
      }
    }
  }
}
`

export async function getProducts() {
  const products: ProductInfo[] = []

  let endCursor: string | null = null

  while (true) {
    const response = (await invokeShopifyAdminApi(queryProducts, {
      first: 10,
      after: endCursor,
    })) as ProductsResponse

    products.push(
      ...response.data.products.products.map((edge) => edge.product)
    )

    endCursor = response.data.products.pageInfo.endCursor

    if (!endCursor) {
      break
    }
  }

  return products
}

const queryProduct = `
query getProduct($id: ID) {
  product(id: $id) {
    id
    title
    images(first: 10) {
      data: nodes {
        url
        altText
      }
    }
    variants(first: 10) {
      data: nodes {
        id
        title
        sku
        price {
          amount
          currencyCode
        }
        availableForSale
        quantityAvailable
      }
    }
  }
}
  `

export type ProductDetail = ProductDetailResponse["data"]["product"]

export async function getProduct(id: string): Promise<ProductDetail> {
  const response = await invokeStorefrontApi<
    ProductDetailResponse,
    { id: string }
  >(queryProduct, {
    id: id,
  })
  return response.data.product
}
