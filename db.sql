CREATE DATABASE csv;

CREATE TABLE roles(       
    role_id 	SERIAL PRIMARY KEY,
    roles		VARCHAR(255) NOT NULL,
    created_at	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at	TIMESTAMPTZ NOT NULL DEFAULT NOW()		 
);

INSERT INTO roles(roles)
    VALUES('admin');
INSERT INTO roles(roles)
    VALUES ('employee');
INSERT INTO roles(roles)
    VALUES('help_desk');

CREATE TABLE users(	
    user_id    SERIAL PRIMARY KEY,
    role_id     INT NOT NULL,
    username   	VARCHAR(255) NOT NULL,
    surname    	VARCHAR(255) NOT NULL,
    email		VARCHAR(255) UNIQUE NOT NULL,
    passwrd   	VARCHAR(255),
    status     	BOOLEAN DEFAULT 'true',
    created_at	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY(role_id ) REFERENCES roles(role_id )
);