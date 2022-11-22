const books = [{ id: 100, author: 'Ralph', title: 'Ralphy' }];

export async function up(sql) {
  await sql`
    INSERT INTO books ${sql(books, 'id', 'author', 'title')}
  `;
}

export async function down(sql) {
  for (const book of books) {
    await sql`
      DELETE FROM
        books
      WHERE
        id = ${book.id} AND
        author = ${book.author} AND
        title = ${book.title}
    `;
  }
}
