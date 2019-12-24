import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '@services/index';
import { MotoModel } from '@models/index';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss']
})
export class OperationPage implements OnInit {

  motos: MotoModel[] = [];

  constructor(private dbService: DataBaseService) {}

  ngOnInit() {
    this.dbService.getMotos().subscribe(x => {
      this.motos = x;
    });
  }

}
