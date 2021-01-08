import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { StreamState } from '../interfaces/stream-state';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart',
    'ended'
  ];
  private streamState: StreamState = {
    playing: false,
    paused: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
    ended: false
  };
  private streamStateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.streamState);

  private streamObservable(url: string) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset streamState
        this.resetState();
        this.streamStateChange.next(this.streamState);
        // reset Audio Object
        this.audioObj = new Audio();
      };
    });
  }

  private addEvents(obj: HTMLAudioElement, events: string[], handler: EventListenerOrEventListenerObject) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: HTMLAudioElement, events: string[], handler: EventListenerOrEventListenerObject) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url: string) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    if (this.audioObj.src) {
       this.audioObj.play();
    }
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss'): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.streamState.duration = this.audioObj.duration;
        this.streamState.readableDuration = this.formatTime(this.streamState.duration);
        this.streamState.canplay = true;
        break;
      case 'playing':
        this.streamState.playing = true;
        this.streamState.paused = false;
        break;
      case 'pause':
        this.streamState.playing = false;
        this.streamState.paused = true;
        break;
      case 'timeupdate':
        this.streamState.currentTime = this.audioObj.currentTime;
        this.streamState.readableCurrentTime = this.formatTime(this.streamState.currentTime);
        break;
      case 'ended':
        this.streamState.ended = true;
        break;
      case 'error':
        this.resetState();
        this.streamState.error = true;
        break;
    }
    this.streamStateChange.next(this.streamState);
  }

  private resetState() {
    this.streamState = {
      playing: false,
      paused: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
      ended: false
    };
  }

  getState(): Observable<StreamState> {
    return this.streamStateChange.asObservable();
  }
}
