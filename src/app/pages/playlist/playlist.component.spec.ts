import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MaterialModule } from '../../material.module';
import { PlaylistComponent } from './playlist.component';
import { FileService } from '../../services/file.service';
import { AudioService } from '../../services/audio.service';
import { Track } from '../../interfaces/track-data';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { StreamState } from '../../interfaces/stream-state';
import { CurrentFile } from '../../interfaces/currentFile';
import { ChangeDetectionStrategy } from '@angular/core';

const tracks: Track[] = [
  {
    url:
      'https://ia801403.us.archive.org/4/items/getbackcontinued/Get%20Back...Continued/Disc%201/01%20Get%20Back.mp3',
    name: 'Get Back',
    artist: 'The Beatles',
  },
  {
    url:
      'https://ia801403.us.archive.org/4/items/getbackcontinued/Get%20Back...Continued/Disc%201/02%20Let%20It%20Be.mp3',
    name: 'Let It Be',
    artist: 'The Beatles',
  },
  {
    url:
      'https://ia801403.us.archive.org/4/items/getbackcontinued/Get%20Back...Continued/Disc%201/02%20Let%20It%20Be.mp3',
    name: 'Moon',
    artist: 'The Beatles',
  },
];

const streamState: StreamState = {
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

const selectedTrack: CurrentFile = {
  index: null,
  file: null
};

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;
  let fileService: FileService;
  let audioService: AudioService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistComponent ],
      imports: [ MaterialModule ]
    })
    .overrideComponent(PlaylistComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fileService = TestBed.get(FileService);
    audioService = TestBed.get(AudioService);
    spyOn(fileService, 'getfiles').and.returnValue(of(tracks));
    spyOn(audioService, 'getState').and.returnValue(of(streamState));
    spyOn(fileService, 'getCurrentFile').and.returnValue(of(selectedTrack));

    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
  });

  it('should show the playlist with the correct track names', () => {
    fixture.detectChanges();
    const trackList = fixture.debugElement.queryAll(By.css('mat-list-item'));
    const trackNames = fixture.debugElement.queryAll(By.css('h4'));

    expect(trackList.length).toBe(tracks.length);
    expect(trackNames.length).toBe(tracks.length);
    trackNames.forEach((nameEl, i) => expect(nameEl.nativeElement.innerHTML).toBe(tracks[i].name));
  });

  it('should call openFile method when a track is selected', () => {
    spyOn(component, 'openFile');
    fixture.detectChanges();
    const trackEl = fixture.debugElement.queryAll(By.css('mat-list-item'))[1];

    trackEl.triggerEventHandler('click', null);
    expect(component.openFile).toHaveBeenCalledWith(tracks[1], 1);
  });

  it('should style the selected track when it is playing or paused', () => {
    const streamState1: StreamState = {
      canplay: true,
      currentTime: 6.408046,
      duration: 241.031837,
      ended: false,
      error: false,
      paused: false,
      playing: true,
      readableCurrentTime: '00:00:06',
      readableDuration: '00:04:01'
    };

    const streamState2: StreamState = {
      canplay: true,
      currentTime: 6.408046,
      duration: 241.031837,
      ended: false,
      error: false,
      paused: true,
      playing: false,
      readableCurrentTime: '00:00:06',
      readableDuration: '00:04:01'
    };

    const selectedTrack1: CurrentFile = {
      index: 1,
      file: tracks[1]
    };

    // while playing
    component.currentFile$ = of(selectedTrack1);
    component.streamState$ = of(streamState1);
    fixture.detectChanges();
    const trackEl: HTMLElement = fixture.debugElement.queryAll(By.css('mat-list-item'))[1].nativeElement;
    const playEl: HTMLElement = fixture.debugElement.queryAll(By.css('span'))[0].nativeElement;

    expect(trackEl.classList).toContain('playing');
    expect(playEl.innerHTML).toContain('Playing');

    // while paused
    component.streamState$ = of(streamState2);
    fixture.detectChanges();
    const pauseEl: HTMLElement = fixture.debugElement.queryAll(By.css('span'))[0].nativeElement;

    expect(pauseEl.innerHTML).toContain('Paused');
  });

  it('should show an error when the selected track can\'t play', () => {
    const streamState1: StreamState = {
      canplay: false,
      currentTime: undefined,
      duration: undefined,
      ended: false,
      error: true,
      paused: false,
      playing: false,
      readableCurrentTime: '',
      readableDuration: ''
    };

    const selectedTrack1: CurrentFile = {
      index: 1,
      file: tracks[1]
    };

    component.currentFile$ = of(selectedTrack1);
    component.streamState$ = of(streamState1);
    fixture.detectChanges();
    const trackEl: HTMLElement = fixture.debugElement.queryAll(By.css('mat-list-item'))[1].nativeElement;
    const errorEl: HTMLElement = fixture.debugElement.query(By.css('h6')).nativeElement;

    expect(trackEl.classList).not.toContain('playing');
    expect(errorEl.innerHTML).toContain('ERROR');
  });

});

