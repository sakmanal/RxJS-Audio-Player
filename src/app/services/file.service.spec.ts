import { CurrentFile } from '../interfaces/currentFile';
import { Track } from '../interfaces/track-data';
import { FileService } from './file.service';

const mockfiles: Track[] = [
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

const currentFile = (index: number): CurrentFile => {
  return {
    index,
    file: mockfiles[index]
  };
};

describe('FileService', () => {
  it('should set & return the track files', () => {
    const service = new FileService();
    service.setfiles(mockfiles);

    expect(service.files).toBe(mockfiles);
    service.getfiles().subscribe(
      files => expect(files).toBe(mockfiles)
    );
  });

  it('should set & return the correct currentfile', () => {
    const mockCurrentFile = currentFile(1);
    const service = new FileService();
    service.setCurrentFile(mockCurrentFile);

    expect(service.currentFile).toBe(mockCurrentFile);
    expect(service.currentFileSource).toBe(mockCurrentFile.file.url);
    service.getCurrentFile().subscribe(
      cf => expect(cf).toBe(mockCurrentFile)
    );
  });

  it('should return true if the currentfile is the first file in playlist', () => {
    const service = new FileService();
    let mockCurrentFile: CurrentFile;

    mockCurrentFile = currentFile(1);
    service.setCurrentFile(mockCurrentFile);
    expect(service.isFirstFile).toBe(false);

    mockCurrentFile = currentFile(0);
    service.setCurrentFile(mockCurrentFile);
    expect(service.isFirstFile).toBe(true);
  });

  it('should return true if the currentfile is the last file in playlist', () => {
    const service = new FileService();
    service.setfiles(mockfiles);
    let mockCurrentFile: CurrentFile;

    mockCurrentFile = currentFile(1);
    service.setCurrentFile(mockCurrentFile);
    expect(service.isLastFile).toBe(false);

    mockCurrentFile = currentFile(mockfiles.length - 1);
    service.setCurrentFile(mockCurrentFile);
    expect(service.isLastFile).toBe(true);
  });

  it('should set the correct next file in playlist', () => {
    const service = new FileService();
    service.setfiles(mockfiles);
    let mockCurrentFile: CurrentFile;
    let index: number;

    index = 1;
    mockCurrentFile = currentFile(index);
    service.setCurrentFile(mockCurrentFile);
    service.setNextFile();
    expect(service.currentFile.index).toBe(index + 1);

    index = mockfiles.length - 1;
    mockCurrentFile = currentFile(index);
    service.setCurrentFile(mockCurrentFile);
    service.setNextFile();
    expect(service.currentFile.index).toBe(0);
  });

  it('should set the correct previous file in playlist', () => {
    const service = new FileService();
    service.setfiles(mockfiles);
    let mockCurrentFile: CurrentFile;
    let index: number;

    index = 1;
    mockCurrentFile = currentFile(index);
    service.setCurrentFile(mockCurrentFile);
    service.setPreviousFile();
    expect(service.currentFile.index).toBe(index - 1);

    index = 0;
    mockCurrentFile = currentFile(index);
    service.setCurrentFile(mockCurrentFile);
    service.setPreviousFile();
    expect(service.currentFile.index).toBe(0);
  });

});
