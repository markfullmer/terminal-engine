import Octokit from '@octokit/rest';
import { ParsedArgs } from 'minimist';
import { HelpTopic } from '../helpTopic';
import { AsyncCommand } from './types';

export class StockCommand extends AsyncCommand {

  public name: string = 'stock';
  public description: string = "- Type 'stock <symbol>' for current info. But also ponder the wealth inequality problem.";
  public helpTopic: HelpTopic;
  private token: string;
  private api: string;

  constructor() {
    super();

    this.token = 'B6C5TDWFW05LYY3U';
    this.api = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=';

    this.helpTopic = new HelpTopic(this, {
      synopsis: 'stock quote',
    });
  }

  public run(args: ParsedArgs): Promise<any> {
    if (args._.length > 0) {
      const ps = [
        fetch(this.api + args._[0] + '&apikey=' + this.token)
        .then((response) => {
          return response.json() as Promise<{ data: any }>;
        })
        .then((res: any) => {
          const data = res['Global Quote'];
          if (typeof data !== 'undefined') {
            return data;
          }
          return res;
        }),
      ];
      return Promise.all(ps);
    }
    return Promise.all([{ "Invalid syntax": "Enter a valid stock symbol (e.g., 'stock spwr'"}]);
  }

}
