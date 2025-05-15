"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Mail } from "lucide-react";


import messages from "@/messages.json";
import AutoPlay from "embla-carousel-autoplay";

const Home = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12  ">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the world of anonymous conversations
        </h1>
        <p className="mt-3 md:mt-4 text-lg">
          Explore True Feedback - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        className="w-full max-w-xs"
        plugins={[AutoPlay({ delay: 2000 })]}
      >
        <CarouselContent>
          {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
              
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {message.content}
                  </CardContent>
                  <CardFooter className="text-sm">
                    <Mail className="mr-3" />
                    {message.received}
                  </CardFooter>
                </Card>
              
            </CarouselItem>
              
            
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default Home;
