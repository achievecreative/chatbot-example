import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ProductVariant {
  id: string
  title: string
  price: {
    amount: string
    currencyCode: string
  }
  sku: string
  availableForSale: boolean
  quantityAvailable: number
}

interface ProductCard {
  id: string
  title: string
  images: {
    url: string
    altText: string | null
  }[]

  variants: ProductVariant[]
}

export interface ProductCardsProps {
  products: ProductCard[]
}

export type ProductCardProps = {
  addToCart?: (productName: string, variantId: string) => void
} & ProductCard

export default function ProductCard({
  title,
  variants,
  images,
  addToCart,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState("")

  const handleAddToCart = () => {
    const variant = variants.find((v) => v.id === selectedVariant)
    if (!variant) {
      return
    }
    addToCart?.(variant.title, selectedVariant)
  }

  return (
    <Card className={cn("w-[300px] p-0")}>
      <Carousel>
        <CarouselContent className="m-0">
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full h-40">
              <Image
                src={image.url}
                alt={image.altText || "Product Image"}
                fill
                className="rounded-t-[12px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <div className="flex flex-row gap-2">
          {variants.length > 0 &&
            variants.map((variant, index) => (
              <div
                key={variant.id}
                className={cn(
                  "mb-2 border p-1 rounded cursor-pointer",
                  (index == 0 && !selectedVariant) ||
                    selectedVariant == variant.id
                    ? "bg-blue-800 border-blue-200 text-white"
                    : ""
                )}
                onClick={() => setSelectedVariant(variant.id)}
              >
                <div className="text-sm">
                  {variant.price.amount} {variant.price.currencyCode}
                </div>
              </div>
            ))}
        </div>
        <div className="space-y-2">
          <Button
            className="w-full bg-white border-gray-400 border text-black hover:text-white"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pb-2"></CardFooter>
    </Card>
  )
}
