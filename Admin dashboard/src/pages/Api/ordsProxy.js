// src/pages/api/ordsProxy.js

export default async function handler(req, res) {
  try {
    const ORDS_URL = "http://localhost:8080/ords/lms/mcq/data/questions";

    const response = await fetch(ORDS_URL, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const text = await response.text();

    res.status(response.status).send(text);
  } catch (error) {
    console.error("ORDS Proxy Error:", error);
    res.status(500).json({ error: "ORDS proxy failed" });
  }
}
