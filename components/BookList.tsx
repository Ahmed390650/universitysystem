import React from "react";
import BookOverView from "./BookOverView";
import BookCard from "./BookCard";
interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
}
const BookList = ({ books, containerClassName, title }: Props) => {
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </ul>
    </section>
  );
};

export default BookList;
