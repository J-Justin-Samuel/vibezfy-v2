import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n Vibezfy API running on http://127.0.0.1:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}\n`);
});
