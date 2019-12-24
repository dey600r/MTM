import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '@services/index';
import { MotoModel } from '@models/index';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  motos: MotoModel[] = [];

  constructor(private dbService: DataBaseService) {}

  ngOnInit() {
    this.dbService.getMotos().subscribe(x => {
      this.motos = x;
    });
  }

}
