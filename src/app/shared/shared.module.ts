import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';

const imports: any = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
];

const components = [HeaderComponent];

@NgModule({
  declarations: [...components],
  imports: [...imports],
  exports: [...imports, ...components]
})
export class SharedModule {}
