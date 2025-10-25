"use strict";

const dotenv = require("dotenv");
const Hapi = require("@hapi/hapi");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

// Ambil JWT_SECRET dari environment
const JWT_SECRET = process.env.JWT_SECRET;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  // Tambahkan ini agar bisa konek ke database Railway (yang pakai SSL)
  ssl: {
    rejectUnauthorized: false,
  },
});

const init = async () => {
  const port = process.env.PORT || 5000;
  const host = "0.0.0.0";

  const server = Hapi.server({
    port: port,
    host: host,
    routes: { cors: true },
  });

  server.route({
    method: "POST",
    path: "/register",
    handler: async (request, h) => {
      const { username, email, password } = request.payload;
      if (!username || !email || !password) {
        return h
          .response({ error: "Username, email, dan password dibutuhkan" })
          .code(400);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const res = await pool.query(
          "INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING id, username, email",
          [username, email, hashedPassword]
        );
        return h
          .response({ message: "Registrasi berhasil!", user: res.rows[0] })
          .code(201);
      } catch (err) {
        return h
          .response({ error: "Username atau email sudah terdaftar" })
          .code(409);
      }
    },
  });

  server.route({
    method: "POST",
    path: "/login",
    handler: async (request, h) => {
      const { email, password } = request.payload;
      const res = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = res.rows[0];
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return h.response({ error: "Email atau password salah" }).code(401);
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      return h.response({ token });
    },
  });

  server.route({
    method: "POST",
    path: "/like",
    handler: async (request, h) => {
      try {
        const token = request.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { wisata_title } = request.payload;
        await pool.query(
          "INSERT INTO likes(user_id, wisata_title) VALUES($1, $2) ON CONFLICT DO NOTHING",
          [userId, wisata_title]
        );
        return h.response({ message: "Like berhasil disimpan" }).code(201);
      } catch (err) {
        return h.response({ error: "Otentikasi gagal." }).code(401);
      }
    },
  });

  await server.start();
  console.log("Server Hapi.js (Pengguna) berjalan di %s", server.info.uri);
};

init();
