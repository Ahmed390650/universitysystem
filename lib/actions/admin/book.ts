"use server";

import { db } from "@/database/drizzle";
import { book } from "@/database/schema";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(book)
      .values({ ...params, availableCopies: params.totalCopies })
      .returning();
    return {
      success: true,
      message: "Book created successfully",
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to create book",
    };
  }
};
