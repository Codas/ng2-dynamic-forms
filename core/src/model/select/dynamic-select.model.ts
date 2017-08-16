import { ClsConfig } from "../dynamic-form-control.model";
import { DynamicOptionControlModel, DynamicOptionControlModelConfig } from "../dynamic-option-control.model";
import { serializable } from "../../decorator/serializable.decorator";
import { Utils } from "../../utils/core.utils";

export const DYNAMIC_FORM_CONTROL_TYPE_SELECT = "SELECT";

export interface DynamicSelectModelConfig<T> extends DynamicOptionControlModelConfig<T> {

    filterable?: boolean;
    multiple?: boolean;
    placeholder?: string;
}

export class DynamicSelectModel<T> extends DynamicOptionControlModel<T> {

    @serializable() filterable: boolean;
    @serializable() multiple: boolean;
    @serializable() placeholder: string;

    @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SELECT;

    constructor(config: DynamicSelectModelConfig<T>, cls?: ClsConfig) {

        super(config, cls);

        this.filterable = Utils.isBoolean(config.filterable) ? config.filterable : false;
        this.multiple = Utils.isBoolean(config.multiple) ? config.multiple : false;
        this.placeholder = config.placeholder || "";
    }

    select(...indices: number[]): void {

        const value = this.multiple ? indices.map(index => this.get(index).value) : this.get(indices[0]).value;

        this.valueUpdates.next(value);
    }
}
