export async function invokeShopifyAdminApi<T, Variables extends object>(
  query: string,
  variables: Variables
): Promise<T> {
  return (await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}.myshopify.com/admin/api/2025-10/graphql.json`,
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
