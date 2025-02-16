"use client";
import { cn } from "@/lib/utils";
import React from "react";
import BookCoverSvg from "./BookCoverSVG";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";
const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};
interface Prop {
  variant?: BookCoverVariant;
  className?: string;
  coverColor: string;
  coverUrl: string;
}
const BookCover = ({
  className,
  coverColor = "#012B48",
  coverUrl = "https://placehold.co/400x600.png",
  variant = "regular",
}: Prop) => {
  return (
    <div
      className={cn(
        variantStyles[variant],
        className,
        "relative transition-all duration-300"
      )}>
      <BookCoverSvg coverColor={coverColor} />
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}>
        <IKImage
          path={coverUrl}
          alt="book-cover"
          fill
          urlEndpoint={config.env.imageKit.urlEndpoint}
          loading="lazy"
          lqip={{ active: true }}
          className="object-fill rounded-sm"
        />
      </div>
    </div>
  );
};

export default BookCover;
