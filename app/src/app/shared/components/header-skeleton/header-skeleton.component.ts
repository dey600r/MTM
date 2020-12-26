import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-skeleton',
  templateUrl: './header-skeleton.component.html',
  styleUrls: ['./header-skeleton.component.scss'],
})
export class HeaderSkeletonComponent implements OnInit {

  @Input() input: number[] = [];

  constructor() { }

  ngOnInit() {}

}
