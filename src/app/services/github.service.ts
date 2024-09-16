import { Injectable } from '@angular/core';
import { Octokit } from "octokit";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor() {}

  async getBooks() {
    try {
      const GITHUB_TOKEN = environment.githubToken;
      if (!GITHUB_TOKEN) {
        throw new Error('No se ha configurado el token de GitHub');
      }
      const octokit = new Octokit({ 
        auth: GITHUB_TOKEN,
      });
      const response = await octokit.request('GET /repos/{owner}/{repo}/contents/', {
        owner: 'Feliperojas2601',
        repo: 'ClassNotes',
      });
      const books = await Promise.all(response.data.map(async (item: any) => {
          return {
              name: item.name.replaceAll('_', ' '),
              pages: (await this.getPages(item.name, octokit))
                  .filter((page: any) => page !== null)
                  .sort((a: any, b: any) => {
                      return this.extractNumberFromName(a.name) - this.extractNumberFromName(b.name);
                  }),
          };
      }));
      return books;  
    } catch (error) {
      console.error('Error al cargar los libros:', error);
      return [];
    }
  }

  async getPages(bookName: string, octokit: any) {
    try {
      const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
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
    } catch (error) {
      console.error('Error al cargar las páginas:', error);
      return [];
    }
  }

  extractNumberFromName(name: string): number {
    const match = name.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : Infinity;
  }

  async getMarkdownContent(url: string) {
    return await fetch(url).then(response => response.text());
  }
}
