import ImageKit from "imagekit";
import dummyBooks from "../dummybooks.json";
import { config } from "dotenv";
import { book } from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle({
  client: sql,
});
const imageKit = new ImageKit({
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});
const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string
) => {
  try {
    const res = await imageKit.upload({
      file: url,
      fileName,
      folder,
    });
    return res.filePath;
  } catch (error) {
    console.error("Error uploading image to imagekit", error);
  }
};
const seed = async () => {
  console.log("Seeding database....");
  try {
    for (const books of dummyBooks) {
      const { coverUrl, videoUrl } = books;
      const coverPath = (await uploadToImageKit(
        coverUrl,
        `${books.title}.jpg`,
        "books/covers"
      )) as string;
      const videoPath = (await uploadToImageKit(
        videoUrl,
        `${books.title}.mp4`,
        "books/videos"
      )) as string;
      await db.insert(book).values({
        ...books,
        coverUrl: coverPath,
        videoUrl: videoPath,
      });
      console.log(
        `%c${dummyBooks.indexOf(books) + 1} Seeded ${
          books.title
        } successfully `,
        "color:green"
      );
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.log("Error seeding database", error);
  }
};
seed();
