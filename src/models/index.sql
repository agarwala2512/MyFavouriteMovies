CREATE DATABASE movie_app;

CREATE TABLE app_user(
  id SERIAL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
)

CREATE TABLE movie(
  id SERIAL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  rating INT,
  movie_cast text ARRAY,
  genre VARCHAR(255),
  release_date DATE,
  CONSTRAINT app_user_id FOREIGN KEY (id) REFERENCES app_user(id)
);