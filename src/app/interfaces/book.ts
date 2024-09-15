import { Page } from './page';

export interface Book {
    name: string;
    pages: Page[];
    hidden?: boolean;
}
  