import { Injectable } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private _confirmResult$ = new BehaviorSubject<boolean>(false);

  private _alertBtns = [
    {
      text: 'Abbrechen',
      role: 'cancel',
      handler: () => {
        // console.log('Alert canceled');
        this._confirmResult$.next(false);
      },
    },
    {
      text: 'Ok',
      role: 'confirm',
      handler: () => {
        // console.log('Alert confirmed');
        this._confirmResult$.next(true);
      },
    },
  ];

  constructor(
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController
  ) {}

  public async showAlert(
    header: string,
    message: string,
    type: 'danger' | 'success' | 'warning' = 'success',
  ) {
    const alert = await this._alertCtrl.create({
      header,
      message: new IonicSafeString(message),
      cssClass: 'alert alert-' + type,
      buttons: ['OK'],
    });

    alert.present();
  }

  public async showToast(
    message: string,
    position: 'top' | 'middle' | 'bottom' = 'middle',
    type: 'danger' | 'success' | 'warning' = 'success',
  ): Promise<any> {
    const toast = await this._toastCtrl.create({
      message: new IonicSafeString(message),
      cssClass: 'toast toast-' + type,
      color: type,
      duration: 2000,
      position: position,
    });
    await toast.present();
  }

  public async showConfirm(
    header: string,
    message: string,
    type: 'danger' | 'success' | 'warning' = 'success',
  ) {
    const alert = await this._alertCtrl.create({
      header,
      message: new IonicSafeString(message),
      cssClass: 'alert alert-' + type,
      buttons: this._alertBtns,
    });
    await alert.present();
  }

  public getConfirmResult(): Observable<boolean> {
    return this._confirmResult$.asObservable();
  }
}
