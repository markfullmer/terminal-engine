import { ParsedArgs } from 'minimist';

import { HelpTopic } from '../helpTopic';
import { Test } from '../property';
import { SyncCommand } from './types';

export class TestCommand extends SyncCommand {

  private skills: Array<Test>;

  public name: string = 'skills';
  public description: string = 'shows skills';
  public helpTopic: HelpTopic;

  constructor(skills: Array<Test>) {
    super();
    this.skills = skills;
    this.helpTopic = new HelpTopic(this, {
      synopsis: 'skills [-l]',
      options: {
        '-l': 'List all skills in which the level is -l'
      },
      examples: [
        {
          cmd: 'skills -l advanced',
          description: 'The following command shows all skills in which the level is advanced'
        }
      ]
    });
  }

  run(args: ParsedArgs): Array<Test> {
    let data = this.skills;

    return data;
  }

}
