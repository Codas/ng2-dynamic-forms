import { Observable } from 'rxjs/Observable';
import { TemplateRef } from '@angular/core';
import { ResultTemplateContext } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { DynamicFormValueControlModel, DynamicFormValueControlModelConfig } from '../dynamic-form-value-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { ClsConfig } from '../dynamic-form-control.model';
import { LoadingTracker } from '../../../../../../services/loading.service';

function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

function isString(value: any): value is string {
  return typeof value === "string";
}

export const DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD = "TYPEAHEAD";

export interface DynamicTypeaheadModelConfig<T> extends DynamicFormValueControlModelConfig<T[]> {

  autoFocus?: boolean;
  editable?: boolean;
  focusFirst?: boolean;
  multiple?: boolean;
  placeholder?: string;
  prefix?: string;
  showHint?: boolean;
  suffix?: string;
  items?: T[];

  // Non serializable attributes
  inputFormatter?: (value: any) => string;
  resultFormatter?: (value: any) => string;
  search?: (value: Observable<string>) => Observable<T[]>;
  resultTemplate?: TemplateRef<ResultTemplateContext>;
}

export class DynamicTypeaheadModel<T> extends DynamicFormValueControlModel<T[]> {
  @serializable() autoFocus: boolean | null;
  @serializable() editable: boolean | null;
  @serializable() focusFirst: boolean | null;
  @serializable() multiple: boolean | null;
  @serializable() placeholder: string | null;
  @serializable() prefix: string | null;
  @serializable() showHint: boolean | null;
  @serializable() suffix: string | null;
  @serializable() items: T[] | null;
  @serializable() isLoading: boolean;

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD;

  // Non serializable attributes
  inputFormatter: ((value: any) => string) | null;
  resultFormatter: ((value: any) => string) | null;
  search: ((value: Observable<string>) => Observable<T[]>) | null;
  resultTemplate: TemplateRef<ResultTemplateContext> | null;

  get item(): T | null {
    if (this.value === null || this.value[0] === undefined) {
      return null;
    } else {
      return this.value[0];
    }
  }

  set value(newValue /* Explicitly no type annotation to satisfy typescript compiler */) {
    if (newValue instanceof Array || newValue === null) {
      this._value = newValue;
    } else {
      this._value = [newValue];
    }
  }

  get value(): T[] | null {
    return this._value;
  }

  constructor(config: DynamicTypeaheadModelConfig<T>, cls?: ClsConfig) {

    super(config, cls);

    this.autoFocus = isBoolean(config.autoFocus) ? config.autoFocus : null;
    this.editable = isBoolean(config.editable) ? config.editable : null;
    this.focusFirst = isBoolean(config.focusFirst) ? config.focusFirst : null;
    this.multiple = isBoolean(config.multiple) ? config.multiple : null;
    this.placeholder = isString(config.placeholder) ? config.placeholder : null;
    this.prefix = isString(config.prefix) ? config.prefix : null;
    this.showHint = isBoolean(config.showHint) ? config.showHint : null;
    this.suffix = isString(config.suffix) ? config.suffix : null;
    this.items = config.items !== undefined ? config.items : null;
    this.isLoading = false;

    this.inputFormatter = config.inputFormatter !== undefined ? config.inputFormatter : toString;
    this.resultFormatter = config.resultFormatter !== undefined ? config.resultFormatter : toString;
    this.resultTemplate = config.resultTemplate !== undefined ? config.resultTemplate : null;
    this.search = config.search ? config.search : null;
  }

  select(items: T[]) {
    this.items = items;
    this.valueUpdates.next(items);
  }
}
