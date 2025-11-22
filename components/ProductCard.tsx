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
         <Carousel>
          <CarouselContent className="m-0">
            {props.images.map((image, index) => (
              <CarouselItem key={index} className="w-full h-40">
                <div>
                  <Image
                    src={image.url}
                    alt={image.altText || "Product Image"}
                    fill
                    className="rounded"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      <CardHeader>
       <p>{props.title}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
        <Button className="w-full bg-white border-gray-400 border text-black">Add to Cart</Button>
        </div>
      </CardContent>
      <CardFooter className="pb-2">
      </CardFooter>
    </Card>
  )
}
