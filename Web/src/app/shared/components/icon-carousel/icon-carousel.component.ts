import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '@services/utils.service';

import { environment } from '@environments/environment';
import { PictureModel } from '@models/index';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '@utils/constants';

@Component({
  selector: 'app-icon-carousel',
  templateUrl: './icon-carousel.component.html',
  styleUrls: ['./icon-carousel.component.scss']
})
export class IconCarouselComponent implements OnInit {

  @Input() dataInfo = Constants.TYPE_APP_ANDROID;

  picturesApp: PictureModel[] = [];

  constructor(private utilService: UtilsService,
              private translator: TranslateService) { }

  ngOnInit(): void {
    const pathImages: string = this.utilService.getPathImages(this.dataInfo);
    this.picturesApp = [
      {
        name: 'Image1',
        url: this.utilService.joinPath([pathImages, this.translator.currentLang, 'Capture1.png']),
        type: 'android',
        app: 'mtm'
      },
      {
        name: 'Image2',
        url: this.utilService.joinPath([pathImages, this.translator.currentLang, 'Capture2.png']),
        type: 'android',
        app: 'mtm'
      },
      {
        name: 'Image3',
        url: this.utilService.joinPath([pathImages, this.translator.currentLang, 'Capture3.png']),
        type: 'android',
        app: 'mtm'
      }
    ];
  }

}
