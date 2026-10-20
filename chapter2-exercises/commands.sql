CREATE TABLE blogs (id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INTEGER DEFAULT 0);
INSERT INTO blogs (author, url, title, likes) VALUES ('Antti', 'https://www.antinblogi.com', 'eka blogi', 1);
INSERT INTO blogs (author, url, title, likes) VALUES ('Heikki', 'https://www.heikinblogi.com', 'toka blogi', 1);