import { NgModule, ModuleWithProviders }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule }  from '@angular/common';
import { NgbCollapseModule, NgbModalModule, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgaModule } from '../../theme/nga.module';

import { AuthTreeComponent } from "./authtree/authTree.component";
import { NormalTreeComponent } from "./tree/NormalTree.component";

import { AuthReflectService } from "./service/authReflect.service";
import { AuthTreeService } from "./service/authTree.service";

@NgModule({
  imports: [
      CommonModule, 
      NgaModule,
      FormsModule,
      NgbCollapseModule.forRoot(),
      NgbModalModule.forRoot(),
  ],
  declarations: [
    AuthTreeComponent,
    NormalTreeComponent
  ],
  providers:[
    AuthReflectService,
    AuthTreeService
  ],
  exports: [
    AuthTreeComponent,
    NormalTreeComponent
  ],
})
export class TreeModule {
    static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: TreeModule,
    };
  }
}
