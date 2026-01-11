import { invokeShopifyAdminApi, invokeStorefrontApi } from "./apiClient"
import { ProductInfo } from "./types"

interface ProductsResponse {
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

interface ProductDetailResponse {
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
