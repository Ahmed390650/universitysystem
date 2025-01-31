import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverView";
import { db } from "@/database/drizzle";
import { book } from "@/database/schema";
import { desc } from "drizzle-orm";
import React from "react";

export default async function Home() {
  const session = await auth();

  const books = (await db
    .select()
    .from(book)
    .limit(10)
    .orderBy(desc(book.createdAt))) as Book[];
  return (
    <>
      <BookOverview {...books[0]} userId={session?.user?.id as string} />
      <BookList
        title="latest Books"
        books={books.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
}
