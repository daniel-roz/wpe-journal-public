import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from './api';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <p class="intro">
      <span class="hook">Looking back, I did more than I realized.</span>
    </p>
    <ul class="tiles">
      @for (category of categories; track category) {
        <li [attr.data-category]="category">
          <a class="tile" [routerLink]="['/', category]">
            <span class="name">{{ category }}</span>
          </a>
        </li>
      }
    </ul>
  `,
  styles: `
    .intro {
      max-width: 40ch;
      margin: 1rem 0 2rem;
      font-family: var(--display);
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      line-height: 1.3;
      color: var(--muted);
    }
    .hook {
      display: block;
      margin-bottom: 0.25em;
      font-size: 1.6em;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.035em;
      color: var(--ink);
      text-wrap: balance;
    }
    /* Full-bleed bands, stacked, spanning the whole screen width. */
    .tiles {
      width: 100vw;
      margin: 0 0 -4rem calc(50% - 50vw);
      padding: 0;
      list-style: none;
    }
    .tile {
      display: block;
      /* Keep text aligned with the page column. */
      padding: 1.75rem max(1.25rem, calc((100vw - var(--wide)) / 2));
      background: var(--accent-soft);
      color: var(--accent);
      text-decoration: none;
      transition: background-color 0.15s, color 0.15s;
    }
    .tile:hover {
      background: var(--accent);
      color: #fff;
    }
    .name {
      display: block;
      font-family: var(--display);
      font-size: clamp(2.75rem, 9vw, 6rem);
      font-weight: 800;
      line-height: 0.95;
      letter-spacing: -0.045em;
      text-transform: lowercase;
    }
  `,
})
export class Home {
  protected readonly categories = CATEGORIES;
}
