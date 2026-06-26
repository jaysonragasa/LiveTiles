import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

export async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  app.use(express.json());

  app.get("/api/weather", async (req, res) => {
    try {
      const lat = req.query.lat;
      const lon = req.query.lon;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Missing coordinates" });
      }

      const apiKey = process.env.OPENWEATHERMAP_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Server missing API key" });
      }

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);
      
      const data = await weatherRes.json();
      const forecastData = await forecastRes.json();
      
      if (!weatherRes.ok) {
        return res.status(weatherRes.status).json(data);
      }
      if (!forecastRes.ok) {
        return res.status(forecastRes.status).json(forecastData);
      }

      // Process 3-day forecast
      const map = new Map();
      for (const item of forecastData.list) {
        const date = item.dt_txt.split(' ')[0]; // 'YYYY-MM-DD'
        if (!map.has(date)) {
          map.set(date, []);
        }
        map.get(date).push(item);
      }
      
      const days = Array.from(map.keys()).slice(0, 3);
      const forecastLines = days.map((date: string) => {
         const dayItems = map.get(date);
         const maxTemp = Math.round(Math.max(...dayItems.map((i: any) => i.main.temp_max)));
         const minTemp = Math.round(Math.min(...dayItems.map((i: any) => i.main.temp_min)));
         const dayStartItem = dayItems[0];
         const weekday = new Date(dayStartItem.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
         const desc = dayItems[Math.floor(dayItems.length / 2)].weather[0].main;
         return `${weekday} - ${desc} ${maxTemp}°/${minTemp}°`;
      });

      res.json({ current: data, forecast: forecastLines });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return new Promise((resolve) => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      resolve(PORT);
    });
  });
}

export const serverPromise = startServer();
