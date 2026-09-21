export const pythonExecutor = {
  image: "python:3.12-alpine",
  fileName: "main.py",
  command: "python /tmp/main.py < /tmp/input.txt",
};
