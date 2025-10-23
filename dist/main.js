/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("{\n\nconst Hapi = __webpack_require__(/*! @hapi/hapi */ \"@hapi/hapi\");\nconst { Pool } = __webpack_require__(/*! pg */ \"pg\");\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nconst JWT_SECRET =\n  \"kunci-rahasia-yang-sangat-aman-dan-panjang-untuk-proyek-ini\";\n\nconst pool = new Pool({\n  user: \"postgres\", // Ganti dengan username PostgreSQL Anda\n  host: \"localhost\",\n  database: \"rekomendasi_wisata\", // Nama database Anda\n  password: \"Firazputra*300704\", // Ganti dengan password PostgreSQL Anda\n  port: 5432,\n});\n\nconst init = async () => {\n  const server = Hapi.server({\n    port: 5000,\n    host: \"localhost\",\n    routes: { cors: true },\n  });\n\n  server.route({\n    method: \"POST\",\n    path: \"/register\",\n    handler: async (request, h) => {\n      const { username, email, password } = request.payload;\n      if (!username || !email || !password) {\n        return h\n          .response({ error: \"Username, email, dan password dibutuhkan\" })\n          .code(400);\n      }\n      const hashedPassword = await bcrypt.hash(password, 10);\n      try {\n        const res = await pool.query(\n          \"INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING id, username, email\",\n          [username, email, hashedPassword]\n        );\n        return h\n          .response({ message: \"Registrasi berhasil!\", user: res.rows[0] })\n          .code(201);\n      } catch (err) {\n        return h\n          .response({ error: \"Username atau email sudah terdaftar\" })\n          .code(409);\n      }\n    },\n  });\n\n  server.route({\n    method: \"POST\",\n    path: \"/login\",\n    handler: async (request, h) => {\n      const { email, password } = request.payload;\n      const res = await pool.query(\"SELECT * FROM users WHERE email = $1\", [\n        email,\n      ]);\n      const user = res.rows[0];\n      if (!user || !(await bcrypt.compare(password, user.password_hash))) {\n        return h.response({ error: \"Email atau password salah\" }).code(401);\n      }\n      const token = jwt.sign(\n        { id: user.id, username: user.username, email: user.email },\n        JWT_SECRET,\n        { expiresIn: \"8h\" }\n      );\n      return h.response({ token });\n    },\n  });\n\n  server.route({\n    method: \"POST\",\n    path: \"/like\",\n    handler: async (request, h) => {\n      try {\n        const token = request.headers.authorization.split(\" \")[1];\n        const decoded = jwt.verify(token, JWT_SECRET);\n        const userId = decoded.id;\n        const { wisata_title } = request.payload;\n        await pool.query(\n          \"INSERT INTO likes(user_id, wisata_title) VALUES($1, $2) ON CONFLICT DO NOTHING\",\n          [userId, wisata_title]\n        );\n        return h.response({ message: \"Like berhasil disimpan\" }).code(201);\n      } catch (err) {\n        return h.response({ error: \"Otentikasi gagal.\" }).code(401);\n      }\n    },\n  });\n\n  await server.start();\n  console.log(\"Server Hapi.js (Pengguna) berjalan di %s\", server.info.uri);\n};\n\ninit();\n\n\n//# sourceURL=webpack://backend/./src/index.js?\n}");

/***/ }),

/***/ "@hapi/hapi":
/*!*****************************!*\
  !*** external "@hapi/hapi" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("@hapi/hapi");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;