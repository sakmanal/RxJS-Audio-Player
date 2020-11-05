import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../interfaces/track-data';
import { CurrentFile } from '../interfaces/currentFile';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private fileSubject: BehaviorSubject<Track[]> = new BehaviorSubject(null);
  private currentFileSubject: BehaviorSubject<CurrentFile> = new BehaviorSubject({index: null, file: null});

  constructor() { }

  get files(): Track[] {
    return this.fileSubject.value;
  }

  getfiles(): Observable<Track[]> {
    return this.fileSubject.asObservable();
  }

  setfiles(trackfiles: Track[]) {
    this.fileSubject.next(trackfiles);
  }

  setCurrentFile(currentFile: CurrentFile) {
    this.currentFileSubject.next(currentFile);
  }

  get currentFile(): CurrentFile {
    return this.currentFileSubject.value;
  }

  getCurrentFile(): Observable<CurrentFile> {
    return this.currentFileSubject.asObservable();
  }

  get currentFileSource(): string {
    return this.currentFile.file.url;
  }

  setNextFile() {
    const index = this.isLastFile ? 0 : this.currentFile.index + 1;
    const file = this.files[index];
    this.setCurrentFile({ index, file });
  }

  setPreviousFile() {
    const index = this.isFirstFile ? 0 : this.currentFile.index - 1;
    const file = this.files[index];
    this.setCurrentFile({ index, file });
  }

  get isFirstFile(): boolean {
    return this.currentFile.index === 0;
  }

  get isLastFile(): boolean {
    return this.currentFile.index === this.files.length - 1;
  }
}
