module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./Backend",
      script: "myvenv/Scripts/uvicorn.exe",
      args: "app.main:app --reload --port 8000",
      interpreter: "none",
    },
    {
      name: "frontend",
      cwd: "./Frontend/frontend",
      script: "cmd",
      args: '/c "npm run dev"',
      interpreter: "none",
    },
  ],
};