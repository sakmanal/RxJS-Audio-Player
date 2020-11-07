import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../interfaces/stream-state';
import { CurrentFile } from '../../interfaces/currentFile';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {

  repeat = false;
  currentFile$: Observable<CurrentFile> = this.fileService.getCurrentFile();
  streamState$: Observable<StreamState> = this.audioService.getState();

  constructor(private audioService: AudioService, private fileService: FileService) {
    this.streamState$.subscribe((stream: StreamState) => {
      if (stream.ended) {
          this.handleNext();
      }
    });
  }

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

  onSliderChangeEnd(change: {value: number}) {
    this.audioService.seekTo(change.value);
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
