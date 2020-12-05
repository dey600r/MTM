import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { InfoDeveloperModel, InfoProjectModel, InfoIconModel } from '@models/index';

@Component({
  selector: 'app-icon-project',
  templateUrl: './icon-project.component.html',
  styleUrls: ['./icon-project.component.scss']
})
export class IconProjectComponent implements OnInit {

  @Input() dataInfo: InfoProjectModel = new InfoProjectModel(
    '', new InfoDeveloperModel('', '', [new InfoIconModel()]));

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
 }
}
