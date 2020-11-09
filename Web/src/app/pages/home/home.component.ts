import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  slides = [];
  icon = '';

  constructor(private translator: TranslateService,
              private utilService: UtilsService
    ) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
    this.translator.use(userLang);
  }

  ngOnInit(): void {
    this.icon = this.utilService.joinPath([environment.pathIcons, 'icon.png']);
    this.slides = [
      this.utilService.joinPath([environment.pathImagesAndroid, this.translator.currentLang, 'image1.png']),
      this.utilService.joinPath([environment.pathImagesAndroid, this.translator.currentLang, 'image1.png']),
      this.utilService.joinPath([environment.pathImagesAndroid, this.translator.currentLang, 'image1.png'])
    ];
  }

}
