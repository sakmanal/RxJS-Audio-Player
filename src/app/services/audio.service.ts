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
    'ended', 'error', 'play', 'playing', 'pause', 'timeupdate', 'canplay', 'loadedmetadata', 'loadstart', 'ended'
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
  };
  private streamStateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.streamState);

  private streamObservable(url) {
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
      };
    });
  }

  private addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url) {
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
    this.resetState();
    this.streamStateChange.next(this.streamState);
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
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
        // console.log('ended');
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
      error: false
    };
  }

  getState(): Observable<StreamState> {
    return this.streamStateChange.asObservable();
  }
}
