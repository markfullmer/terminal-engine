import { AnyStringCommand, OpenCommand } from "../command";
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
      commands.push(new AnyStringCommand(
        "whoami",
        "- Print the user name associated with the current effective user.", this.data.name,
      ));
    }

    if (this.data.files) {
      var ls = "";
      let sizes = ['  373 ', ' 1725 ', '36596 ', '  137 ', '  482 ', '92619 ', ' 1382 '];
      let dates = ['Nov 24 18:35 ', 'Mar 26 12:00 ', 'Jul  8 11:55 ', 'Sep 11 20:01 '];
      this.data.files.forEach(function (item: any, index: string) {
        let size = sizes[Math.floor(Math.random() * sizes.length)];
        let cron = dates[Math.floor(Math.random() * dates.length)];
        ls += '-rw-rw-r-- 1 mark mark ' + size + cron + item + '\r\n';
      });
      commands.push(new AnyStringCommand(
        "ls",
        "- lists information about files (of any type, including directories)", ls,
      ));
    }

    commands.push(new AnyStringCommand(
      "pwd",
      "- print the name of the current working directory", '/usr/local/bin',
    ));

    // if (this.data.quote) {
    //   commands.push(new AnyStringCommand("quote", "- Display a random quote.", this.data.quote));
    // }

    if (this.data.files && this.data.files.length) {
      commands.push(new OpenCommand(this.data.files));
    }

    return commands;
  }

}
