import { Component, isDevMode, enableProdMode } from '@angular/core';
import { DateService } from './shared/services/date/date.service';

import { FormBuilder, FormGroup } from '@angular/forms';

import { CustomValidator} from './shared/validators/custom-validator.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  protected myForm: FormGroup = this._createTestForm();
  protected showCalendar: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _dateService: DateService,
  ) {
    // console.log('isDevMode', isDevMode());
    // const diff = 1724935595445 - 1724935267633;
    // console.log('dif',
    //   this._dateService.getTimeFromTstamp(diff)
    // );


  }

  onSubmit() {
    console.log('valid', this.myForm.valid)
    console.log(this.myForm.get('test')?.errors)
  }

  onSelectDatepicker(event: any) {
    console.log('event', event.detail.value)
  }

  openCalendar() {
    this.showCalendar = true;
  }
  cancelCalendar() {
    this.showCalendar = false;
  }

  private _createTestForm(): FormGroup {
    return this._fb.group({
      test: ['', CustomValidator.isNumberBetween(1,2)]
    })
  }
}

