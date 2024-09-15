import { Component, Input, SimpleChanges } from '@angular/core';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { GithubService } from '../../../../services/github.service';

@Component({
  selector: 'app-markdown',
  standalone: true,
  imports: [],
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.css'
})
export class MarkdownComponent {
  @Input() pageUrl: string = '';
  content: string = '';

  constructor(private githubService: GithubService) {
    this.setupMarked();
  }

  // Configuración de 'marked' similar a la que tenías en Astro
  setupMarked() {
    const renderer = new marked.Renderer();
    renderer.heading = ({tokens, depth}) => {
      if (depth === 1) {
        return `<h${depth} class="text-4xl font-extrabold text-blue-500">${tokens[0].raw}</h${depth}>`;
      } else if (depth === 2) {
        return `<h${depth} class="text-3xl font-extrabold text-blue-500">${tokens[0].raw}</h${depth}>`;
      } else if (depth === 3) {
        return `<h${depth} class="text-2xl font-bold text-blue-200">${tokens[0].raw}</h${depth}><hr class="border-t border-gray-300 mb-2"/>`;
      } else {
        return `<h${depth} class="text-xl font-bold text-blue-200">${tokens[0].raw}</h${depth}><hr class="border-t border-gray-300 mb-2"/>`;
      }
    };
    renderer.link = ({href, title, text}) => {
      return `<a href="${href}" target="_blank" class="underline hover:text-blue-400">${text}</a>`;
    };
    renderer.strong = (text) => {
      return `<strong class="font-bold text-blue-200 text-2xl">${text.text}</strong><hr class="border-t border-gray-300 mb-2"/>`;
    };
    renderer.code = ({text, lang, escaped}) => {
      const highlightedCode = hljs.highlightAuto(text, [lang!]).value;
      return `<pre><code class="hljs ${lang!}">${highlightedCode}</code></pre>`;
    };
    marked.setOptions({ renderer });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageUrl'] && this.pageUrl) {
      this.loadMarkdownContent(this.pageUrl);
    }
  }

  async loadMarkdownContent(url: string) {
    try {
      const urlSegments = this.pageUrl.split('/');
      urlSegments.pop();
      const baseUrl = urlSegments.join('/');
      let markdownText = await this.githubService.getMarkdownContent(url);
      markdownText = markdownText.replace(/<img\s+src="(images\/[^"]+)"(?:\s+alt="([^"]*)")?\s*[^>]*>/g, (match, src, alt) => {
        const fileName = src.split('/').pop().split('.')[0];
        const onlyLetters = /^[a-zA-Z]+$/.test(fileName);
        const imgClassWidth = onlyLetters ? 'w-1/2 mx-auto' : 'w-full';
        const newSrc = `${baseUrl}/${src}`;
        return alt 
          ? `<img src="${newSrc}" alt="${alt}" class="${imgClassWidth} mb-2" />`
          : `<img src="${newSrc}" class="${imgClassWidth} mb-2" />`;
      });
      this.content = await marked.parse(markdownText);
    } catch (error) {
      console.error('Error al cargar el contenido:', error);
      this.content = 'Error al cargar el contenido.';
    }
  }
}
