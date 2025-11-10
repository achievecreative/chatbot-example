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

export async function getProducts() {
  const products: ProductInfo[] = []

  let endCursor: string | null = null

  while (true) {
    const response = await invokeShopifyAdminApi(queryProducts, {first: 10, after: endCursor}) as ProductsResponse

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
