import { DynamicFormControlRelationGroup } from "./dynamic-form-control-relation.model";
import { Subject } from "rxjs/Subject";
import { serializable, serialize } from "../decorator/serializable.decorator";
import { Utils } from "../utils/core.utils";

export interface DynamicPathable {

  id: string;
  index?: number;
  parent?: DynamicPathable;
}

export interface DynamicValidatorConfig {

  name: string;
  args: any;
}

export interface DynamicValidatorsMap {
  [validatorKey: string]: any | DynamicValidatorConfig;
}

export interface Cls {

  container?: string;
  control?: string;
  errors?: string;
  group?: string;
  hint?: string;
  host?: string;
  label?: string;
}

export interface ClsConfig {

  element?: Cls;
  grid?: Cls;
}

export function createEmptyClsConfig(): Cls {

  return {
    container: "",
    control: "",
    errors: "",
    group: "",
    hint: "",
    host: "",
    label: "",
  };
}

export interface DynamicFormControlModelConfig {

  disabled?: boolean;
  hidden?: boolean;
  errorMessages?: DynamicValidatorsMap;
  id: string;
  label?: string;
  relation?: DynamicFormControlRelationGroup[];
}

export abstract class DynamicFormControlModel implements DynamicPathable {

  @serializable() cls: any = {};
  @serializable("disabled") _disabled: boolean;
  @serializable("hidden") _hidden: boolean;
  disabledUpdates: Subject<boolean>;
  hiddenUpdates: Subject<boolean>;
  @serializable() errorMessages: DynamicValidatorsMap;
  @serializable() id: string;
  @serializable() label?: string;
  @serializable() name: string | null;
  parent?: DynamicPathable;
  @serializable() relation: DynamicFormControlRelationGroup[];

  abstract readonly type: string;
  abstract required: boolean;

  constructor(private config: DynamicFormControlModelConfig, cls: ClsConfig = {}) {

    if (Utils.isEmptyString(config.id)) {
      throw new Error("string id must be specified for DynamicFormControlModel");
    }

    this.cls.element = Utils.merge(cls.element, createEmptyClsConfig());
    this.cls.grid = Utils.merge(cls.grid, createEmptyClsConfig());

    this._disabled = Utils.isBoolean(config.disabled) ? config.disabled : false;
    this._hidden = Utils.isBoolean(config.hidden) ? config.hidden : false;
    this.errorMessages = config.errorMessages || {};
    this.id = config.id;
    this.label = config.label;
    this.name = this.id || null;
    this.relation = Array.isArray(config.relation) ? config.relation : [];

    this.disabledUpdates = new Subject<boolean>();
    this.disabledUpdates.subscribe((value: boolean) => this.disabled = value);

    this.hiddenUpdates = new Subject<boolean>();
    this.hiddenUpdates.subscribe((value: boolean) => this.hidden = value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(value: boolean) {
    this._hidden = value;
  }

  get hasErrorMessages(): boolean {
    return Utils.isDefined(this.errorMessages);
  }

  toJSON() {
    return serialize(this);
  }
}
