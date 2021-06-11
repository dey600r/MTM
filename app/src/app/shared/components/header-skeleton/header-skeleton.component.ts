import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-skeleton',
  templateUrl: './header-skeleton.component.html',
  styleUrls: ['./header-skeleton.component.scss'],
})
export class HeaderSkeletonComponent {

  @Input() input: number[] = [];

}
