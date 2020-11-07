import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { Track } from '../../interfaces/track-data';
import { CurrentFile } from '../../interfaces/currentFile';
import { Observable } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../interfaces/stream-state';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistComponent {

  constructor(private fileService: FileService, private audioService: AudioService) { }

  files$: Observable<Track[]> = this.fileService.getfiles();
  currentFile$: Observable<CurrentFile> = this.fileService.getCurrentFile();
  streamState$: Observable<StreamState> = this.audioService.getState();

  openFile(file: Track, index: number) {
    this.fileService.setCurrentFile({ index, file });
    this.initStream();
  }

  private initStream() {
    const src = this.fileService.currentFileSource;
    this.audioService.stop();
    this.audioService.playStream(src).subscribe();
  }

}
