import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@app/core/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment';
import { InfoDeveloperModel, InfoIconModel } from '@models/index';
import { Constants } from '@utils/constants';

@Component({
  selector: 'app-info-mtm',
  templateUrl: './info-mtm.component.html',
  styleUrls: ['./info-mtm.component.scss']
})
export class InfoMtmComponent implements OnInit {

  icon = '';

  infoMtM: InfoDeveloperModel = new InfoDeveloperModel();

  constructor(private translator: TranslateService,
              private utilService: UtilsService) {
  }

  ngOnInit(): void {
    const assetsIcon: string = environment.pathIcons;
    this.icon = this.utilService.joinPath([assetsIcon, 'icon.png']);

    this.infoMtM = new InfoDeveloperModel(
      'HOME.titleTechnologicalSkills', 'HOME.descriptionTechnologicalSkills',
      [
        new InfoIconModel(`${assetsIcon}/icon-ionic.png`, 'Ionic', 'Ionic', Constants.URL_IONIC),
        new InfoIconModel(`${assetsIcon}/icon-angular.png`, 'Angular', 'Angular', Constants.URL_ANGULAR),
        new InfoIconModel(`${assetsIcon}/icon-cordova.png`, 'Cordova', 'Cordova', Constants.ICON_URL_EGG),
        new InfoIconModel(`${assetsIcon}/icon-sqlite.png`, 'Sqlite', 'Sqlite', Constants.ICON_URL_KLIPARTZ)
      ]);
  }

}
