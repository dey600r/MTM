import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// LIBRARIES
import { ICalendarComponentOptions, IDayConfig, ICalendarComponentMonthChange, ICalendarDay } from '@heliomarpm/ion-calendar';
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
  ModalInputModel, InfoCalendarVehicleViewModel,
  InfoCalendarReplacementViewModel, ISettingModel,
  ICalendarColorMode,
  InfoCalendarMaintOpViewModel,
  HeaderInputModel,
  HeaderOutputModel,
  HeaderSegmentInputModel,
  CalendarInputModal
} from '@models/index';

// SERVICES
import {
  CalendarService, CommonService, ControlService, SettingsService, DataService, InfoCalendarService
} from '@services/index';

// UTILS
import { CalendarModeEnum, CalendarTypeEnum, Constants, ConstantsColumns, HeaderOutputEnum, PageEnum, ToastTypeEnum } from '@utils/index';

@Component({
  selector: 'info-calendar',
  templateUrl: 'info-calendar.component.html',
  styleUrls: ['info-calendar.component.scss']
})
export class InfoCalendarComponent implements OnInit {

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<CalendarInputModal> = new ModalInputModel<CalendarInputModal>();
  headerInput: HeaderInputModel = new HeaderInputModel();

  // DATA
  listAllInfoCalendar: InfoCalendarVehicleViewModel[] = [];
  listInfoCalendar: InfoCalendarVehicleViewModel[] = [];
  listInfoCalendarSelected: InfoCalendarVehicleViewModel[] = [];
  dateMulti: any[];
  type: 'string';
  optionsMulti: ICalendarComponentOptions = {};
  formatCalendar = '';
  select = false;
  monthChange = false;
  calendarMode: CalendarModeEnum = CalendarModeEnum.MONTH;
  numOfYearsInModeYears = 7;
  yearSelect = new Date().getFullYear();
  monthSelect = new Date().getMonth();
  activeSpinner = false;
  measure: ISettingModel;
  coin: ISettingModel;
  CALENDAR_TYPE = CalendarTypeEnum;

  // TRANSLATE
  notificationEmpty = '';

  constructor(private readonly modalController: ModalController,
              private readonly calendarService: CalendarService,
              private readonly infoCalendarService: InfoCalendarService,
              private readonly commonService: CommonService,
              private readonly translator: TranslateService,
              private readonly controlService: ControlService,
              private readonly settingsService: SettingsService,
              private readonly dataService: DataService) {
      this.notificationEmpty = this.translator.instant('NotificationEmpty');
      this.formatCalendar = this.calendarService.getFormatCalendar();
  }

  ngOnInit() {
    this.activeSpinner = true;

    // GET SETTINGS
    const settings = this.dataService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
      this.coin = this.settingsService.getMoneySelected(settings);
    }

