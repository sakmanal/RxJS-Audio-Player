import { CloudService } from './cloud.service';

describe('CloudService', () => {

  it('should return the audio data', () => {
    const cloudService = new CloudService();
    cloudService.getFiles().subscribe(
      files => expect(files.length).toEqual(cloudService.files.length)
    );
  });
});
