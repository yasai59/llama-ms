export const verifyApiKey = async (req: any, res: any, next: any) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ message: "API key is missing" });
  }

  if (apiKey !== Bun.env.API_KEY) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next();
}