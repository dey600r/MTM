import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DataBaseService, CommonService } from '@services/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss']
})
export class HomePage implements OnInit, OnChanges {

  view: any[] = [this.platform.width(), this.platform.height()];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  legendTitle = 'Years';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  private multi = [
    {
      name: 'Germany',
      series: [
        {
          name: '2010',
          value: 7300000
        },
        {
          name: '2011',
          value: 8940000
        }
      ]
    },

    {
      name: 'USA',
      series: [
        {
          name: '2010',
          value: 7870000
        },
        {
          name: '2011',
          value: 8270000
        }
      ]
    },

    {
      name: 'France',
      series: [
        {
          name: '2010',
          value: 5000002
        },
        {
          name: '2011',
          value: 5800000
        }
      ]
    }
  ];

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private commonService: CommonService,
              private screenOrientation: ScreenOrientation,
              private changeDetector: ChangeDetectorRef) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });

    this.screenOrientation.onChange().subscribe(
      () => {
        this.view = [this.platform.height(), this.platform.width()];
        this.changeDetector.detectChanges();
      }
   );
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
