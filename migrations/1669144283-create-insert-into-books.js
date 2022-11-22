export async function up(sql) {
  await sql`
    INSERT INTO books
      (author, title)
      VALUES
  ('Phil','123456')
  `;
}

export async function down(sql) {
  await sql`
    DELETE FROM
    books
    WHERE
    author = 'Phil' AND
    title = '123456'
  `;
}
