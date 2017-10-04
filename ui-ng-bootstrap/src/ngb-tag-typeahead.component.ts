import {
  Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, TemplateRef,
  ViewChild,
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ResultTemplateContext } from "@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

const NGB_TAG_TYPEAHEAD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTagTypeaheadComponent),
  multi: true,
};

export interface NgbTagTypeaheadSelectItemEvent {
  item: any;
  selected: any[];
  preventDefault: () => void;
}

@Component({
  selector: "ngb-tagTypeahead",
  template: `
    <div class="form-control typeahead-container">
      <span class="btn btn-primary btn-sm selected" *ngFor="let item of selectedItems">
        {{item}}<span class="close-selected" (click)="remove($event, item)">&nbsp;x</span>
      </span>
      <input #input
             type="text"
             class="input-clear"
             [attr.tabindex]="tabIndex"
             [autofocus]="autofocus"
             [focusFirst]="focusFirst"
             [editable]="editable"
             [resultTemplate]="resultTemplate"
             [inputFormatter]="inputFormatter"
             [resultFormatter]="resultFormatter"
             [ngbTypeahead]="search"
             [showHint]="showHint"
             [placeholder]="placeholder"
             (selectItem)="selected($event)"
             (blur)="blur.emit($event)"
             (focus)="focus.emit($event)"
             (change)="change.emit($event)"/>
    </div>
  `,
  styles: [`
    .input-clear {
      border: 0;
      outline: 0;
      background-color: transparent;
      min-width: 120px;
    }

    .selected {
      margin-right: 0.2rem;
    }

    .close-selected {
      margin-left: 0.3rem;
    }
  `],
})
export class NgbTagTypeaheadComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @ViewChild('input') inputEl;
  subscription = new Subscription();
  selectedItems = new BehaviorSubject<any[]>([]);

  /**
   * The tab index of this input element.
   */
  @Input() autofocus: boolean = false;

  /**
   * The tab index of this input element.
   */
  @Input() tabIndex?: number;

  /**
   * A flag indicating if model values should be restricted to the ones selected from the popup only.
   */
  @Input() editable: boolean = false;

  /**
   * The placeholder to be shown in the input field.
   */
  @Input() placeholder: string = "";

  /**
   * A flag indicating if the first match should automatically be focused as you type.
   */
  @Input() focusFirst: boolean = true;

  /**
   * A function to convert a given value into string to display in the input field
   */
  @Input() inputFormatter: (value: any) => string;

  /**
   * A template to override a matching result default display
   */
  @Input() resultFormatter: (value: any) => string;

  /**
   * A function to transform the provided observable text into the array of results.  Note that the "this" argument
   * is undefined so you need to explicitly bind it to a desired "this" target.
   */
  @Input() search: (text: Observable<string>) => Observable<any[]>;

  /**
   * A template to override a matching result default display
   */
  @Input() resultTemplate: TemplateRef<ResultTemplateContext>;

  /**
   * Show hint when an option in the result list matches.
   */
  @Input() showHint: boolean = true;

  /**
   * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
   */
  @Output() selectItem = new EventEmitter<NgbTagTypeaheadSelectItemEvent>();

  /**
   * An event emitted when a match is removed. Event payload is of type NgbTypeaheadSelectItemEvent.
   */
  @Output() removeItem = new EventEmitter<NgbTagTypeaheadSelectItemEvent>();

  @Output() blur = new EventEmitter<FocusEvent>();

  @Output() focus = new EventEmitter<FocusEvent>();

  @Output() change = new EventEmitter<Event>();

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const subscription = this.selectedItems.subscribe((items) => {
      this.onTouched();
      this.onChange(items);
    });
    this.subscription.add(subscription);
  }

  selected($e) {
    $e.preventDefault();
    const items = this.selectedItems.getValue().concat($e.item);
    this.selectedItems.next(items);
    this.inputEl.nativeElement.value = '';
    const emitEvt = {
      item: $e.item,
      selected: items,
      preventDefault: $e.preventDefault,
    };
    this.selectItem.emit(emitEvt);
  }

  remove($e, item) {
    const items = this.selectedItems.getValue().slice(0);
    items.splice(items.indexOf(item), 1);
    this.selectedItems.next(items);

    this.inputEl.nativeElement.focus();
    const emitEvt = {
      item: item,
      selected: items,
      preventDefault: $e.preventDefault,
    };
    this.removeItem.emit(emitEvt);
  }

  writeValue(obj: any): void {
    this.selectedItems = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
