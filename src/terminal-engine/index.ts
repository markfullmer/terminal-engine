import { EventEmitter } from "events";
import { Cli } from "../cli";
import { ClearCommand, ExitCommand, GithubCommand, HelpCommand, LoremGutenbergCommand, StockCommand } from "../command";
import { IProvider } from "../provider/types";

export interface ITerminalOptions {
  debugMode?: boolean;
  prompt?: string;
  welcomeMessage?: string;
}

export class TerminalEngine extends EventEmitter {

  public cli: Cli;

  private options: ITerminalOptions = {
    debugMode: false,
    prompt: "/usr/local/bin$ ",
    welcomeMessage: "Last login: Sun Dec 6 2019 12:43:15",
  };

  constructor(options?: ITerminalOptions) {
    super();

    if (options) {
      Object.assign(this.options, options);
    }

    this.cli = new Cli({
      prompt: this.options.prompt,
      welcomeMessage: this.options.welcomeMessage,
    });

    this.cli.on("input", (...args: any) => this.emit("input", ...args));

    this.cli.register(new ClearCommand(this.cli));
    this.cli.register(new ExitCommand(this.cli));
    this.cli.register(new GithubCommand());
    this.cli.register(new LoremGutenbergCommand());
    this.cli.register(new HelpCommand(this.cli));
    this.cli.register(new StockCommand());
  }

  public use(commandProvider: IProvider): TerminalEngine {
    // tslint:disable-next-line: arrow-parens
    commandProvider.getCommands().forEach(command => this.cli.register(command));
    return this;
  }

  public show(domElement: HTMLElement) {
    this.cli.show(domElement);
  }

}
