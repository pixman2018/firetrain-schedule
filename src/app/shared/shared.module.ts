import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

// components
import { BasisLayoutComponent } from './content/basis-layout/basis-layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { TrainigInWorkoutComponent } from './components/trainig-in-workout/trainig-in-workout.component';
import { TrainingStartAddComponent } from './components/training-start-add/training-start-add.component';
// pipe
import { UcfirstPipe } from './pipes/ucFirst/ucfirst.pipe';
import { ReactiveFormsModule } from '@angular/forms';

const content = [
  BasisLayoutComponent,
];
const component = [
  FooterComponent,
  TrainigInWorkoutComponent,
  TrainingStartAddComponent,
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
    ReactiveFormsModule,
    IonicModule,
  ]
})
export class SharedModule { }
