import { ParsedArgs } from 'minimist';
import EasyTable from 'easy-table';
import { Cli } from '../cli';
import { SyncCommand } from './types';

export class HelpCommand extends SyncCommand {

  private cli: Cli;
  private commands: any;

  public name: string = 'help';
  public description: string = '- Browse system documentation.';

  constructor(cli: Cli) {
    super();
    this.cli = cli;
  }

  run(args: ParsedArgs): void {
    if (args._.length > 0) {
      this.cli.helpTopic(args._[0]);
    }
    else {
      this.help();
    }
  }

  help() {
    const EOL = '\r\n';
    let table = new EasyTable();
    table.separator = '\t\t';

    this.commands = Object.keys(this.cli.commands)
      .sort()
      .reduce((acc, key) => ({
        ...acc, [key]: this.cli.commands[key]
      }), {})

    for (let i in this.commands) {
      if (this.commands[i].description != "") {
        table.cell('name', this.commands[i].name);
        table.cell('description', this.commands[i].description);
        table.newRow();
      }
    }

    this.cli.write(`${EOL}GNU bash, version 4.4.19(1)-release (x86_64-pc-linux-gnu)
${EOL}Commands are defined internally.${EOL}Type \`help\` to see this list.${EOL}${EOL}\t${table.print().replace(/\r?\n/g, `${EOL}\t`)}`);
  }

}
