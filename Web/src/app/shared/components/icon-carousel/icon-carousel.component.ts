import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '@services/utils.service';

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
  responsiveOptions: any = [];

  constructor(private utilService: UtilsService,
              private translator: TranslateService) {
  }

  ngOnInit(): void {

    const pathImages: string = this.utilService.getPathImages(this.dataInfo);
    this.picturesApp = [];
    for (let i = 1; i < 11; i++) {
      this.picturesApp = [...this.picturesApp, {
        name: `Image${i}`,
        url: this.utilService.joinPath([pathImages, this.translator.currentLang, `Capture${i}.png`]),
        type: this.dataInfo,
        app: 'mtm'
      }];
    }

    this.calculateNumVisibleImages();
  }

  calculateNumVisibleImages(): void {
    if (this.dataInfo === Constants.TYPE_APP_ANDROID) {
      this.responsiveOptions = [
        {
            breakpoint: '4000px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '840px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    } else {
      this.responsiveOptions = [
        {
            breakpoint: '4000px',
            numVisible: 1,
            numScroll: 1
        }
      ];
    }
  }

}
