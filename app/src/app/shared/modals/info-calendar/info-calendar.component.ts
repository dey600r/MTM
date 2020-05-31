import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

// LIBRARIES
import { CalendarComponentOptions, DayConfig } from 'ion4-calendar';
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  ModalInputModel, ModalOutputModel, InfoCalendarMaintenanceViewModel, InfoCalendarVehicleViewModel,
  MaintenanceModel, MaintenanceFreqModel, VehicleModel, VehicleTypeModel
} from '@models/index';
import { CalendarService, CommonService, DashboardService, ConfigurationService, VehicleService } from '@services/index';
import { ConstantsColumns, WarningWearEnum } from '@app/core/utils';

@Component({
  selector: 'info-calendar',
  templateUrl: 'info-calendar.component.html',
  styleUrls: ['info-calendar.component.scss', '../../../app.component.scss']
})
export class InfoCalendarComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  // DATA
  listInfoCalendar: InfoCalendarVehicleViewModel[] = [];
  listInfoCalendarSelected: InfoCalendarVehicleViewModel[] = [];
  dateMulti: any[];
  type: 'string';
  optionsMulti: CalendarComponentOptions = {};
  formatCalendar = '';
  select = false;
  monthChange = false;
  yearActive = false;
  yearSelect = new Date().getFullYear();
  monthSelect = new Date().getMonth();
  activeSpinner = false;
  hideVehicles: boolean[] = [];

  // TRANSLATE
  notificationEmpty = '';

  constructor(private navParams: NavParams,
              private modalController: ModalController,
              private calendarService: CalendarService,
              private commonService: CommonService,
              private dashboardService: DashboardService,
              private configurationService: ConfigurationService,
              private translator: TranslateService,
              private vehicleService: VehicleService) {
      this.notificationEmpty = this.translator.instant('NotificationEmpty');
      this.formatCalendar = this.calendarService.getFormatCalendar();
  }

  ngOnInit() {
    this.activeSpinner = true;
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    this.initCalendar();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  initCalendar() {
    this.listInfoCalendar = this.calendarService.getInfoCalendar(this.modalInputModel.dataList);
    let days: DayConfig[] = [];
    let dateInit: Date = new Date();
    if (!!this.listInfoCalendar && this.listInfoCalendar.length) {
      dateInit = this.commonService.min(this.modalInputModel.dataList, ConstantsColumns.COLUMN_MODEL_DATE_PURCHASE_VEHICLE);
      this.listInfoCalendar.forEach((x, index) => {
        this.hideVehicles[index] = (index !== 0);
        x.listInfoCalendarMaintenance.forEach(y => {
          y.listInfoCalendarReplacement.forEach(z => {
            if (!days.some(d => d.date === z.date)) {
              days = [...days, {
                date: z.date,
                title: '',
                subTitle: ``,
                cssClass: `day-text-config ${this.calendarService.getCircleColor(this.listInfoCalendar, x, y, z)}`
                }];
            }
          });
        });
      });
    }

    this.optionsMulti = {
        from: new Date(dateInit),
        pickMode: 'single',
        color: 'gray-light',
        weekdays: this.calendarService.getFormatCalendarWeek(),
        weekStart: this.calendarService.getFormatCalendarWeekStart(),
        monthPickerFormat: this.calendarService.getFormatCalendarMonth(),
        showToggleButtons: true,
        showMonthPicker: true,
        daysConfig: days
    };

    const today: Date = new Date();
    this.showNotificationBetweenDates(
      new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0));
  }

  // EVENTS

  onSelect($event: any) {
    this.select = true;
    this.showNotificationBetweenDates(new Date($event.time));
  }

  onMonthChange($event: any) {
    this.monthChange = true;
    this.yearActive = false;
    const dateNew: Date = new Date($event.newMonth.time);
    this.monthSelect = dateNew.getMonth();
    this.yearSelect = dateNew.getFullYear();
    this.showNotificationBetweenDates(dateNew, new Date(dateNew.getFullYear(), this.monthSelect + 1, 0));
  }

  onClick($event: any) {
    if (!!$event) {
      this.activeSpinner = true;
      setTimeout(() => {
        let node: any = $event.target;
        if (node.nodeName === 'SPAN') {
          node = node.parentElement;
        }
        if (node.nodeName === 'BUTTON') {
          node = node.parentElement;
        }
        if (node.nodeName === 'ION-BUTTON') {
          if (!this.select && !this.monthChange) {
            if ($event.target.innerText.includes(this.yearSelect)) {
              this.yearSelect = Number($event.target.innerText.split(' ')[1]);
              this.yearActive = !this.yearActive;
              if (this.yearActive) { // TURN ON YEARS
                this.showNotificationBetweenDates(new Date(this.yearSelect, 0, 1), new Date(this.yearSelect, 11, 31));
              } else { // TURN OFF YEARS
                this.showNotificationBetweenDates(
                  new Date(this.yearSelect, this.monthSelect, 1), new Date(this.yearSelect, this.monthSelect + 1, 0));
              }
            } else if (!!node.classList && node.classList.length > 0) {
              if (node.classList.contains('back')) { // BACK YEAR
                this.yearSelect -= 1;
              } else if (node.classList.contains('forward')) { // FORWARD YEAR
                this.yearSelect += 1;
              }
              this.showNotificationBetweenDates(new Date(this.yearSelect, 0, 1), new Date(this.yearSelect, 11, 31));
            }
          }
        }
        this.select = false;
        this.monthChange = false;
        this.activeSpinner = false;
      }, 150);
    }
  }

  // METHODS

  showNotificationBetweenDates(dateIni: Date, dateFin: Date = null) {
    let rangeDate: Date[] = [dateIni];
    if (dateFin !== null) {
      rangeDate = [...rangeDate, dateFin];
    }
    this.hideVehicles = [];
    this.listInfoCalendarSelected = this.calendarService.getInfoCalendarReplacementDate(this.listInfoCalendar, rangeDate);
    if (!this.listInfoCalendarSelected || this.listInfoCalendarSelected.length === 0) {
      this.notificationEmpty = this.translator.instant('ALERT.NotificationEmptyBetween',
        { dateIni: this.calendarService.getDateString(dateIni),
          dateFin: this.calendarService.getDateString((dateFin === null ? dateIni : dateFin))});
    } else {
      this.listInfoCalendarSelected.forEach((x, index) => this.hideVehicles[index] = (index !== 0));
    }
    this.activeSpinner = false;
  }

  // ICONS

  getIconKms(warning: WarningWearEnum): string {
    return this.dashboardService.getIconKms(warning);
  }

  getClassIcon(warning: WarningWearEnum, styles: string): string {
    return this.dashboardService.getClassIcon(warning, styles);
  }

  getIconMaintenance(maint: InfoCalendarMaintenanceViewModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(maint.codeMaintenanceFreq)));
  }

  getIconVehicle(infoVehicle: InfoCalendarVehicleViewModel): string {
    return this.vehicleService.getIconVehicle(new VehicleModel(null, null, null, null, null,
      new VehicleTypeModel(infoVehicle.typeVehicle)));
  }
}
