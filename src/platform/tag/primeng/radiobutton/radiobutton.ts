import {NgModule,Component,Input,Output,AfterViewInit,ElementRef,EventEmitter,forwardRef,ViewChild,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const RADIO_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioButton),
  multi: true
};

@Component({
  selector: 'p-radioButton',
  template: `
    <div class="ui-radiobutton ui-widget">
      <div class="ui-helper-hidden-accessible">
        <input #rb type="radio" [attr.name]="name" [attr.value]="value" [attr.tabindex]="tabindex"
               [checked]="checked" (change)="onChange($event)" (focus)="onFocus($event)" (blur)="onBlur($event)">
      </div>
      <div (click)="handleClick()"
           [ngClass]="{'ui-radiobutton-box ui-widget ui-state-default':true,
                'ui-state-active':rb.checked,'ui-state-disabled':disabled,'ui-state-focus':focused}">
        <span class="ui-radiobutton-icon" [ngClass]="{'fa fa-circle':rb.checked}"></span>
      </div>
    </div>
    <label class="ui-radiobutton-label" (click)="select()" *ngIf="label">{{label}}</label>
  `,
  providers: [RADIO_VALUE_ACCESSOR]
})
export class RadioButton implements ControlValueAccessor,AfterViewInit {

  @Input() value: any;

  @Input() name: string;

  @Input() disabled: boolean;

  @Input() label: string;

  @Input() tabindex: number;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  @Output() change: EventEmitter<any> = new EventEmitter();

  @ViewChild('rb') inputViewChild: ElementRef;

  public input: HTMLInputElement;

  public onModelChange: Function = () => {};

  public onModelTouched: Function = () => {};

  public checked: boolean;

  public focused: boolean;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.input = <HTMLInputElement> this.inputViewChild.nativeElement;
  }

  handleClick() {
    if(!this.disabled) {
      // select方法在事件处理前，否则取到的值不正确
      this.select();
      this.onClick.emit(null);
    }
  }

  select() {
    if(!this.disabled) {
      this.input.checked = true;
      this.checked = true;
      this.onModelChange(this.value);
    }
  }

  writeValue(value: any) : void {
    this.checked = (value == this.value);

    if(this.input) {
      this.input.checked = this.checked;
    }

    this.cd.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
  }

  onFocus(event) {
    this.focused = true;
  }

  onBlur(event) {
    this.focused = false;
    this.onModelTouched();
  }

  onChange(event) {
    // 没起左右
    this.select();
    if(this.change) {
      this.change.emit(event);
    }
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [RadioButton],
  declarations: [RadioButton]
})
export class NuiRadioButtonModule { }
