import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable, of, throwError} from 'rxjs';
import {DUMMY_JOURNALS} from './dummy-data';

const API_URL = "https://wpe-journal-api.onrender.com";

const USE_DUMMY_DATA = false;

export const CATEGORIES = ['church', 'classroom', 'community', 'court', 'culture'];

export interface JournalPreview {
  uuid: string;
  title: string;
  organization: string;
}

export interface Journal {
  uuid: string;
  title: string;
  category: string;
  organization: string;
  date: string;
  venue: string;
  role: string;
  points: number;
  article: string;
  images: string[];
}

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);

  getJournals(category: string): Observable<JournalPreview[]> {
    if (USE_DUMMY_DATA) {
      if (!CATEGORIES.includes(category)) return throwError(() => new Error('Invalid category.'));
      return of(
        DUMMY_JOURNALS.filter((j) => j.category === category).map(({ uuid, title, organization }) => ({
          uuid,
          title,
          organization,
        })),
      );
    }

    // The API returns null for an empty category.
    return this.http
      .get<JournalPreview[] | null>(`${API_URL}/journals/${category}`)
      .pipe(map((journals) => journals ?? []));
  }

  getJournal(category: string, id: string): Observable<Journal> {
    if (USE_DUMMY_DATA) {
      const journal = DUMMY_JOURNALS.find((j) => j.category === category && j.uuid === id);
      return journal ? of(journal) : throwError(() => new Error('Journal not found.'));
    }

    return this.http.get<Journal>(`${API_URL}/journals/${category}/${id}`);
  }
}
