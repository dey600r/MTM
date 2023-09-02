import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

// LIBRARIES
import { CalendarComponentOptions, DayConfig } from 'ion5-calendar';
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
  ModalInputModel, InfoCalendarVehicleViewModel,
  InfoCalendarReplacementViewModel, ISettingModel,
  WearVehicleProgressBarViewModel
} from '@models/index';

// SERVICES
import {
  CalendarService, CommonService, ControlService, SettingsService, DataService, InfoCalendarService
} from '@services/index';

// UTILS
import { Constants, ConstantsColumns, PageEnum, ToastTypeEnum } from '@utils/index';

@Component({
  selector: 'info-calendar',
  templateUrl: 'info-calendar.component.html',
  styleUrls: ['info-calendar.component.scss']
})
export class InfoCalendarComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel<any, WearVehicleProgressBarViewModel> = new ModalInputModel<any, WearVehicleProgressBarViewModel>();

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
  measure: ISettingModel;
  coin: ISettingModel;

  // TRANSLATE
  notificationEmpty = '';

  constructor(public navParams: NavParams,
              private modalController: ModalController,
              private calendarService: CalendarService,
              private infoCalendarService: InfoCalendarService,
              private commonService: CommonService,
              private translator: TranslateService,
              private controlService: ControlService,
              private settingsService: SettingsService,
              private dataService: DataService) {
      this.notificationEmpty = this.translator.instant('NotificationEmpty');
      this.formatCalendar = this.calendarService.getFormatCalendar();
  }

  ngOnInit() {
    this.activeSpinner = true;
    this.modalInputModel = new ModalInputModel<any, WearVehicleProgressBarViewModel>(this.navParams.data);

    // GET SETTINGS
    const settings = this.dataService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
      this.coin = this.settingsService.getMoneySelected(settings);
    }

    this.initCalendar();

    this.controlService.isAppFree(this.modalController);
  }

  initCalendar() {
    this.listInfoCalendar = this.infoCalendarService.getInfoCalendar(this.modalInputModel.dataList);
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
                cssClass: `day-text-config ${this.infoCalendarService.getCircleColor(this.listInfoCalendar, z)}`
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
          this.actionButtonCalendar($event, node);
        }
        this.select = false;
        this.monthChange = false;
        this.activeSpinner = false;
      }, 150);
    }
  }

  actionButtonCalendar($event: any, node: any) {
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

  reload() {
    this.activeSpinner = true;
    this.dateMulti = [];
    const dateNew: Date = new Date();
    this.monthSelect = dateNew.getMonth();
    this.yearSelect = dateNew.getFullYear();
    if (this.yearActive) {
      this.showNotificationBetweenDates(new Date(this.yearSelect, 0, 1), new Date(this.yearSelect, 11, 31));
    } else {
      this.showNotificationBetweenDates(
        new Date(this.yearSelect, this.monthSelect, 1), new Date(this.yearSelect, this.monthSelect + 1, 0));
    }
    this.activeSpinner = false;
  }

  // METHODS

  showNotificationBetweenDates(dateIni: Date, dateFin: Date = null) {
    let rangeDate: Date[] = [dateIni];
    if (dateFin !== null) {
      rangeDate = [...rangeDate, dateFin];
    }
    this.hideVehicles = [];
    this.listInfoCalendarSelected = this.infoCalendarService.getInfoCalendarReplacementDate(this.listInfoCalendar, rangeDate);
    if (!this.listInfoCalendarSelected || this.listInfoCalendarSelected.length === 0) {
      this.notificationEmpty = this.translator.instant('ALERT.NotificationEmptyBetween',
        { dateIni: this.calendarService.getDateString(dateIni),
          dateFin: this.calendarService.getDateString((dateFin === null ? dateIni : dateFin))});
    } else {
      this.listInfoCalendarSelected.forEach((x, index) => this.hideVehicles[index] = (index !== 0));
    }
    this.paintMonthsNotifications(this.listInfoCalendarSelected);
    this.activeSpinner = false;
  }

  paintMonthsNotifications(notifications: InfoCalendarVehicleViewModel[]) {
    const htmlMonths: NodeListOf<Element> = document.querySelectorAll('.month-packer-item');
    if (!!htmlMonths && htmlMonths.length > 0) {
      htmlMonths.forEach(x => {
        x.classList.remove('month-circle-config-all');
        x.classList.remove('month-circle-config-skull');
        x.classList.remove('month-circle-config-danger');
        x.classList.remove('month-circle-config-warning');
        x.classList.remove('month-circle-config-success');
      });
      if (this.yearActive && !!notifications && notifications.length > 0) {
        let monthsUsed: any[] = [];
        notifications.forEach(x => {
          x.listInfoCalendarMaintenance.forEach(y => {
            y.listInfoCalendarReplacement.forEach(z => {
              const colorMonth: string = this.infoCalendarService.getCircleColor(this.listInfoCalendar, z);
              const monthFind: any = monthsUsed.find(m => m.month === z.date.getMonth());
              if (!monthFind) {
                monthsUsed = [...monthsUsed, { month: z.date.getMonth(), color: colorMonth }];
              } else if (monthFind.color !== colorMonth ) {
                monthFind.color = this.infoCalendarService.getCircleColor([], z);
              }
            });
          });
        });
        monthsUsed.forEach(x => htmlMonths[x.month].classList.add(x.color.replace('day', 'month')));
      }
    }
  }

  showInfo(repl: InfoCalendarReplacementViewModel) {
    let msg = '';
    if (repl.time === 0 && repl.km !== 0) {
      msg = this.translator.instant('ALERT.InfoCalendarKm',
        {replacement: repl.nameReplacement, km: repl.km, measure: this.measure.value, date: repl.dateFormat});
    } else {
      msg = this.translator.instant('ALERT.InfoCalendarTime', {replacement: repl.nameReplacement, date: repl.dateFormat});
    }
    this.controlService.showMsgToast(PageEnum.MODAL_CALENDAR, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }
}
