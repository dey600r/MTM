import { Component, OnInit } from '@angular/core';
import { Constants } from '@utils/constants';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { InfoDeveloperModel, InfoIconModel } from '@app/core/models';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  infoDeveloper: InfoDeveloperModel = new InfoDeveloperModel();
  infoProjects: InfoDeveloperModel = new InfoDeveloperModel();
  infoSkills: InfoDeveloperModel = new InfoDeveloperModel();
  infoHobbies: InfoDeveloperModel = new InfoDeveloperModel();

  constructor(private translator: TranslateService,
              private router: Router) {
  }

  ngOnInit(): void {
    const assetsIcon: string = environment.pathIcons;
    this.infoDeveloper = new InfoDeveloperModel('HOME.titleInfoDeveloper', 'HOME.descriptionInfoDeveloper');
    this.infoProjects = new InfoDeveloperModel(
      'HOME.titleProjects', 'HOME.descriptionProjects',
      [new InfoIconModel(`${assetsIcon}/icon.png`, this.translator.instant('HOME.MTM_LARGE'), 'MtM', Constants.ROUTE_INFO_MTM)]);
    this.infoSkills = new InfoDeveloperModel(
      'HOME.titleTechnologicalSkills', 'HOME.descriptionTechnologicalSkills',
      [
        new InfoIconModel(`${assetsIcon}/icon-angular.png`, 'Angular', 'Angular', Constants.URL_ANGULAR),
        new InfoIconModel(`${assetsIcon}/icon-net.png`, 'NetCore', 'NetCore', Constants.URL_NET_CORE),
        new InfoIconModel(`${assetsIcon}/icon-ionic.png`, 'Ionic', 'Ionic', Constants.URL_IONIC),
        new InfoIconModel(`${assetsIcon}/icon-sql.svg`,
          this.translator.instant('COMMON.iconDesignedBy', {url: 'Freepik ' + Constants.ICON_URL_FREE}), 'SQL',
          Constants.ICON_URL_FREEPIK)
      ]);
    this.infoHobbies = new InfoDeveloperModel(
      'HOME.titleHobbies', 'HOME.descriptionHobbies',
      [
        new InfoIconModel(`${assetsIcon}/icon-moto.png`, '', 'Moto'),
        new InfoIconModel(`${assetsIcon}/icon-android.png`, 'Android', 'Android', Constants.URL_ANDROID),
        new InfoIconModel(`${assetsIcon}/icon-game.svg`,
          this.translator.instant('COMMON.iconDesignedBy', {url: 'Freepik ' + Constants.ICON_URL_FREE}), 'Game',
          Constants.ICON_URL_FREEPIK),
        new InfoIconModel(`${assetsIcon}/icon-skate.svg`,
          this.translator.instant('COMMON.iconDesignedBy', {url: 'Freepik ' + Constants.ICON_URL_FREE}), 'Skate',
          Constants.ICON_URL_FREEPIK)
      ]);
  }

  navigateToMtm(): void {
     this.router.navigateByUrl('infomtm');
  }
}
