import { Component, isDevMode, enableProdMode } from '@angular/core';
import { DateService } from './shared/services/date/date.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private _dateService: DateService,
  ) {
    console.log('isDevMode', isDevMode());
    const diff = 1724935595445 - 1724935267633;
    console.log('dif',
      this._dateService.getTimeFromTstamp(diff)
    );
  }
}

