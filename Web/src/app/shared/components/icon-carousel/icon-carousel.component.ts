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
  responsiveOptions: any;

  constructor(private utilService: UtilsService,
              private translator: TranslateService) { }

  ngOnInit(): void {
    this.calculateNumVisibleImages();

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
      },
      {
        name: 'Image4',
        url: this.utilService.joinPath([pathImages, this.translator.currentLang, 'Capture4.png']),
        type: 'android',
        app: 'mtm'
      },
      {
        name: 'Image5',
        url: this.utilService.joinPath([pathImages, this.translator.currentLang, 'Capture5.png']),
        type: 'android',
        app: 'mtm'
      },
      {
        name: 'Image6',
        url: this.utilService.joinPath([pathImages, this.translator.currentLang, 'Capture6.png']),
        type: 'android',
        app: 'mtm'
      }
    ];
  }

  calculateNumVisibleImages(): void {
    if (this.dataInfo === Constants.TYPE_APP_ANDROID) {
      this.responsiveOptions = [
        {
            breakpoint: '3000px',
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
            breakpoint: '3000px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    }

  }

}
