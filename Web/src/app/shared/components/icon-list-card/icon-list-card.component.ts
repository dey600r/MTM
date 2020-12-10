import { Component, Input, OnInit } from '@angular/core';
import { InfoCardModel } from '@app/core/models/info-card.model';

@Component({
  selector: 'app-icon-list-card',
  templateUrl: './icon-list-card.component.html',
  styleUrls: ['./icon-list-card.component.scss']
})
export class IconListCardComponent implements OnInit {

  @Input() dataInfo: InfoCardModel[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
