import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.page.html',
  styleUrls: ['./workout-list.page.scss'],
})
export class WorkoutListPage implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit() {}

  /**
   *
   * redirects to the Componete workout form to insert a new workout in the database
   *
   */
  protected onGoToAdd(): void {
    this._router.navigateByUrl('/workout-form', { replaceUrl: true });
  }
}
