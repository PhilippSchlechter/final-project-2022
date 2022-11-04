const books = [
  { author: 'Robert Menasse', title: 'Die Erweiterung' },
  { author: 'David Foster Wallace', title: 'Infinite Jest' },
  { author: 'Umberto Eco', title: 'The Name of the Rose' },
  { author: 'Franz Kafka', title: 'Der Verschollene' },
  { author: 'Saul Bellow', title: 'Herzog' },
];

export async function up(sql) {
  await sql`
    INSERT INTO books ${sql(books, 'author', 'title')}
  `;
}

export async function down(sql) {
  for (const book of books) {
    await sql`
      DELETE FROM
        books
      WHERE
        author = ${book.author} AND
        title = ${book.title}
    `;
  }
}
