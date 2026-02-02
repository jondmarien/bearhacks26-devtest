export const LogLevel = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  DEBUG: "DEBUG",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

class FrontendLogger {
  private static instance: FrontendLogger;

  private constructor() {}

  public static getInstance(): FrontendLogger {
    if (!FrontendLogger.instance) {
      FrontendLogger.instance = new FrontendLogger();
    }
    return FrontendLogger.instance;
  }

  private print(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    const styles = [
      "color: white",
      "background: transparent",
      "font-weight: bold",
      "padding: 2px 4px",
      "border-radius: 2px",
    ];

    switch (level) {
      case LogLevel.INFO:
        styles[1] = "#0ea5e9"; // Sky Blue
        break;
      case LogLevel.WARN:
        styles[1] = "#eab308"; // Yellow
        break;
      case LogLevel.ERROR:
        styles[1] = "#ef4444"; // Red
        break;
      case LogLevel.SUCCESS:
        styles[1] = "#22c55e"; // Green
        break;
      case LogLevel.DEBUG:
        styles[1] = "#64748b"; // Gray
        break;
    }

    const styleString = styles.join(";");

    if (meta) {
      console.log(`%c ${formattedMessage} `, styleString, meta);
    } else {
      console.log(`%c ${formattedMessage} `, styleString);
    }
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
    this.print(LogLevel.DEBUG, message, meta);
  }
}

export default FrontendLogger.getInstance();
