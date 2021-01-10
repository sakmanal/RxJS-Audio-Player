import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../interfaces/stream-state';
import { CurrentFile } from '../../interfaces/currentFile';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit{

  repeat = false;
  currentFile$: Observable<CurrentFile> = this.fileService.getCurrentFile();
  streamState$: Observable<StreamState> = this.audioService.getState()
  .pipe(
    tap((stream: StreamState) => {
        if (stream.ended) {
            this.handleNext();
        }
      }
    )
  );

  constructor(private audioService: AudioService, private fileService: FileService) {}

  ngOnInit() {}

  private playStream(url: string) {
    this.audioService.playStream(url).subscribe();
  }

  initStream() {
    const src = this.fileService.currentFileSource;
    this.audioService.stop();
    this.playStream(src);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  onSliderChangeEnd(event: MatSliderChange) {
    this.audioService.seekTo(event.value);
  }

  private handleNext() {
    if (!this.repeat) {
      this.next();
    } else {
      this.initStream();
    }
  }

  next() {
    this.fileService.setNextFile();
    this.initStream();
  }

  previous() {
    this.fileService.setPreviousFile();
    this.initStream();
  }

  isFirstPlaying(): boolean {
    return this.fileService.isFirstFile;
  }

  isLastPlaying(): boolean {
    return this.fileService.isLastFile;
  }

  setRepeat() {
    this.repeat = !this.repeat;
  }
}
