import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataBaseService } from '@services/index';
import { MotoModel } from '@models/index';

@Component({
  selector: 'app-moto',
  templateUrl: 'moto.page.html',
  styleUrls: ['moto.page.scss']
})
export class MotoPage implements OnInit, OnChanges {

  motos: MotoModel[] = [];

  constructor(private dbService: DataBaseService) {}

  ngOnInit() {
    this.dbService.getMotos().subscribe(x => {
      this.motos = x;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }
}
