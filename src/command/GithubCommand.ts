import Octokit from '@octokit/rest';
import { ParsedArgs } from 'minimist';

import { HelpTopic } from '../helpTopic';
import { AsyncCommand } from './types';

export class GithubCommand extends AsyncCommand {

  private octokit: Octokit;
  private username: string;

  public name: string = 'github';
  public description: string = '- Use the github.com API. Type `help github` for subcommands. The `-u=<username>` parameter is available to all commands.';
  public helpTopic: HelpTopic;
  public subCommands: { [key: string]: AsyncCommand } = {};

  constructor() {
    super();

    this.octokit = new Octokit();
    this.username = 'markfullmer';

    this.helpTopic = new HelpTopic(this, {
      synopsis: 'github',
    });

    this.subCommands['contributions'] = new GitHubContribsSubCommand(this.octokit, this.username)
    this.subCommands['organizations'] = new GitHubOrgsSubCommand(this.octokit, this.username)
    this.subCommands['repositories'] = new GitHubReposSubCommand(this.octokit, this.username);
  }

  run(args: ParsedArgs): Promise<any> {
    if (args.u) {
      this.username = args.u;
    }
    let ps = [
      // personal data
      this.octokit
        .users
        .getByUsername({ username: this.username })
        .then((res: any) => {
          let data: any = {
            name: res.data.name,
            url: res.data.html_url,
            followers: res.data.followers,
            public_repos: res.data.public_repos,
            private_repos: res.data.total_private_repos
          };

          if (res.data.email) {
            data.email = res.data.email;
          }

          return data;
        }),
      // organizations
      this.octokit
        .orgs
        .listForUser({ username: this.username })
        .then((res: any) => {
          return {
            organizations: res.data.map((org: any) => org.login).join(', ')
          };
        })
    ];

    return Promise.all(ps).then((rs) => rs.reduce((op, on) => Object.assign(op, on), {}));
  }

}

class GitHubContribsSubCommand extends AsyncCommand {

  private octokit: Octokit;
  private username: string;

  public name: string = 'contributions';
  public description: string = 'Type `github contributions` to list github.com activity.';
  public helpTopic: HelpTopic;
  public subCommands: { [key: string]: AsyncCommand } = {};

  constructor(octokit: Octokit, username: string) {
    super();

    this.octokit = octokit;
    this.username = username;

    this.helpTopic = new HelpTopic(this, {
      synopsis: 'github contributions',
    });
  }

  run(args: ParsedArgs): Promise<any> {
    if (args.u) {
      this.username = args.u;
    }
    /**
     * Contributions are defined as merged pull requests at the moment
     */
    return this.searchClosedPulls()
      .then((pulls: any) => {
        return pulls
          .filter((pull: any) => (
            pull.repository_url.indexOf(`https://api.github.com/repos/${this.username}/`) !== 0
          ))
          .map((pull: any) => ({
            repo: pull.repository_url.replace('https://api.github.com/repos/', ''),
            url: pull.html_url,
            closed_at: pull.closed_at
          }));
      });
  }

  searchClosedPulls(page?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.octokit
        .search
        .issuesAndPullRequests({ q: `type:pr+is:merged+author:${this.username}`, page: page || 1, per_page: 100, sort: 'updated', order: 'desc' })
        .catch(reject)
        .then((res: any) => {
          if (page === undefined && res.data.total_count > 100) {
            // if we just queried the first page and the results are incomplete
            // then we create a promise for every remaining page and wait for 
            // all of them to finish in order to resolve the outer one
            let pages = Math.ceil(res.data.total_count / 100);
            let ps: Array<Promise<any>> = [];
            for (let i = 1; i < pages; i++) {
              ps.push(this.searchClosedPulls(i));
            }
            Promise
              .all(ps)
              .catch(reject)
              .then((rs: any) => {
                let items = rs.reduce(
                  (prev: Array<any>, curr: Array<any>) => prev.concat(curr),
                  res.data.items
                );
                resolve(items);
              });
          }
          else {
            resolve(res.data.items);
          }
        });
    });
  }

}

class GitHubOrgsSubCommand extends AsyncCommand {

  private octokit: Octokit;
  private username: string;

  public name: string = 'organizationss';
  public description: string = 'Type `github organizations` to list all memberships.';
  public helpTopic: HelpTopic;
  public subCommands: { [key: string]: AsyncCommand } = {};

  constructor(octokit: Octokit, username: string) {
    super();

    this.octokit = octokit;
    this.username = username;

    this.helpTopic = new HelpTopic(this, {
      synopsis: 'github orgs',
    });
  }

  run(args: ParsedArgs): Promise<any> {
    if (args.u) {
      this.username = args.u;
    }
    return this.octokit
      .orgs
      .listForUser({ username: this.username })
      .then((res: any) => {
        return res.data.map((org: any) => ({
          name: org.login,
          url: org.url.replace('api.github.com', 'github.com'),
        }));
      })
  }

}

class GitHubReposSubCommand extends AsyncCommand {

  private octokit: Octokit;
  private username: string;

  public name: string = 'repositories';
  public description: string = 'Type `github repositories` to list all public projects. Use `-l=<language> to filter by programming language.';
  public helpTopic: HelpTopic;
  public subCommands: { [key: string]: AsyncCommand } = {};

  constructor(octokit: Octokit, username: string) {
    super();

    this.octokit = octokit;
    this.username = username;

    this.helpTopic = new HelpTopic(this, {
      synopsis: 'github repositories [-l]',
      options: {
        '-l': 'List all repos written in a specified language'
      },
      examples: [
        {
          cmd: 'github repos -l C++',
          description: 'The following command shows all owned GitHub repos written in C++ language'
        }
      ]
    });
  }

  run(args: ParsedArgs): Promise<any> {
    if (args.u) {
      this.username = args.u;
    }
    return this.octokit
      .repos
      .listForUser({ username: this.username, sort: 'updated', direction: 'desc' })
      .then(res => {
        let data = res.data.map((repo: any) => ({
          name: repo.full_name,
          language: repo.language || '',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          last_updated: repo.updated_at
        }));

        if (args.l) {
          data = data.filter((i: any) => i.language.indexOf(args.l) >= 0);
        }

        return data;
      });
  }

}
