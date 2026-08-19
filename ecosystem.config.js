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
      cwd: "./Frontend-1",
      script: "npm",
      args: "run dev",
      interpreter: "none",
    }
  ],
};