import { DataProvider } from '../provider';
import { SyncCommand } from './types';
import { ParsedArgs } from 'minimist';

export class OpenCommand extends SyncCommand {

  private files: any;

  public name: string = 'open';
  public description: string = '- open a file in the current working directory (view with the `ls` command)';

  constructor(files: any) {
    super();
    this.files = files;
  }

  public run(args: ParsedArgs) {
    if (args._.length > 0) {
      if (this.files.includes(args._[0])) {
        window.open("https://markfullmer.com/files/" + args._[0], "_blank");
      }
      else {
        return 'File not found. Use "ls" to view available files.';
      }
    }
  }
}
