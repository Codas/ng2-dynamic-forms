import {
  Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, TemplateRef,
  ViewChild
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FileItem, FileUploader } from 'ng2-file-upload';

export interface NgbFileUploadItemEvent {
  item: any;
  selected: any[];
  preventDefault: () => void;
}

const NGB_FILE_UPLOAD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbFileUploadComponent),
  multi: true,
};

const NGB_FILE_UPLOAD_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgbFileUploadComponent),
  multi: true,
};

interface UploadedFile {
  id:number;
  name: string;
}

@Component({
  selector: 'ngb-file-upload',
  templateUrl: './ng2-file-upload.component.html',
  styleUrls: ['./ng2-file-upload.component.scss'],
  providers: [NGB_FILE_UPLOAD_VALUE_ACCESSOR, NGB_FILE_UPLOAD_VALIDATORS]
})
export class NgbFileUploadComponent implements ControlValueAccessor, Validator, OnDestroy, OnInit {
  @ViewChild('input') inputEl: ElementRef;
  subscription = new Subscription();
  readonly selectedItems = new BehaviorSubject<any[] | null>([]);
  public uploadedFiles: UploadedFile[] = [];

  uploader: FileUploader;

  /**
   * The tab index of this input element.
   */
  @Input() autofocus: boolean = false;

  /**
   * The tab index of this input element.
   */
  @Input() inputTabindex?: number;

  /**
   * The placeholder to be shown in the input field.
   */
  @Input() placeholder: string = "";

  @Input() multiple: boolean = false;

  @Input() dropzone: boolean = false;

  @Input() readonly: boolean = false;

  @Input() url: string;

  /**
   * An event emitted when a file is uploaded.
   */
  @Output() fileUploaded = new EventEmitter<NgbFileUploadItemEvent>();

  @Output() blur = new EventEmitter<FocusEvent>();

  @Output() focus = new EventEmitter<FocusEvent>();

  @Output() change = new EventEmitter<Event>();

  constructor() {
  }

  validate(c: AbstractControl) {
    return this.uploadedFiles.length ? null : {
      filesRequired: {
        valid: false
      }
    };
  }

  onChange = (_: any) => {
  };

  onTouched = () => {
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  chooseFiles() {
    this.inputEl.nativeElement.click();
  }

  removeFile(file: FileItem) {
    const index = this.uploadedFiles.findIndex(_ => _.name === file.file.name);
    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
      this.writeValue(null);
    }
    file.remove();
  }

  writeValue(obj: UploadedFile | UploadedFile[] | null): void {
    if (Array.isArray(obj)) {
      this.uploadedFiles = this.uploadedFiles.concat(obj);
    } else if (obj) {
      this.uploadedFiles.push(obj);
    }
    this.selectedItems.next(this.uploadedFiles);
  }

  removeAllFiles() {
    this.uploadedFiles = [];
    this.uploader.clearQueue();
    this.writeValue(null);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.setupUploader();

    const subscription = this.selectedItems.subscribe((items) => {
      this.onTouched();
      this.onChange(items);
    });
    this.subscription.add(subscription);
  }

  private setupUploader() {
    this.uploader = new FileUploader({url: this.url});
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(item);
      if (status !== 200) {
        console.log('Es gab ein Problem beim Hochladen der Datei.');
      } else {
        // TODO add "real" file object
        this.writeValue({
          id: 1,
          name: item.file.name
        })
      }
    }

    // if multiple files are not allowed, remove all other files
    if (!this.multiple) {
      this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
        if (this.uploader.queue.length > 1) {
          this.removeFile(this.uploader.queue[0]);
        }
      };
    }
  }
}
