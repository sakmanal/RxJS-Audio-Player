import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../material.module';
import { PlayerComponent } from './player.component';
import { AudioService } from '../../services/audio.service';
import { FileService } from '../../services/file.service';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { StreamState } from '../../interfaces/stream-state';
import { CurrentFile } from '../../interfaces/currentFile';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';


const initStream: StreamState = {
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

const playingStream: StreamState = {
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

const pausedStream: StreamState = {
  canplay: true,
  currentTime: 6.408046,
  duration: 241.031837,
  ended: false,
  error: false,
  paused: true,
  playing: false,
  readableCurrentTime: '00:00:10',
  readableDuration: '00:04:01'
};

const initSelectedTrack: CurrentFile = {
  index: null,
  file: null
};

const selectedTrack: CurrentFile = {
  index: 1,
  file: {
    url: 'https://trackUrl.mp3.',
    name: 'Get Back',
    artist: 'The Beatles',
  }
};

class MockFileService {
  get currentFileSource() { return 'trackUrl.mp3'; }
  get isFirstFile() { return false; }
  get isLastFile() { return false; }
  getCurrentFile(): Observable<CurrentFile> {
    return of(initSelectedTrack);
  }
  setNextFile(): void {}
  setPreviousFile(): void {}
}

class MockAudioService {
  getState(): Observable<StreamState> {
    return of(initStream);
  }
  playStream(): Observable<any> {
    return of({});
  }
  stop(): void {}
  play(): void {}
  pause(): void {}
  seekTo(val: number): void {}
}

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let fileService: FileService;
  let audioService: AudioService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerComponent ],
      imports: [ MaterialModule ],
      providers: [
        {provide: AudioService, useClass: MockAudioService},
        {provide: FileService, useClass: MockFileService}
      ]
    })
    .overrideComponent(PlayerComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;

    fileService = TestBed.get(FileService);
    audioService = TestBed.get(AudioService);
  });

  it('should render the time duration values when stream is playing', () => {
    fixture.detectChanges();

    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(playingStream);
    fixture.detectChanges();

    const currentTimeEl = fixture.debugElement.query(By.css('#ctime')).nativeElement;
    const durationEl = fixture.debugElement.query(By.css('#duration')).nativeElement;

    expect(currentTimeEl.innerHTML).toContain(playingStream.readableCurrentTime);
    expect(durationEl.innerHTML).toContain(playingStream.readableDuration);
  });

  it('should render only the pause button when stream is playing', () => {
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(playingStream);
    fixture.detectChanges();

    const playBtn = fixture.debugElement.query(By.css('#play'));
    const pauseBtn = fixture.debugElement.query(By.css('#pause'));

    expect(playBtn).toBeFalsy();
    expect(pauseBtn).toBeTruthy();
  });

  it('should render only the play button when stream is paused', () => {
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(pausedStream);
    fixture.detectChanges();

    const playBtn = fixture.debugElement.query(By.css('#play'));
    const pauseBtn = fixture.debugElement.query(By.css('#pause'));

    expect(playBtn).toBeTruthy();
    expect(pauseBtn).toBeFalsy();
  });

  it('should disable the previous button if track is the first one in playlist', () => {
    spyOnProperty(fileService, 'isFirstFile', 'get').and.returnValue(true);
    // spyOn(component, 'isFirstPlaying').and.returnValue(true);
    component.currentFile$ = of(selectedTrack);
    fixture.detectChanges();

    const prevBtn = fixture.debugElement.query(By.css('#previous')).nativeElement;

    expect(prevBtn.disabled).toBe(true);
  });

  it('should disable the next button if track is the last one in playlist', () => {
    spyOnProperty(fileService, 'isLastFile', 'get').and.returnValue(true);
    // spyOn(component, 'isLastPlaying').and.returnValue(true);
    component.currentFile$ = of(selectedTrack);
    fixture.detectChanges();

    const nextBtn = fixture.debugElement.query(By.css('#next')).nativeElement;

    expect(nextBtn.disabled).toBe(true);
  });

  it('should call the play method when play button is clicked', () => {
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(pausedStream);
    spyOn(component, 'play').and.callThrough();
    spyOn(audioService, 'play').and.callThrough();
    fixture.detectChanges();

    const playBtn = fixture.debugElement.query(By.css('#play')).nativeElement;
    playBtn.click();

    expect(component.play).toHaveBeenCalled();
    expect(audioService.play).toHaveBeenCalled();
  });

  it('should call the pause method when pause button is clicked', () => {
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(playingStream);
    spyOn(component, 'pause').and.callThrough();
    spyOn(audioService, 'pause').and.callThrough();
    fixture.detectChanges();

    const pauseBtn = fixture.debugElement.query(By.css('#pause')).nativeElement;
    pauseBtn.click();

    expect(component.pause).toHaveBeenCalled();
    expect(audioService.pause).toHaveBeenCalled();
  });

  it('should call the stop method when stop button is clicked', () => {
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(playingStream);
    spyOn(component, 'stop').and.callThrough();
    spyOn(audioService, 'stop').and.callThrough();
    fixture.detectChanges();

    const stopBtn = fixture.debugElement.query(By.css('#stop')).nativeElement;
    stopBtn.click();

    expect(component.stop).toHaveBeenCalled();
    expect(audioService.stop).toHaveBeenCalled();
  });

  it('should call the next method when next button is clicked', () => {
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(playingStream);
    spyOn(component, 'next').and.callThrough();
    spyOn(fileService, 'setNextFile').and.callThrough();
    fixture.detectChanges();

    const nextBtn = fixture.debugElement.query(By.css('#next')).nativeElement;
    nextBtn.click();

    expect(component.next).toHaveBeenCalled();
    expect(fileService.setNextFile).toHaveBeenCalled();
  });

  it('should call the previous method when previous button is clicked', () => {
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(playingStream);
    spyOn(component, 'previous').and.callThrough();
    spyOn(fileService, 'setPreviousFile').and.callThrough();
    fixture.detectChanges();

    const prevBtn = fixture.debugElement.query(By.css('#previous')).nativeElement;
    prevBtn.click();

    expect(component.previous).toHaveBeenCalled();
    expect(fileService.setPreviousFile).toHaveBeenCalled();
  });

  it('should change the repeat track value & CSSstyle when the repeat button is clicked', () => {
    fixture.detectChanges();

    const repeatBtn = fixture.debugElement.query(By.css('#repeat')).nativeElement;
    const repeatIcon = fixture.debugElement.query(By.css('.small-mat-icon')).nativeElement;
    repeatBtn.click();
    fixture.detectChanges();

    expect(component.repeat).toBe(true);
    expect(repeatIcon.style.color).toBe('rgb(255, 64, 129)'); // #FF4081
  });

  it('should call next method when stream is ended & repeat value is false', () => {
    const audioService2 = TestBed.get(AudioService);
    spyOn(audioService2, 'getState').and.returnValue(of({...initStream, ended: true}));
    const fixture2 = TestBed.createComponent(PlayerComponent);
    const component2 = fixture2.componentInstance;
    spyOn(component2, 'next').and.callThrough();
    component2.repeat = false;
    fixture2.detectChanges();

    expect(component2.next).toHaveBeenCalled();
  });

  it('should call initStream method when stream is ended & repeat value is true', () => {
    const audioService2 = TestBed.get(AudioService);
    spyOn(audioService2, 'getState').and.returnValue(of({...initStream, ended: true}));
    const fixture2 = TestBed.createComponent(PlayerComponent);
    const component2 = fixture2.componentInstance;
    spyOn(component2, 'initStream').and.callThrough();
    component2.repeat = true;
    fixture2.detectChanges();

    expect(component2.initStream).toHaveBeenCalled();
  });

  it('should call onSliderChangeEnd method when the mat-slider value is changed', () => {
    spyOn(component, 'onSliderChangeEnd').and.callThrough();
    spyOn(audioService, 'seekTo').and.callThrough();
    component.currentFile$ = of(selectedTrack);
    component.streamState$ = of(playingStream);
    fixture.detectChanges();

    const sliderEl = fixture.debugElement.query(By.css('mat-slider'));
    const e: MatSliderChange = {source: null,  value: 6.408047};
    sliderEl.triggerEventHandler('input', e);

    fixture.detectChanges();

    expect(component.onSliderChangeEnd).toHaveBeenCalledWith(e);
    expect(audioService.seekTo).toHaveBeenCalledWith(e.value);
  });

});
