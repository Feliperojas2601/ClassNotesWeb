import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, NgZone, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../../../../interfaces/book';
import { GithubService } from '../../../../services/github.service';
import { Page } from '../../../../interfaces/page';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    books: Book[] = []; 
    selectedPage: Page | null = null;
    @Output() pageUrl = new EventEmitter<string>();

    constructor(
      private githubService: GithubService
    ) {
      const ngZone = inject(NgZone);
      ngZone.runOutsideAngular(() => {
        this.githubService.getBooks().then(books => {
          ngZone.run(() => {
            this.books = books;
            this.books.forEach(book => book.hidden = true);
          });
        }).catch(error => {
          console.error('Error al cargar los libros:', error);
        });
      });
    } 

    setPage(page: Page) {
      this.selectedPage = page;
      this.pageUrl.emit(page.download_url);
    }

    toggleHidden(book: Book) {
      book.hidden = !book.hidden;
    }
}