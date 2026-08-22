module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./Backend",
      script: "myvenv/bin/uvicorn",
      args: "app.main:app --port 8001",
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