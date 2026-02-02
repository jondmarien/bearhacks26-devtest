import fs from "fs";
import path from "path";

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  DEBUG = "DEBUG",
}

class Logger {
  private static instance: Logger;
  private logDir: string;
  private logFile: string;

  private constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.logFile = path.join(this.logDir, "app.log");

    // Ensure log directory exists inside the container/local env
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaString}`;
  }

  private writeToFile(message: string) {
    // Append to file asynchronously to avoid blocking
    fs.appendFile(this.logFile, message + "\n", (err) => {
      if (err) console.error("Failed to write to log file:", err);
    });
  }

  private print(level: LogLevel, message: string, meta?: any) {
    const formattedMessage = this.formatMessage(level, message, meta);

    // Colorize for console output
    let colorCode = "\x1b[0m"; // Reset
    switch (level) {
      case LogLevel.INFO:
        colorCode = "\x1b[36m";
        break; // Cyan
      case LogLevel.WARN:
        colorCode = "\x1b[33m";
        break; // Yellow
      case LogLevel.ERROR:
        colorCode = "\x1b[31m";
        break; // Red
      case LogLevel.SUCCESS:
        colorCode = "\x1b[32m";
        break; // Green
      case LogLevel.DEBUG:
        colorCode = "\x1b[90m";
        break; // Gray
    }

    // Always log to console (stdout/stderr) for cloud logging drivers (Render, etc.)
    const consoleOutput = `${colorCode}${formattedMessage}\x1b[0m`;
    if (level === LogLevel.ERROR) {
      console.error(consoleOutput);
    } else {
      console.log(consoleOutput);
    }

    // Also write to file for persistence if needed
    this.writeToFile(formattedMessage);
  }

  public info(message: string, meta?: any) {
    this.print(LogLevel.INFO, message, meta);
  }

  public warn(message: string, meta?: any) {
    this.print(LogLevel.WARN, message, meta);
  }

  public error(message: string, meta?: any) {
    this.print(LogLevel.ERROR, message, meta);
  }

  public success(message: string, meta?: any) {
    this.print(LogLevel.SUCCESS, message, meta);
  }

  public debug(message: string, meta?: any) {
    if (process.env.NODE_ENV !== "production") {
      this.print(LogLevel.DEBUG, message, meta);
    }
  }

  // Helper for Express Middleware
  public httpLogger(req: any, res: any, next: any) {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const ip = req.headers["x-forwarded-for"] || req.ip;
      const method = req.method;
      const url = req.url;
      const status = res.statusCode;

      const message = `${method} ${url} ${status} - ${duration}ms - IP: ${ip}`;

      if (status >= 500) {
        this.error(message);
      } else if (status >= 400) {
        this.warn(message);
      } else {
        this.info(message);
      }
    });
    next();
  }
}

export default Logger.getInstance();
