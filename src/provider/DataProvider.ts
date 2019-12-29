import { AnyStringCommand, GithubCommand, StockCommand, TestCommand } from "../command";
import { TCommand } from "../command/types";
import { IProvider } from "./types";

export class DataProvider implements IProvider {

  private data: any;

  constructor(object: object) {
    this.data = object;
  }

  public getCommands(): TCommand[] {
    const commands: TCommand[] = [];

    if (this.data.name) {
      commands.push(new AnyStringCommand("whoami", "- Print the user name associated with the current effective user.", this.data.name));
    }

    if (this.data.quote) {
      commands.push(new AnyStringCommand("quote", "- Display a random quote", this.data.quote));
    }

    if (this.data.test && this.data.test.length) {
      commands.push(new TestCommand(this.data.test));
    }

    commands.push(new GithubCommand());

    commands.push(new StockCommand());

    return commands;
  }

}
