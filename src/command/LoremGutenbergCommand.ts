import { HelpTopic } from '../helpTopic';
import { AsyncCommand } from './types';

export class LoremGutenbergCommand extends AsyncCommand {

  public name: string = 'gutenberg';
  public description: string = "- Retrieve a random excerpt from Project Gutenberg.";
  public helpTopic: HelpTopic;
  private api: string;

  constructor() {
    super();

    this.api = 'https://lorem-gutenberg.markfullmer.com/api/';

    this.helpTopic = new HelpTopic(this, {
      synopsis: 'lorem gutenberg',
    });
  }

  public run(): Promise<any> {
    const ps = [
      fetch(this.api)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{ data: any }>;
      })
      .then((res: any) => {
        return res;
      }),
    ];
    return Promise.all(ps);
  }

}
