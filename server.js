const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const handleSendQuote = require("./api/send-quote");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const serveFile = (req, res, pathname) => {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(ROOT, cleanPath));

  if (!filePath.startsWith(ROOT)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendJson(res, 404, { error: "Not found" });
        return;
      }

      sendJson(res, 500, { error: "Unable to read file" });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader("Content-Type", mimeTypes[extension] || "application/octet-stream");
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === "/api/send-quote") {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", async () => {
      req.body = rawBody;

      const apiRes = {
        status(code) {
          res.statusCode = code;
          return apiRes;
        },
        setHeader(name, value) {
          res.setHeader(name, value);
        },
        json(payload) {
          if (!res.headersSent) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
          }
          res.end(JSON.stringify(payload));
        }
      };

      await handleSendQuote(req, apiRes);
    });

    req.on("error", () => {
      sendJson(res, 500, { error: "Unable to process request" });
    });

    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  serveFile(req, res, requestUrl.pathname);
});

server.listen(PORT, () => {
  console.log(`Aryan's Engineering server running at http://localhost:${PORT}`);
});
