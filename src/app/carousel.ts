import { Component, DestroyRef, ElementRef, inject, input, signal, viewChild } from '@angular/core';

const AUTOPLAY_MS = 5000;

@Component({
  selector: 'app-carousel',
  template: `
    <div class="track" #track (scroll)="onScroll()" (pointerenter)="paused = true" (pointerleave)="paused = false">
      @for (image of images(); track $index) {
        <button type="button" class="slide" (click)="open(image, $index)">
          <img [src]="image" [alt]="alt($index)" />
        </button>
      }
    </div>
    @if (images().length > 1) {
      <div class="controls">
        <button type="button" class="nav" (click)="go(index() - 1)" aria-label="Previous photo">‹</button>
        <span class="count" aria-live="polite">{{ index() + 1 }} of {{ images().length }}</span>
        <button type="button" class="nav" (click)="go(index() + 1)" aria-label="Next photo">›</button>
      </div>
    }

    <dialog #dialog class="lightbox" (click)="close()">
      @if (selected(); as s) {
        <img [src]="s.src" [alt]="alt(s.index)" />
      }
      <button type="button" class="close" (click)="close()" aria-label="Close photo">×</button>
    </dialog>
  `,
  styles: `
    :host { display: block; }
    .track {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      scrollbar-width: none;
      border-radius: 0.75rem;
      background: var(--accent-soft);
    }
    .track::-webkit-scrollbar { display: none; }
    .slide {
      flex: 0 0 100%;
      padding: 0;
      border: 0;
      background: none;
      cursor: zoom-in;
      scroll-snap-align: start;
    }
    /* Fixed frame; the full picture is shown in the lightbox. */
    .slide img {
      display: block;
      width: 100%;
      aspect-ratio: 3 / 2;
      object-fit: cover;
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 0.75rem;
    }
    .nav {
      width: 2.5rem;
      height: 2.5rem;
      border: 0;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
    }
    .count { min-width: 4rem; text-align: center; color: var(--muted); }

    .lightbox {
      max-width: none;
      max-height: none;
      width: 100vw;
      height: 100dvh;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: zoom-out;
    }
    .lightbox::backdrop { background: rgb(15 18 26 / 0.92); }
    .lightbox[open] {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lightbox img {
      max-width: calc(100vw - 2rem);
      max-height: calc(100dvh - 2rem);
      object-fit: contain;
    }
    .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 2.75rem;
      height: 2.75rem;
      border: 0;
      border-radius: 50%;
      background: rgb(255 255 255 / 0.15);
      color: #fff;
      font-size: 1.75rem;
      line-height: 1;
      cursor: pointer;
    }
    .close:hover { background: rgb(255 255 255 / 0.3); }
    @media (prefers-reduced-motion: reduce) {
      .track { scroll-behavior: auto; }
    }
  `,
})
export class Carousel {
  readonly images = input.required<string[]>();
  readonly label = input('');

  protected readonly index = signal(0);
  protected readonly selected = signal<{ src: string; index: number } | null>(null);
  private track = viewChild.required<ElementRef<HTMLElement>>('track');
  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  // Paused while a pointer or finger is on the photos or the lightbox is open.
  protected paused = false;
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) this.restartAutoplay();
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  private restartAutoplay() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.paused && this.images().length > 1) this.scrollTo(this.index() + 1);
    }, AUTOPLAY_MS);
  }

  protected alt(i: number) {
    return `Photo ${i + 1} of ${this.images().length} from ${this.label()}`;
  }

  // Manual navigation; restarts the countdown so the next auto-advance waits a full interval.
  protected go(i: number) {
    this.scrollTo(i);
    if (this.timer) this.restartAutoplay();
  }

  // Wraps around in both directions.
  private scrollTo(i: number) {
    const n = this.images().length;
    const el = this.track().nativeElement;
    el.scrollTo({ left: (((i % n) + n) % n) * el.clientWidth });
  }

  // Keeps the counter in sync with swipes as well as button clicks.
  protected onScroll() {
    const el = this.track().nativeElement;
    this.index.set(Math.round(el.scrollLeft / el.clientWidth));
  }

  protected open(src: string, index: number) {
    this.selected.set({ src, index });
    this.paused = true;
    this.dialog().nativeElement.showModal();
  }

  protected close() {
    this.dialog().nativeElement.close();
    this.paused = false;
  }
}
