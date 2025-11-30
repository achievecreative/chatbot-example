import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

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

export type ProductCardProps = ProductCard

export default function ProductCard(props: ProductCardProps) {
  return (
    <Card className={cn("w-[300px] p-0")}>
      <Carousel className="pt-2">
        <CarouselContent className="m-0">
          {props.images.map((image, index) => (
            <CarouselItem key={index} className="w-full h-40">
              <Image
                src={image.url}
                alt={image.altText || "Product Image"}
                fill
                className="rounded"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <CardHeader>{props.title}</CardHeader>
      <CardContent>
        {props.variants.length > 0 &&
          props.variants.map((variant) => (
            <div key={variant.id} className="mb-2">
              <div className="text-base">
                {variant.price.amount} {variant.price.currencyCode}
              </div>
            </div>
          ))}
        <div className="space-y-2">
          <Button className="w-full bg-white border-gray-400 border text-black hover:text-white">
            Add to Cart
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pb-2"></CardFooter>
    </Card>
  )
}
