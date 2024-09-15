import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
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
    ) {}

    async ngOnInit() {
      this.books = await this.githubService.getBooks();
      this.books.forEach(book => book.hidden = true);
      console.log(this.books);
    }

    setPage(page: Page) {
      this.selectedPage = page;
      this.pageUrl.emit(page.download_url);
    }

    toggleHidden(book: Book) {
      book.hidden = !book.hidden;
    }
}