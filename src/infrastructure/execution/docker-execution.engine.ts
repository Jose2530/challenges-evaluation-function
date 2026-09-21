import { execFile, ChildProcess } from "child_process";
import { promisify } from "util";
import CONFIG from "../../config";

import { ExecutionEngine } from "../../domain/execution/execution-engine";
import { ExecutionRequest } from "../../domain/execution/execution-request";
import { ExecutionResult } from "../../domain/execution/execution-result";

const execFileAsync = promisify(execFile);

export interface RuntimeExecutor {
  image: string;
  fileName: string;
  command: string;
}
export class DockerExecutionEngine implements ExecutionEngine {
  public async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const startTime = Date.now();

    const containerName = `execution-${Date.now()}`;

    const command = this.buildDockerCommand(request, containerName);

    try {
      const result = await this.runDocker(
        command,
        containerName,
        request.timeoutMs
      );

      const output = result.stdout.replace("__JAVA_COMPILED__", "").trim();

      return {
        status: "SUCCESS",
        output,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (error: unknown) {
      const executionError = error as {
        type?: string;
        stderr?: string;
        stdout?: string;
        message?: string;
      };

      if (executionError.type === "TIMEOUT") {
        return {
          status: "TIMEOUT",
          output: "",
          error: "Execution timeout exceeded",
          executionTimeMs: Date.now() - startTime,
        };
      }

      const stdout = executionError.stdout ?? "";

      const stderr =
        executionError.stderr ?? executionError.message ?? "Execution error";

      if (
        request.language === "java" &&
        !stdout.includes("__JAVA_COMPILED__")
      ) {
        return {
          status: "COMPILATION_ERROR",
          output: "",
          error: stderr,
          executionTimeMs: Date.now() - startTime,
        };
      }

      return {
        status: "RUNTIME_ERROR",
        output: stdout.replace("__JAVA_COMPILED__", "").trim(),
        error: stderr,
        executionTimeMs: Date.now() - startTime,
      };
    } finally {
      await this.removeContainer(containerName);
    }
  }

  private runDocker(
    command: string[],
    containerName: string,
    timeoutMs: number
  ): Promise<{
    stdout: string;
    stderr: string;
  }> {
    return new Promise((resolve, reject) => {
      const dockerProcess = execFile(
        "docker",
        command,
        {
          maxBuffer: 1024 * 1024,
        },
        (error, stdout, stderr) => {
          clearTimeout(timeout);

          if (error) {
            reject({
              ...error,
              stdout,
              stderr,
            });

            return;
          }

          resolve({
            stdout,
            stderr,
          });
        }
      );

      const timeout = setTimeout(async () => {
        await this.killContainer(containerName);

        reject({
          type: "TIMEOUT",
          message: "Execution timeout exceeded",
        });

        dockerProcess.kill();
      }, timeoutMs);
    });
  }

  private buildDockerCommand(
    request: ExecutionRequest,
    containerName: string
  ): string[] {
    const encodedCode = Buffer.from(request.code).toString("base64");

    const encodedInput = Buffer.from(request.input).toString("base64");

    const runtime = this.getRuntime(request.language);

    return [
      "run",
      "--rm",
      "--name",
      containerName,

      "--network",
      "none",

      "--read-only",

      "--tmpfs",
      "/tmp:rw,nosuid,size=64m",

      "--memory",
      CONFIG.EXECUTION.MEMORY,

      "--cpus",
      CONFIG.EXECUTION.CPU,

      "--pids-limit",
      String(CONFIG.EXECUTION.PIDS_LIMIT),

      runtime.image,

      "sh",
      "-c",

      this.buildCommand(runtime, encodedCode, encodedInput),
    ];
  }

  private async killContainer(containerName: string): Promise<void> {
    try {
      await execFileAsync("docker", ["kill", containerName]);
    } catch {}
  }

  private getRuntime(language: ExecutionRequest["language"]): {
    image: string;
    fileName: string;
    command: string;
  } {
    switch (language) {
      case "javascript":
        return {
          image: "node:22-alpine",
          fileName: "main.js",
          command: "node /tmp/main.js",
        };

      case "python":
        return {
          image: "python:3.12-alpine",
          fileName: "main.py",
          command: "python /tmp/main.py",
        };
      case "java":
        return {
          image: "eclipse-temurin:21-jdk-alpine",
          fileName: "Main.java",
          command:
            'javac /tmp/Main.java && echo "__JAVA_COMPILED__" && java -cp /tmp Main',
        };
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private buildCommand(
    runtime: RuntimeExecutor,
    encodedCode: string,
    encodedInput: string
  ): string {
    return [
      `echo '${encodedCode}' | base64 -d > /tmp/${runtime.fileName}`,
      `echo '${encodedInput}' | base64 -d > /tmp/input.txt`,
      runtime.command,
    ].join(" && ");
  }

  private async removeContainer(containerName: string): Promise<void> {
    try {
      await execFileAsync("docker", ["rm", "-f", containerName]);
    } catch {}
  }
}
