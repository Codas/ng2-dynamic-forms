import { Observable } from 'rxjs/Observable';
import { TemplateRef } from '@angular/core';
import { ResultTemplateContext } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { DynamicFormValueControlModel, DynamicFormValueControlModelConfig } from '../dynamic-form-value-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { ClsConfig } from '../dynamic-form-control.model';

function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

function isString(value: any): value is string {
  return typeof value === "string";
}

export const DYNAMIC_FORM_CONTROL_TYPE_FILEUPLOAD = "FILEUPLOAD";

export interface DynamicNg2FileUploadModelConfig<T> extends DynamicFormValueControlModelConfig<T[]> {

  autoFocus?: boolean;
  multiple?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  dropzone?: boolean;
  url?: string;
  readonly?: boolean;
  items?: T[];
}

export class DynamicNg2FileUploadModel<T> extends DynamicFormValueControlModel<T[]> {
  @serializable() autoFocus: boolean | null;
  @serializable() multiple: boolean | null;
  @serializable() dropzone: boolean | null;
  @serializable() readonly: boolean | null;
  @serializable() url: string | null;
  @serializable() placeholder: string | null;
  @serializable() prefix: string | null;
  @serializable() suffix: string | null;
  @serializable() items: T[] | null;
  @serializable() isLoading: boolean;

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_FILEUPLOAD;

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

  constructor(config: DynamicNg2FileUploadModelConfig<T>, cls?: ClsConfig) {

    super(config, cls);

    this.autoFocus = isBoolean(config.autoFocus) ? config.autoFocus : null;
    this.multiple = isBoolean(config.multiple) ? config.multiple : null;
    this.placeholder = isString(config.placeholder) ? config.placeholder : null;
    this.prefix = isString(config.prefix) ? config.prefix : null;
    this.suffix = isString(config.suffix) ? config.suffix : null;
    this.items = config.items !== undefined ? config.items : null;
    this.dropzone = isBoolean(config.dropzone) ? config.dropzone : null;
    this.url = isString(config.url) ? config.url : null;
    this.readonly = isBoolean(config.readonly) ? config.readonly : null;
    this.isLoading = false;
  }

  select(items: T[]) {
    this.items = items;
    this.valueUpdates.next(items);
  }
}
