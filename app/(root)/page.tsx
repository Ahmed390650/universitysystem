import BookList from "@/components/BookList";
import BookOverView from "@/components/BookOverView";
import { sampleBooks } from "@/constants";
import React from "react";

export default async function Home() {
  return (
    <>
      <BookOverView {...sampleBooks[0]} />
      <BookList
        title="latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
}
