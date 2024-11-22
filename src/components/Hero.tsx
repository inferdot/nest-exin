"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

const heroContent = [
  {
    title: "Welcome to Our Platform",
    description: "Revolutionizing the way you work and create",
    cta: "Speak to our Expert",
    image: "/landpage.jpg?height=1080&width=1920",
    href:"tel:+918910809232"
  },
  {
    title: "Transforming Spaces",
    description: "Your vision, our expertise",
    cta: "Our Works",
    image: "/landpage2.jpg?height=1080&width=1920",
    href:"#portfolio"
  },
  {
    title: "Our Range of Services",
    description: "High quality Interior and Exterior solutions for every project",
    cta: "Provided Services",
    image: "/landpage3.jpg?height=1080&width=1920",
    href:"#services"
  },
];

export default function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-[100vh]"
    //onMouseEnter={plugin.current.stop}
    //onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {heroContent.map((content, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-screen">
              <Image
                src={content.image}
                alt={`Hero image ${index + 1}`}
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex flex-col justify-center items-start p-12 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {content.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                  {content.description}
                </p>
                <a href={content.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-black border-white hover:bg-white hover:text-black transition-colors"
                  >
                    {content.cta}
                  </Button>
                </a>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
