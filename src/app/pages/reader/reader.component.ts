import { Component } from '@angular/core';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { MarkdownComponent } from './components/markdown/markdown.component';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [
    SidebarComponent, 
    MarkdownComponent,
  ],
  templateUrl: './reader.component.html',
  styleUrl: './reader.component.css'
})
export class ReaderComponent {
  pageUrl: string = '';

  setPageUrl(url: string) {
    this.pageUrl = url;
  }
}