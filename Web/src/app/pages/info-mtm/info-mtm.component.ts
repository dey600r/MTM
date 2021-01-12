import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@app/core/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment';
import { InfoDeveloperModel, InfoIconModel, InfoTabModel, InfoProjectCardModel } from '@models/index';
import { Constants } from '@utils/constants';
import { InfoCardModel } from '@app/core/models/info-card.model';

@Component({
  selector: 'app-info-mtm',
  templateUrl: './info-mtm.component.html',
  styleUrls: ['./info-mtm.component.scss']
})
export class InfoMtmComponent implements OnInit {

  icon = '';

  infoListCard: InfoProjectCardModel = new InfoProjectCardModel();
  infoImageMtM: InfoTabModel[] = [];
  infoMtM: InfoDeveloperModel = new InfoDeveloperModel();

  imgGooglePlay = '';
  imgMicrosoftStore = '';
  hrefGooglePlay = '';
  hrefMicrosoftStore = '';

  constructor(private translator: TranslateService,
              private utilService: UtilsService) {
  }

  ngOnInit(): void {
    const assetsIcon: string = environment.pathIcons;
    this.icon = this.utilService.joinPath([assetsIcon, 'icon.png']);

    this.infoListCard = new InfoProjectCardModel('COMMON.MTM_LARGE', 'HOME.descriptionLargeProjects', [
      new InfoCardModel('INFO_MTM.titleExpensesVehicles', 'INFO_MTM.descriptionExpensesVehicles',
        this.utilService.joinPath([environment.pathOthers, this.translator.currentLang, 'info-mtm-expenses-vehicles.png'])),
      new InfoCardModel('INFO_MTM.titleCalendar', 'INFO_MTM.descriptionCalendar',
        this.utilService.joinPath([environment.pathOthers, this.translator.currentLang, 'info-mtm-calendar.png'])),
      new InfoCardModel('INFO_MTM.titleExpensesReplacement', 'INFO_MTM.descriptionExpensesReplacement',
        this.utilService.joinPath([environment.pathOthers, this.translator.currentLang, 'info-mtm-expenses-replacements.png'])),
      new InfoCardModel('INFO_MTM.titleNotifications', 'INFO_MTM.descriptionNotifications',
        this.utilService.joinPath([environment.pathOthers, this.translator.currentLang, 'info-mtm-notification.png']))
    ]);

    this.infoImageMtM = [
      new InfoTabModel('Android', Constants.TYPE_APP_ANDROID, 'pi pi-android'),
      new InfoTabModel('Windows 10', Constants.TYPE_APP_WINDOWS, 'pi pi-microsoft')
    ];

    this.infoMtM = new InfoDeveloperModel(
      'INFO_MTM.titleTechnologiesUsed', 'INFO_MTM.descriptionTechnologiesUsed',
      [
        new InfoIconModel(`${assetsIcon}/icon-ionic.png`, 'Ionic', 'Ionic', Constants.URL_IONIC),
        new InfoIconModel(`${assetsIcon}/icon-angular.png`, 'Angular', 'Angular', Constants.URL_ANGULAR),
        new InfoIconModel(`${assetsIcon}/icon-cordova.png`, 'Cordova', 'Cordova', Constants.ICON_URL_EGG),
        new InfoIconModel(`${assetsIcon}/icon-sqlite.png`, 'Sqlite', 'Sqlite', Constants.ICON_URL_KLIPARTZ)
      ]);

    this.imgGooglePlay = this.utilService.joinPath([environment.pathOthers, this.translator.currentLang, 'google_play.png']);
    this.imgMicrosoftStore = this.utilService.joinPath([environment.pathOthers, this.translator.currentLang, 'microsoft_store.png']);

    if (this.translator.currentLang === Constants.LANGUAGE_EN) {
      this.hrefGooglePlay = Constants.URL_MTM_ANDROID_EN;
      this.hrefMicrosoftStore = Constants.URL_MTM_WINDOWS_EN;
    } else {
      this.hrefGooglePlay = Constants.URL_MTM_ANDROID_ES;
      this.hrefMicrosoftStore = Constants.URL_MTM_WINDOWS_ES;
    }
  }

}
