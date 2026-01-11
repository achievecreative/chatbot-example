import { Cart } from "./types"

export function addToCart(
  cartId?: string,
  variantId: string,
  quantity: number
): Promise<void> {
  return Promise.resolve()
}

export function getCart(cartId: string): Promise<Cart> {
  return Promise.resolve({} as unknown as Cart)
}

export function getCheckoutUrl(cartId: string): Promise<string> {
  return Promise.resolve("")
}
