import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { BasisLayoutComponent } from './content/basis-layout/basis-layout.component';
import { FooterComponent } from './content/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

const component = [
  BasisLayoutComponent,
  FooterComponent,
];

@NgModule({
  declarations: [...component],
  exports: [...component],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
  ]
})
export class SharedModule { }
