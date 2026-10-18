import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Api } from './api';
import { Carousel } from './carousel';

@Component({
  selector: 'app-journal',
  imports: [Carousel, DatePipe, RouterLink],
  host: { '[attr.data-category]': 'category()' },
  template: `
    <div class="column">
      <a class="back" [routerLink]="['/', category()]">Back to {{ category() }}</a>
      @if (journal.isLoading()) {
        <p class="status">Loading journal…</p>
      } @else if (journal.error()) {
        <p class="status">This journal couldn't be found. It may have been removed.</p>
      } @else if (journal.value(); as j) {
        <article>
          <h1 class="title">{{ j.title }}</h1>
          <dl class="details">
            <div><dt>Organization</dt><dd>{{ j.organization }}</dd></div>
            <div>
              <dt>Date</dt>
              <dd><time [attr.datetime]="j.date">{{ j.date | date: 'MMMM d, y' }}</time></dd>
            </div>
            <div><dt>Venue</dt><dd>{{ j.venue }}</dd></div>
            <div><dt>Role</dt><dd>{{ j.role }}</dd></div>
            <div><dt>Points</dt><dd>{{ j.points }}</dd></div>
          </dl>
          @if (j.images.length) {
            <app-carousel class="carousel" [images]="j.images" [label]="j.title" />
          }
          <div class="article">
            @for (paragraph of paragraphs(j.article); track $index) {
              <p>{{ paragraph }}</p>
            }
          </div>
        </article>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .back {
      display: inline-block;
      margin-top: 1rem;
      font-family: var(--display);
      font-weight: 600;
      color: var(--accent);
      text-decoration: none;
    }
    .back:hover { text-decoration: underline; }
    .column { max-width: 44rem; margin-inline: auto; }
    .title {
      margin: 0.75rem 0 1rem;
      font-family: var(--display);
      font-size: clamp(2.25rem, 6vw, 3.75rem);
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.035em;
    }
    /* One detail per row: label on the left, value on the right. */
    .details {
      display: grid;
      gap: 0.5rem;
      margin: 0 0 2rem;
      padding: 1rem 1.25rem;
      border-left: 4px solid var(--accent);
      border-radius: 0 0.75rem 0.75rem 0;
      background: var(--accent-soft);
    }
    .details div {
      display: grid;
      grid-template-columns: 6.5rem 1fr;
      align-items: baseline;
      gap: 1rem;
    }
    .details dt { font-size: 0.875rem; color: var(--muted); }
    .details dd { margin: 0; font-weight: 600; }
    .article {
      font-family: var(--serif);
      font-size: 1.25rem;
      line-height: 1.7;
      text-align: justify;
      hyphens: auto;
    }
    .article p {
      margin: 0;
      text-indent: 2em;
    }
    /* Smaller type on phones keeps justified lines from opening wide gaps. */
    @media (max-width: 640px) {
      .article { font-size: 1.0625rem; line-height: 1.65; }
      .article p { text-indent: 1.5em; }
    }
    .carousel { margin-bottom: 2rem; }
    .status { color: var(--muted); }
  `,
})
export class Journal {
  private api = inject(Api);

  readonly category = input.required<string>();
  readonly id = input.required<string>();

  protected readonly journal = rxResource({
    params: () => ({ category: this.category(), id: this.id() }),
    stream: ({ params }) => this.api.getJournal(params.category, params.id),
  });

  // Articles are plain text with blank lines between paragraphs.
  protected paragraphs(article: string): string[] {
    return article.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }
}
