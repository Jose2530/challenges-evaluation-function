export const javascriptExecutor = {
  image: "node:22-alpine",
  fileName: "main.js",
  command: "node /tmp/main.js < /tmp/input.txt",
};
