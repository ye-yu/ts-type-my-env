import chalk from "chalk";

export function createConsoleLogger(): Console {
  const c: Console = {
    assert: function (condition?: boolean | undefined, ...data: any[]): void {
      throw new Error("Function not implemented.");
    },
    clear: function (): void {
      throw new Error("Function not implemented.");
    },
    count: function (label?: string | undefined): void {
      throw new Error("Function not implemented.");
    },
    countReset: function (label?: string | undefined): void {
      throw new Error("Function not implemented.");
    },
    debug: function (...data: any[]): void {
      throw new Error("Function not implemented.");
    },
    dir: function (item?: any, options?: any): void {
      throw new Error("Function not implemented.");
    },
    dirxml: function (...data: any[]): void {
      throw new Error("Function not implemented.");
    },
    error: function (...data: any[]): void {
      console.error(chalk.bgRed("  TME "), ...data);
    },
    group: function (...data: any[]): void {
      throw new Error("Function not implemented.");
    },
    groupCollapsed: function (...data: any[]): void {
      throw new Error("Function not implemented.");
    },
    groupEnd: function (): void {
      throw new Error("Function not implemented.");
    },
    info: function (...data: any[]): void {
      console.info(chalk.bgBlue("  TME "), ...data);
    },
    log: function (...data: any[]): void {
      console.log(chalk.bgGray("  TME "), ...data);
    },
    table: function (
      tabularData?: any,
      properties?: string[] | undefined
    ): void {
      throw new Error("Function not implemented.");
    },
    time: function (label?: string | undefined): void {
      throw new Error("Function not implemented.");
    },
    timeEnd: function (label?: string | undefined): void {
      throw new Error("Function not implemented.");
    },
    timeLog: function (label?: string | undefined, ...data: any[]): void {
      throw new Error("Function not implemented.");
    },
    timeStamp: function (label?: string | undefined): void {
      throw new Error("Function not implemented.");
    },
    trace: function (...data: any[]): void {
      throw new Error("Function not implemented.");
    },
    warn: function (...data: any[]): void {
      console.warn(chalk.bgYellow("  TME "), ...data);
    },
    Console: void 0 as any,
    profile: function (label?: string | undefined): void {
      throw new Error("Function not implemented.");
    },
    profileEnd: function (label?: string | undefined): void {
      throw new Error("Function not implemented.");
    },
  };
  return c;
}
