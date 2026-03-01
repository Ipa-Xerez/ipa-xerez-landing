import path from "path";
import express from "express";

export function serveStatic(app: express.Express) {
  const distPath = path.resolve("dist/public");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