    this.initCalendar();
  }

  initVehicleCalendar(input: CalendarInputModal) {
    let listVehicles: HeaderSegmentInputModel[] = [];
    if(!!input.wear && input.wear.length > 0) {
      input.wear.forEach(x => {
        if(!listVehicles.some(y => y.id === x.idVehicle)) {
          listVehicles = [...listVehicles, new HeaderSegmentInputModel({
            id: x.idVehicle, name: x.nameVehicle, icon: x.iconVehicle, selected: (x.idVehicle === input.vehicleSelected)
          })];
        }
      });
    }
    if(!!input.operations && input.operations.length > 0) {
      input.operations.forEach(x => {
        if(!listVehicles.some(y => y.id === x.vehicle.id)) {
          listVehicles = [...listVehicles, new HeaderSegmentInputModel({
            id: x.vehicle.id, name: x.vehicle.$getName, icon: x.vehicle.vehicleType.icon, selected: (x.vehicle.id === input.vehicleSelected)
          })];
        }
      });
    }
    this.headerInput = new HeaderInputModel({
      title: 'COMMON.CALENDAR',
      iconButtonLeft: 'reload-circle',
      dataSegment: listVehicles
    });
  }

  loadCalendar(idVehicle: number) {
    this.activeSpinner = true;
    this.listInfoCalendar = this.listAllInfoCalendar.filter(x => x.idVehicle === idVehicle);
    let days: IDayConfig[] = [];
    let dateInit: Date = new Date();
    if (!!this.listInfoCalendar && this.listInfoCalendar.length) {
      dateInit = this.commonService.min(this.modalInputModel.data.wear, ConstantsColumns.COLUMN_MODEL_DATE_PURCHASE_VEHICLE);
      this.listInfoCalendar.forEach(x => {
        x.listInfoCalendarMaintOp.forEach(y => {
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
        color: 'dark',//'gray-light',
        weekdays: this.calendarService.getFormatCalendarWeek(),
        weekStart: this.calendarService.getFormatCalendarWeekStart(),
        monthsTitle: this.calendarService.getFormatCalendarMonth(),
        showToggleButtons: true,
        showMonthPicker: true,
        daysConfig: days
    };

    setTimeout(() => {
      const today: Date = new Date();
      this.applyNotificationsOnCalendar(this.calendarMode, today.getFullYear(), today.getMonth());
    }, 300);
  }

  initCalendar() {
    this.initVehicleCalendar(this.modalInputModel.data);
    this.listAllInfoCalendar = this.infoCalendarService.getInfoCalendar(this.modalInputModel.data.wear, this.modalInputModel.data.operations);
    this.loadCalendar(this.modalInputModel.data.vehicleSelected);
  }

  // EVENTS

  onSelect($event: ICalendarDay) {
    this.select = true;
    this.showNotificationBetweenDates(new Date($event.time));
  }

  onMonthChange($event: ICalendarComponentMonthChange) {
    if(this.calendarMode !== CalendarModeEnum.YEARS) {
      this.monthChange = true;
      this.calendarMode = CalendarModeEnum.MONTH;
      const dateNew: Date = new Date($event.newMonth.time);
      this.monthSelect = dateNew.getMonth();
      this.yearSelect = dateNew.getFullYear();
      this.applyNotificationsFromMemoryOnCalendar(this.calendarMode)
    }
  }

  onClick($event: any) {
    if ($event) {
      this.activeSpinner = true;
      setTimeout(() => { // TIMER TO RELOAD CALENDAR AND APPLY COLOR ON THE CORRECT MONTH/YEAR
        let node: any = $event.target;
        if (node.nodeName === 'SPAN') {
          node = node.parentElement;
        }
        if (node.nodeName === 'BUTTON') { // CLICK ON TABLE CALENDAR - DAYS MONTHS YEAR
          node = node.parentElement;
        }
        if (node.nodeName === 'ION-BUTTON') { // CLICK ON TOP BUTTON - CHANGE MONTH YEAR YEARS
          this.actionButtonCalendar($event, node);
        }
        if (node.nodeName === 'DIV' && this.calendarMode == CalendarModeEnum.YEARS) { // DIV OF CELL YEAR
          this.actionButtonCalendar($event, null);
        }
        this.select = false;
        this.monthChange = false;
        this.activeSpinner = false;
      }, 150);
    }
  }

  getNextCalendarMode(mode: CalendarModeEnum): CalendarModeEnum {
    if(mode == CalendarModeEnum.MONTH)
      return CalendarModeEnum.YEARS;
    else if(mode == CalendarModeEnum.YEARS)
      return CalendarModeEnum.YEAR;
    else
      return CalendarModeEnum.MONTH;
  }

  moveYearInCalendarMode(mode: CalendarModeEnum): number {
    if(mode == CalendarModeEnum.YEAR)
      return 1;
    else if(mode == CalendarModeEnum.YEARS)
      return (this.numOfYearsInModeYears * 2) + 1; // MOVE YEAR IN THE CENTER OF THE CALENDAR ON THE NEXT PAGE
    else
      return 0;
  }

  applyNotificationsFromMemoryOnCalendar(mode: CalendarModeEnum) {
    this.applyNotificationsOnCalendar(mode, this.yearSelect, this.monthSelect)
  }

  applyNotificationsOnCalendar(mode: CalendarModeEnum, year: number, month: number) {
    if (mode == CalendarModeEnum.YEARS) { // TURN ON YEAR
      this.showNotificationBetweenDates(new Date(year - this.numOfYearsInModeYears, 0, 1), new Date(year + this.numOfYearsInModeYears, 11, 31));
    } else if (mode == CalendarModeEnum.YEAR) { // TURN ON YEAR
      this.showNotificationBetweenDates(new Date(year, 0, 1), new Date(year, 11, 31));
    } else if (mode == CalendarModeEnum.MONTH) { // TURN ON MONTH
      this.showNotificationBetweenDates(new Date(year, month, 1), new Date(year, month + 1, 0));
    }
  }

  actionButtonCalendar($event: any, node: any) {
    if (!this.select && !this.monthChange) {
      if ($event.target.innerText.includes(this.yearSelect)) {
        this.yearSelect = Number($event.target.innerText.split(' ')[1]);
        this.calendarMode = this.getNextCalendarMode(this.calendarMode);
        this.applyNotificationsFromMemoryOnCalendar(this.calendarMode);
      } else if (node == null) {
        this.yearSelect = Number($event.target.innerText);
        this.calendarMode = this.getNextCalendarMode(this.calendarMode);
        this.applyNotificationsFromMemoryOnCalendar(this.calendarMode);
      }
      else if (!!node.classList && node.classList.length > 0) {
        if (node.classList.contains('back')) { // BACK YEAR
          this.yearSelect -= this.moveYearInCalendarMode(this.calendarMode);
        } else if (node.classList.contains('forward')) { // FORWARD YEAR
          this.yearSelect += this.moveYearInCalendarMode(this.calendarMode);
        }
        this.applyNotificationsFromMemoryOnCalendar(this.calendarMode);
      } 
    }
  }

  eventEmitHeader(output: HeaderOutputModel) {
    switch(output.type) {
      case HeaderOutputEnum.BUTTON_LEFT:
        this.reload();
        break;
      case HeaderOutputEnum.SEGMENT:
        this.loadCalendar(Number(output.data.detail.value));
        break;
    }
  }

  reload() {
    this.activeSpinner = true;
    this.dateMulti = [];
    setTimeout(() => { // TIMER TO RELOAD CALENDAR AND APPLY COLOR ON THE CORRECT MONTH/YEAR
      const dateNew: Date = new Date();
      this.monthSelect = dateNew.getMonth();
      this.yearSelect = dateNew.getFullYear();
      this.applyNotificationsFromMemoryOnCalendar(this.calendarMode);
      this.activeSpinner = false;
    }, 150);
  }

  // METHODS

  showNotificationBetweenDates(dateIni: Date, dateFin: Date = null) {
    let rangeDate: Date[] = [dateIni];
    if (dateFin !== null) {
      rangeDate = [...rangeDate, dateFin];
    }
    this.listInfoCalendarSelected = this.infoCalendarService.getInfoCalendarReplacementDate(this.listInfoCalendar, rangeDate);
    if (!this.listInfoCalendarSelected || this.listInfoCalendarSelected.length === 0) {
      this.notificationEmpty = this.translator.instant('ALERT.NotificationEmptyBetween',
        { dateIni: this.calendarService.getDateString(dateIni),
          dateFin: this.calendarService.getDateString((dateFin ?? dateIni))});
    }
    this.paintMonthsNotifications(this.listInfoCalendarSelected);
    this.activeSpinner = false;
  }

  getStyleOnCalendarMode(mode: CalendarModeEnum): string {
    return (mode == CalendarModeEnum.YEAR ? 'month' : 'year');
  }

  calculateColor(mode: CalendarModeEnum, notifications: InfoCalendarVehicleViewModel[]): ICalendarColorMode[] {
    let cells: ICalendarColorMode[] = [];
    notifications.forEach(x => {
      x.listInfoCalendarMaintOp.forEach(y => {
        y.listInfoCalendarReplacement.forEach(z => {
          const color: string = this.infoCalendarService.getCircleColor(this.listInfoCalendar, z);
          let iterator = z.date.getMonth();
          if(mode == CalendarModeEnum.YEARS) {
            iterator = (z.date.getFullYear() - this.yearSelect) + this.numOfYearsInModeYears;
          }
          const yearFind: any = cells.find(m => m.iterator === iterator);
          if (!yearFind) {
            cells = [...cells, { iterator: iterator, color: color }];
          } else if (yearFind.color !== color ) {
            yearFind.color = this.infoCalendarService.getCircleColor([], z);
          }
        });
      });
    });
    return cells;
  }

  paintMonthsNotifications(notifications: InfoCalendarVehicleViewModel[]) {
    const typeStyle = this.getStyleOnCalendarMode(this.calendarMode);
    const htmlMonths: NodeListOf<Element> = document.querySelectorAll(`.${typeStyle}-packer-item`);
    if (!!htmlMonths && htmlMonths.length > 0) {
      htmlMonths.forEach(x => {
        x.classList.remove(`${typeStyle}-circle-config-all`);
        x.classList.remove(`${typeStyle}-circle-config-skull`);
        x.classList.remove(`${typeStyle}-circle-config-danger`);
        x.classList.remove(`${typeStyle}-circle-config-warning`);
        x.classList.remove(`${typeStyle}-circle-config-success`);
      });
      if ((this.calendarMode == CalendarModeEnum.YEAR || this.calendarMode == CalendarModeEnum.YEARS) && 
          !!notifications && notifications.length > 0) {
        let cells: ICalendarColorMode[] = this.calculateColor(this.calendarMode, notifications);
        cells.forEach(x => htmlMonths[x.iterator].classList.add(x.color.replace('day', typeStyle)));
      }
    }
  }

  private getInfoMaintenance(repl: InfoCalendarReplacementViewModel): string {
    let msg = '';
    if (repl.time === 0 && repl.km !== 0) {
      msg = this.translator.instant('ALERT.InfoCalendarKm',
        {replacement: repl.nameReplacement, km: repl.km, measure: this.measure.value, date: repl.dateFormat});
    } else {
      msg = this.translator.instant('ALERT.InfoCalendarTime', {replacement: repl.nameReplacement, date: repl.dateFormat});
    }
    return msg;
  }

  showInfo(maintOp: InfoCalendarMaintOpViewModel, repl: InfoCalendarReplacementViewModel) {
    let msg = '';
    if(CalendarTypeEnum.MAINTENANCE == maintOp.type) {
      msg = this.getInfoMaintenance(repl);
    } else {
      msg = maintOp.detailOperation;
    }
    this.controlService.showMsgToast(PageEnum.MODAL_CALENDAR, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }
}
