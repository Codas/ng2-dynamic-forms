import { FormGroup, FormControl } from "@angular/forms";
import { DynamicFormControlModel } from "../model/dynamic-form-control.model";
import {
  DynamicFormControlRelation,
  DynamicFormControlRelationGroup,
  DYNAMIC_FORM_CONTROL_ACTION_DISABLE,
  DYNAMIC_FORM_CONTROL_ACTION_ENABLE,
  DYNAMIC_FORM_CONTROL_ACTION_HIDE,
  DYNAMIC_FORM_CONTROL_ACTION_SHOW,
  DYNAMIC_FORM_CONTROL_CONNECTIVE_AND,
  DYNAMIC_FORM_CONTROL_CONNECTIVE_OR,
} from "../model/dynamic-form-control-relation.model";

export class RelationUtils {

  static findActivationRelation(relGroups: DynamicFormControlRelationGroup[]): DynamicFormControlRelationGroup | undefined {

    return relGroups.find(rel => {
      return rel.action === DYNAMIC_FORM_CONTROL_ACTION_DISABLE || rel.action === DYNAMIC_FORM_CONTROL_ACTION_ENABLE;
    });
  }

  static findActivationRelationHidden(relGroups: DynamicFormControlRelationGroup[]): DynamicFormControlRelationGroup | undefined {
    return relGroups.find(function (rel) {
      return rel.action === DYNAMIC_FORM_CONTROL_ACTION_HIDE || rel.action === DYNAMIC_FORM_CONTROL_ACTION_SHOW;
    });
  };

  static getRelatedFormControls(model: DynamicFormControlModel, controlGroup: FormGroup): FormControl[] {

    const controls: FormControl[] = [];

    model.relation.forEach(relGroup => relGroup.when.forEach(rel => {

      if (model.id === rel.id) {
        throw new Error(`FormControl ${model.id} cannot depend on itself`);
      }

      const control = controlGroup.get(rel.id) as FormControl;

      if (control && !controls.some(controlElement => controlElement === control)) {
        controls.push(control);
      }
    }));

    return controls;
  }

  static isFormControlToBeHidden(relGroup: DynamicFormControlRelationGroup, formGroup: FormGroup): boolean {
    return relGroup.when.reduce((toBeHidden: boolean, rel: DynamicFormControlRelation, index: number) => {
      const control = formGroup.get(rel.id);
      if (control && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_HIDE) {
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && !toBeHidden) {
          return false;
        }
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && toBeHidden) {
          return true;
        }
        return rel.value === control.value || rel.status === control.status;
      }
      if (control && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_SHOW) {
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && toBeHidden) {
          return true;
        }
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && !toBeHidden) {
          return false;
        }
        return !(rel.value === control.value || rel.status === control.status);
      }
      return false;
    }, false);
  }

  static isFormControlToBeDisabled(relGroup: DynamicFormControlRelationGroup, formGroup: FormGroup): boolean {
    return relGroup.when.reduce((toBeDisabled: boolean, rel: DynamicFormControlRelation, index: number) => {
      const control = formGroup.get(rel.id);
      if (control && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_DISABLE) {
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && !toBeDisabled) {
          return false;
        }
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && toBeDisabled) {
          return true;
        }
        return rel.value === control.value || rel.status === control.status;
      }
      if (control && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_ENABLE) {
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && toBeDisabled) {
          return true;
        }
        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && !toBeDisabled) {
          return false;
        }
        return !(rel.value === control.value || rel.status === control.status);
      }
      return false;
    }, false);
  }
}
