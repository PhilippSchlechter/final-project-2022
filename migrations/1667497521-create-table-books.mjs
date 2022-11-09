export async function up(sql) {
  await sql`
    CREATE TABLE books (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      author varchar(70) NOT NULL,
      title varchar(70) NOT NULL,
      user_id integer REFERENCES users (id) ON DELETE CASCADE
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE books
  `;
}

/* CREATE TABLE user_books (
      PRIMARY KEY (user_id, book_id),
        user_id integer REFERENCES users (id),
        book_id integer REFERENCES books (id)
); */
