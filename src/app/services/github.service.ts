import { Injectable } from '@angular/core';
import { Octokit } from "octokit";
import { env } from 'process';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private GITHUB_TOKEN = environment.githubToken;

  private octokit = new Octokit({ 
      auth: this.GITHUB_TOKEN,
  });

  constructor() {}

  async getBooks() {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/', {
      owner: 'Feliperojas2601',
      repo: 'ClassNotes',
    });
    const books = await Promise.all(response.data.map(async (item: any) => {
        return {
            name: item.name.replaceAll('_', ' '),
            pages: (await this.getPages(item.name))
                .filter((page: any) => page !== null)
                .sort((a: any, b: any) => {
                    return this.extractNumberFromName(a.name) - this.extractNumberFromName(b.name);
                }),
        };
    }));
    return books;
  }

  async getPages(bookName: string) {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'Feliperojas2601',
        repo: 'ClassNotes',
        path: bookName,
    });
    if (!response) {
        return [];
    }
    const pages = (response as any).data.map((item: any) => {
        if (item.name === 'images') {
            return null;
        }
        return {
            name: item.name,
            download_url: item.download_url,
        };
    });
    return pages; 
  }

  extractNumberFromName(name: string): number {
    const match = name.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : Infinity;
  }

  async getMarkdownContent(url: string) {
    return await fetch(url).then(response => response.text());
  }
}
