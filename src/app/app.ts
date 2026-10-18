import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CATEGORIES } from './api';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  template: `
    <header class="site-header">
      <nav class="nav">
        <a class="wordmark" routerLink="/" (click)="menuOpen.set(false)">WPE Journal</a>
        <button
          type="button"
          class="menu-toggle"
          aria-controls="nav-links"
          [attr.aria-expanded]="menuOpen()"
          (click)="menuOpen.set(!menuOpen())"
        >
          {{ menuOpen() ? 'Close' : 'Categories' }}
        </button>
        <ul id="nav-links" class="nav-links" [class.open]="menuOpen()">
          @for (category of categories; track category) {
            <li [attr.data-category]="category">
              <a [routerLink]="['/', category]" routerLinkActive="active" (click)="menuOpen.set(false)">{{ category }}</a>
            </li>
          }
        </ul>
      </nav>
    </header>
    <main class="page"><router-outlet /></main>
  `,
  styles: `
    .site-header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--paper);
      border-bottom: 1px solid var(--line);
    }
    .nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem 2rem;
      max-width: var(--wide);
      margin: 0 auto;
      padding: 0.9rem 1.25rem;
    }
    .menu-toggle {
      display: none;
      padding: 0.4rem 0.9rem;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: none;
      color: var(--ink);
      font: 500 0.9375rem var(--display);
      cursor: pointer;
    }
    .wordmark {
      font-family: var(--display);
      font-size: 1.375rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--ink);
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 0.25rem;
      /* Pull the last link's padding out so its text lines up with the page edge. */
      margin: 0 -0.75rem 0 0;
      padding: 0;
      list-style: none;
    }
    .nav-links a {
      display: block;
      padding: 0.35rem 0.75rem;
      font-family: var(--display);
      font-weight: 500;
      color: var(--muted);
      text-decoration: none;
      text-transform: capitalize;
    }
    .nav-links a:hover {
      color: var(--accent);
    }
    .nav-links a.active {
      color: var(--accent);
      text-decoration: underline 3px;
      text-underline-offset: 0.35em;
    }

    /* Phones: categories collapse behind a toggle and open as a full-width list. */
    @media (max-width: 640px) {
      .menu-toggle { display: block; }
      .nav-links {
        display: none;
        flex-basis: 100%;
        flex-direction: column;
        gap: 0;
        margin: 0;
        padding-bottom: 0.25rem;
      }
      .nav-links.open { display: flex; }
      .nav-links li + li { border-top: 1px solid var(--line); }
      .nav-links a {
        padding: 0.8rem 0;
        font-size: 1.125rem;
      }
    }
  `,
})
export class App {
  protected readonly categories = CATEGORIES;
  protected readonly menuOpen = signal(false);
}
