import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { DynamicFormsCoreModule } from "../../core";
import { NgbDatepickerModule, NgbButtonsModule, NgbTimepickerModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { TextMaskModule } from "angular2-text-mask";
import { DynamicFormNGBootstrapComponent } from "./dynamic-form-ng-bootstrap.component";
import { NgbTagTypeaheadComponent } from './ngb-tag-typeahead.component';
import { NgbFileUploadComponent } from './ngb-file-upload/ngb-file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbTypeaheadModule,
    TextMaskModule,
    DynamicFormsCoreModule,
    FileUploadModule
  ],
  declarations: [
    NgbTagTypeaheadComponent,
    NgbFileUploadComponent,
    DynamicFormNGBootstrapComponent,
  ],
  exports: [
    DynamicFormsCoreModule,
    DynamicFormNGBootstrapComponent,
  ],
})

export class DynamicFormsNGBootstrapUIModule {
}
