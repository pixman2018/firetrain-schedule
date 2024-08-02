import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

// components
import { BasisLayoutComponent } from './content/basis-layout/basis-layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { TrainigInWorkoutComponent } from './components/trainig-in-workout/trainig-in-workout.component';
import { UcfirstPipe } from './pipes/ucFirst/ucfirst.pipe';

const content = [
  BasisLayoutComponent,
];
const component = [
  FooterComponent,
  TrainigInWorkoutComponent,
];

const pipes = [
  UcfirstPipe,
];

@NgModule({
  declarations: [...component, ...content, ...pipes],
  exports: [...component, ...content, ...pipes],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
  ]
})
export class SharedModule { }
