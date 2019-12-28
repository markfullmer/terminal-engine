import { AnyStringCommand, TestCommand } from "../command";
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
      commands.push(new AnyStringCommand("name", "shows name", this.data.name));
    }

    if (this.data.test && this.data.test.length) {
      commands.push(new TestCommand(this.data.education));
    }

    return commands;
  }

}
