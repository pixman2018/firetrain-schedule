import { Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor(private _router: Router,) { }

  ngOnInit() {}

  // /**
  //  *
  //  * fo to the transferred page
  //  *
  //  */
  // protected onGotTO(page: UrlTree | string): void {
  //   this._router.navigateByUrl('/page');
  // }

}
