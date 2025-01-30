import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import React from "react";

const Page = () => {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10">
        <Button>logout</Button>
      </form>
      <BookList books={sampleBooks} title="Borrowed Books" />
    </div>
  );
};

export default Page;
