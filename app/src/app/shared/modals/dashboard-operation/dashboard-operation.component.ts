import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DataBaseService, DashboardService } from '@services/index';
import { DashboardModel, OperationModel, ModalInputModel, ModalOutputModel } from '@models/index';

@Component({
  selector: 'dashboard-operation',
  templateUrl: 'dashboard-operation.component.html',
  styleUrls: ['dashboard-operation.component.scss', '../../../app.component.scss']
})
export class DashboardOperationComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();
    modalOutputModel: ModalOutputModel = new ModalOutputModel();

    // MODEL FORM
    dashboardOpTypeExpenses: DashboardModel = new DashboardModel([], []);
    dashboardMotoExpenses: DashboardModel = new DashboardModel([], []);

    // DATA
    operations: OperationModel[] = [];
    motoModel = '';

    // SUBSCRIPTION
    screenSubscription: Subscription = new Subscription();

    constructor(private platform: Platform,
                private dbService: DataBaseService,
                private navParams: NavParams,
                private screenOrientation: ScreenOrientation,
                private changeDetector: ChangeDetectorRef,
                private dashboardService: DashboardService,
                private modalController: ModalController) {
  }

    ngOnInit() {
        this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
            this.navParams.data.data, this.navParams.data.dataList);

        this.operations = this.modalInputModel.dataList;
        this.motoModel = (!!this.operations && this.operations.length > 0 ?
            `${this.operations[0].moto.brand} ${this.operations[0].moto.model}` : '');
        const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoPerTime(windowsSize, this.operations);
        this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, this.operations);

        this.screenOrientation.onChange().subscribe(() => {
            const windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
            this.dashboardMotoExpenses.view = windowSize;
            this.dashboardOpTypeExpenses.view = windowSize;
            this.changeDetector.detectChanges();
            }
        );
    }

  ngOnDestroy() {
    this.screenSubscription.unsubscribe();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }
}
