import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-basis-layout',
  templateUrl: './basis-layout.component.html',
  styleUrls: ['./basis-layout.component.scss'],
})
export class BasisLayoutComponent implements OnInit {
  @Input() headline!: string;

  protected translucent: boolean = true;

  constructor(
    private readonly _platform: Platform,
    private readonly _router: Router
  ) {}

  ngOnInit() {
    this._initComponent();
  }

  private _initComponent(): void {
    this._platform.is('ios') ? this.translucent = false :   this.translucent = true;
  }
}
