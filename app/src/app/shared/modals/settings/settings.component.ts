import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// UTILS
import {
  ModalInputModel, ModalOutputModel
} from '@models/index';
import { Constants } from '@utils/index';
import { SettingsService, DataBaseService } from '@services/index';

@Component({
  selector: 'settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['../../../app.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();
    modalOutputModel: ModalOutputModel = new ModalOutputModel();

    // MODEL FORM

    // DATA
    listDistances: any[] = [];
    distanceSelected: any = {};
    listMoney: any[] = [];
    moneySelected: any = {};

    // SUBSCRIPTION
    settingsSubscription: Subscription = new Subscription();

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private dbService: DataBaseService,
                private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    this.listDistances = this.settingsService.getListDistance();
    this.listMoney = this.settingsService.getListMoney();

    this.settingsSubscription = this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.distanceSelected = this.settingsService.getDistanceSelected(settings);
        this.moneySelected = this.settingsService.getMoneySelected(settings);
      }
    });
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  // EVENTS

  changeDistance() {
    this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_DISTANCE, this.distanceSelected.code);
  }

  changeMoney() {
    this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_MONEY, this.moneySelected.code);
  }
}
