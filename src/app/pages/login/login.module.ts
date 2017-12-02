import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { DomainModule } from '../../domain/DomainModule.module';

import { LoginComponent } from './login.component';
import { routing }       from './login.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    DomainModule,
    routing,
  ],
  declarations: [
    LoginComponent,
  ],
  providers: [
  ],
})
export class LoginModule {}
