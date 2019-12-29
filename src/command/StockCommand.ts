import Octokit from '@octokit/rest';
import { ParsedArgs } from 'minimist';
import { HelpTopic } from '../helpTopic';
import { AsyncCommand } from './types';

export class StockCommand extends AsyncCommand {

  private token: string;
  private api: string;

  public name: string = 'stock';
  public description: string = "- Type 'stock <symbol>' for current info";
  public helpTopic: HelpTopic;

  constructor() {
    super();

    this.token = 'B6C5TDWFW05LYY3U';
    this.api = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=';

    this.helpTopic = new HelpTopic(this, {
      synopsis: 'stock quote'
    });
  }

  run(args: ParsedArgs): Promise<any> {
    if (args._.length > 0) {
      let ps = [
        fetch(this.api + args._[0] + '&apikey=' + this.token)
        .then(response => {
          if (!response.ok) {
            console.log(response.statusText)
            throw new Error(response.statusText)
          }
          return response.json() as Promise<{ data: any }>
        })
        .then((res: any) => {
          let data = res['Global Quote'];
          return data;
        })
      ];
      return Promise.all(ps);
    }
    return Promise.all([{ "Invalid syntax": "Enter a valid stock symbol (e.g., 'stock spwr'"}]);
  }

}
