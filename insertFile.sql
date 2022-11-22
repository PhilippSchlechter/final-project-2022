CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(60) NOT NULL,
  email varchar (80) NOT NULL,
  password_hash varchar(90) NOT NULL,
  created_at timestamp
);

INSERT INTO books
(author, title)
VALUES
  ('Phil','123456'),
SELECT * FROM users;

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(90) NOT NULL UNIQUE,
  password_hash varchar(70) NOT NULL UNIQUE
);
