import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Track } from '../interfaces/track-data';

@Injectable({
  providedIn: 'root'
})
export class CloudService {
  readonly files: Track[] = [
    {
      url: 'https://ia801403.us.archive.org/4/items/getbackcontinued/Get%20Back...Continued/Disc%201/01%20Get%20Back.mp3',
      name: 'Get Back',
      artist: 'The Beatles'
    },
    {
      url: 'https://ia801403.us.archive.org/4/items/getbackcontinued/Get%20Back...Continued/Disc%201/02%20Let%20It%20Be.mp3',
      name: 'Let It Be',
      artist: 'The Beatles'
    },
    {
      url: 'https://ia800202.us.archive.org/12/items/DriveMyCar/DriveMyCar.mp3',
      name: 'Drive My Car',
      artist: 'The Beatles'
    },
    {
      // tslint:disable-next-line: max-line-length
      url: 'https://ia801406.us.archive.org/34/items/13-a-day-in-the-life/12-Sgt.%20Pepper%27s%20Lonely%20Hearts%20Club%20Band%20%28Reprise%29.mp3',
      // tslint:disable-next-line: quotemark
      name: "Sgt. Pepper's Lonely Hearts Club Band",
      artist: 'The Beatles'
    },
    {
      url: 'https://ia801005.us.archive.org/3/items/adayinthelife_201907/14%20-%20Rain.mp3',
      name: 'Rain',
      artist: 'The Beatles'
    },
    {
      url: 'https://ia801005.us.archive.org/3/items/adayinthelife_201907/16%20-%20Hey%20Jude.mp3',
      name: 'Hey Jude',
      artist: 'The Beatles'
    },
    {
      url: 'https://ia601005.us.archive.org/3/items/adayinthelife_201907/15%20-%20Lady%20Madonna.mp3',
      name: 'Lady Madonna',
      artist: 'The Beatles'
    },
    {
      url: 'https://ia801005.us.archive.org/3/items/adayinthelife_201907/12%20-%20While%20My%20Guitar%20Gently%20Weeps.mp3',
      name: 'While My Guitar Gently Weeps',
      artist: 'The Beatles'
    },
    {
      url: 'https://ia801005.us.archive.org/3/items/adayinthelife_201907/02%20-%20A%20Day%20In%20The%20Life.mp3',
      name: 'A Day In The Life',
      artist: 'The Beatles'
    }
  ];

  getFiles(): Observable<Track[]> {
   return of(this.files);
  }
}
