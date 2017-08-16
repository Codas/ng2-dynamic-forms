import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { DynamicFormsCoreModule } from "../../core";
import { NgbDatepickerModule, NgbButtonsModule, NgbTimepickerModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { TextMaskModule } from "angular2-text-mask";
import { DynamicFormNGBootstrapComponent } from "./dynamic-form-ng-bootstrap.component";
import { NgbTagTypeaheadComponent } from './ngb-tag-typeahead.component';

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
  ],
  declarations: [
    NgbTagTypeaheadComponent,
    DynamicFormNGBootstrapComponent,
  ],
  exports: [
    DynamicFormsCoreModule,
    DynamicFormNGBootstrapComponent,
  ],
})

export class DynamicFormsNGBootstrapUIModule {
}
