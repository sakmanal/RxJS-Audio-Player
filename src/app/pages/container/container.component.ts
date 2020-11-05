import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { CloudService } from '../../services/cloud.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  constructor(private fileService: FileService, private cloudService: CloudService) { }

  ngOnInit() {
     this.cloudService.getFiles().subscribe(
       files => this.fileService.setfiles(files)
     );
  }

}
