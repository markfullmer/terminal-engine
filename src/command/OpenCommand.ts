import { SyncCommand } from './types';
import { ParsedArgs } from 'minimist';

export class OpenCommand extends SyncCommand {

  public files: any;

  public name: string = 'open';
  public description: string = '- open a file in the current working directory (view with the `ls` command)';

  constructor() {
    super();
    this.files = [
      'aida.mp3',
      'an-tamsi-ni-aldrick.mp3',
      'bach-allemanda.mp3',
      'barber-adagio.mp3',
      'bayan-ko.mp3',
      'bedford-to-graham.mp3',
      'bei-jing-huan-ying-ni.mp3',
      'bleecker-street.mp3',
      'charlier-2.mp3',
      'first-noel.mp3',
      'frankenstein.mp3',
      'galliarde.mp3',
      'greyhound-lure.mp3',
      'hotel-chelsea.mp3',
      'hot-kristeva-rap.mp3',
      'infant-holy.mp3',
      'just-a-closer-walk.mp3',
      'kathys-song.mp3',
      'lay-your-couch-down.mp3',
      'little-orphan-girl.mp3',
      'my-love.mp3',
      'oh-holy-night.mp3',
      'only-yours.mp3',
      'rachmaninoff-vocalise.mp3',
      'rebecca-true-and-charlie-kind.mp3',
      'reposado.mp3',
      'semper-dowland.mp3',
      'sonata-st-mark-iii.mp3',
      'sonata-st-mark-i.mp3',
      'sonata-st-mark-iv.mp3',
      'tenebrae-factae-sunt.mp3',
      'the-shift-geologic.mp3',
      'tribute.mp3',
      'trumpet-voluntary.mp3',
      'vespers-feb.mp3',
      'violin-partita-corrente.mp3',
      'wedding-march.mp3',
      'when-the-saints.mp3',
      'whereer-you-walk.mp3'
    ];
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
