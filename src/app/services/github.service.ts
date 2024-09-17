import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor() {}

  async getBooks() {
    try {
      const repoUrl = 'https://api.github.com/repos/Feliperojas2601/ClassNotes/contents';
      const response = await fetch(repoUrl).then(response => response.json());
      const books = await Promise.all(response.map(async (item: any) => {
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
    } catch (error) {
      console.error('Error al cargar los libros:', error);
      return [];
    }
  }

  async getPages(bookName: string) {
    try {
      const repoUrl = `https://api.github.com/repos/Feliperojas2601/ClassNotes/contents/${bookName}`;
      const response = await fetch(repoUrl).then(response => response.json());
      const pages = response.map((item: any) => {
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
  //Deploy
}
