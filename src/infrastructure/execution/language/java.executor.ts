export const javaExecutor = {
  image: "eclipse-temurin:21-jdk-alpine",
  fileName: "Main.java",
  command: "javac /tmp/Main.java && java -cp /tmp Main",
};
