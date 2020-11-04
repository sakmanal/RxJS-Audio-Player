import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CloudService } from '../../services/cloud.service';
import { StreamState } from '../../interfaces/stream-state';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};
  repeat = false;

  constructor(private audioService: AudioService, cloudService: CloudService) {
    // get media files
    cloudService.getFiles().subscribe(files => {
      this.files = files;
    });

    // listen to stream state
    this.audioService.getState()
    .subscribe(state => {
      this.state = state;
      // console.log(this.state);
    });
  }

  playStream(url) {
    this.audioService.playStream(url)
    .subscribe((events: any) => {
      if (events && events.type === 'ended') {
         this.handleNext();
      }
    });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
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

  handleNext() {
    if (!this.repeat) {
      this.next();
    } else {
      this.audioService.stop();
      this.playStream(this.currentFile.file.url);
    }
  }

  next() {
      if (this.isLastPlaying()) {
          const file = this.files[0];
          this.openFile(file, 0);
      } else {
        const index = this.currentFile.index + 1;
        const file = this.files[index];
        this.openFile(file, index);
      }
  }

  setRepeat() {
    this.repeat = !this.repeat;
  }

  previous() {
      const index = this.currentFile.index - 1;
      const file = this.files[index];
      this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }
}
