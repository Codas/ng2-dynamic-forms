import {
  Component,
  ContentChildren,
  EventEmitter, HostBinding,
  Input,
  OnChanges, OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  DynamicFormValidationService,
  DynamicFormControlComponent,
  DynamicFormControlModel,
  DynamicFormControlEvent,
  DynamicTemplateDirective,
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_INPUT,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_SELECT,
  DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
  DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER,
  DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD,
  DynamicDatePickerModel,
} from "../../core";

export const enum NGBootstrapFormControlType {

  Array = 1, // "ARRAY",
  Calendar = 2, // "CALENDAR",
  Checkbox = 3, // "CHECKBOX",
  DatePicker = 4, // "DATEPICKER",
  Group = 5, // "GROUP",
  Input = 6, // "INPUT",
  RadioGroup = 7, // "RADIO_GROUP",
  Select = 8, // "SELECT",
  TextArea = 9, // "TEXTAREA",
  TimePicker = 10, // "TIMEPICKER"
  Typeahead = 101, // "TYPEAHEAD"
}

@Component({
  selector: "app-dynamic-form-bootstrap4-control'",
  templateUrl: "./dynamic-form-ng-bootstrap.component.html",
})
export class DynamicFormNGBootstrapComponent extends DynamicFormControlComponent implements OnChanges, OnInit {
  @Input() asBootstrapFormGroup: boolean = true;
  @Input() bindId: boolean = true;
  // Referencing DynamicFormArrayGroupModel does not compile. Why?
  // @Input() context: DynamicFormArrayGroupModel | null = null;
  @Input() context: any | null = null;
  @Input() group: FormGroup;
  @Input() hasErrorMessaging: boolean = false;
  @Input() model: DynamicFormControlModel;
  @Input() nestedTemplates: QueryList<DynamicTemplateDirective>;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @HostBinding('class') _cls_class = this.hostClasses;

  @ContentChildren(DynamicTemplateDirective) contentTemplates: QueryList<DynamicTemplateDirective>;

  type: NGBootstrapFormControlType | null;

  get hostClasses(): string {
    const classSet = new Set<String>();
    if (this.asBootstrapFormGroup) {
      classSet.add('form-group');
    }
    if (!this.model) {
      return Array.from(classSet).join(' ');
    }
    if (this.model.hidden) {
      classSet.add('d-none');
    }

    classSet.add(this.model.cls.element.container || '');
    classSet.add(this.model.cls.grid.container || '');

    if (!classSet.has('d-block') && !classSet.has('d-inline-block') && !classSet.has('d-flex') && !classSet.has('d-inline')) {
      classSet.add("d-block-default");
    }

    return Array.from(classSet).join(' ');
  }

  constructor(protected validationService: DynamicFormValidationService) {
    super(validationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (changes["model"]) {
      this.type = DynamicFormNGBootstrapComponent.getFormControlType(this.model);
      this._cls_class = this.hostClasses;
    }
  }

  static getFormControlType(model: DynamicFormControlModel): NGBootstrapFormControlType | null {

    switch (model.type) {

      case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
        return NGBootstrapFormControlType.Array;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
        return NGBootstrapFormControlType.Checkbox;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
      case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
        return NGBootstrapFormControlType.Group;

      case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
        const datepickerModel = model as DynamicDatePickerModel;

        return datepickerModel.inline ? NGBootstrapFormControlType.Calendar : NGBootstrapFormControlType.DatePicker;

      case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
        return NGBootstrapFormControlType.Input;

      case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
        return NGBootstrapFormControlType.RadioGroup;

      case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
        return NGBootstrapFormControlType.Select;

      case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
        return NGBootstrapFormControlType.TextArea;

      case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
        return NGBootstrapFormControlType.TimePicker;

      case DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD:
        return NGBootstrapFormControlType.Typeahead;

      default:
        return null;
    }
  }
}
