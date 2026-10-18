import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Api } from './api';

@Component({
  selector: 'app-category',
  imports: [RouterLink],
  host: { '[attr.data-category]': 'category()' },
  template: `
    <h1 class="title">{{ category() }}</h1>
    @if (journals.isLoading()) {
      <p class="status">Loading journals…</p>
    } @else if (journals.error()) {
      <p class="status">Couldn't load journals for this category. Check that the API is running, then refresh.</p>
    } @else {
      <ul class="journals">
        @for (journal of journals.value(); track journal.uuid) {
          <li>
            <a [routerLink]="['/', category(), journal.uuid]">
              <span class="journal-title">{{ journal.title }}</span>
              <span class="org">{{ journal.organization }}</span>
            </a>
          </li>
        } @empty {
          <li class="status">No journals in this category yet.</li>
        }
      </ul>
    }
  `,
  styles: `
    :host { display: block; }
    .title {
      margin: 1rem 0 1.5rem;
      font-family: var(--display);
      font-size: clamp(3rem, 10vw, 6rem);
      font-weight: 800;
      line-height: 0.9;
      letter-spacing: -0.045em;
      text-transform: lowercase;
      color: var(--accent);
    }
    .journals {
      margin: 0;
      padding: 0;
      list-style: none;
      border-top: 2px solid var(--accent);
    }
    .journals li { border-bottom: 1px solid var(--line); }
    .journals a {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.25rem 1.5rem;
      padding: 1.1rem 0.5rem;
      color: var(--ink);
      text-decoration: none;
    }
    .journals a:hover { background: var(--accent-soft); }
    .journals a:hover .journal-title { color: var(--accent); }
    .journal-title {
      font-family: var(--display);
      font-size: 1.375rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .org { color: var(--muted); }
    .status { padding: 1.1rem 0.5rem; color: var(--muted); }
  `,
})
export class Category {
  private api = inject(Api);

  readonly category = input.required<string>();

  protected readonly journals = rxResource({
    params: () => this.category(),
    stream: ({ params }) => this.api.getJournals(params),
  });
}
