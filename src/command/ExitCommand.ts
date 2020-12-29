import { Cli } from '../cli';
import { SyncCommand } from './types';

export class ExitCommand extends SyncCommand {

  private cli: Cli;

  public name: string = 'exit';
  public description: string = '- Exit the terminal.';

  constructor(cli: Cli) {
    super();
    this.cli = cli;
  }

  run(): void {
    window.open("https://markfullmer.com/", "_self");
  }

}
