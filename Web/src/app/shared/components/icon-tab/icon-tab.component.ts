import { Component, Input, OnInit } from '@angular/core';
import { InfoTabModel } from '@models/index';

@Component({
  selector: 'app-icon-tab',
  templateUrl: './icon-tab.component.html',
  styleUrls: ['./icon-tab.component.scss']
})
export class IconTabComponent implements OnInit {

  @Input() dataInfo: InfoTabModel[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
