export async function up(sql) {
  await sql`
    CREATE TABLE books (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      author varchar(70) NOT NULL,
      title varchar(70) NOT NULL
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE books
  `;
}
