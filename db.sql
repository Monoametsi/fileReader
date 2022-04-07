CREATE DATABASE csv;

CREATE TABLE csv_content(
    csv_id SERIAL PRIMARY KEY,
    name varchar(255),
    sex varchar(255),
    age int,
    height int,
    weight int
);