import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appNumbersOnly]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumbersOnlyDirective),
      multi: true,
    },
  ],
})
export class NumbersOnlyDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef);

  @Input() decimalPlaces: number = 0;
  @Input() allowNegative: boolean = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    const input = this.elementRef.nativeElement;
    const key = event.key;
    const currentValue = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    if (this.isControlKey(event)) {
      return true;
    }

    if (
      key === '-' &&
      this.allowNegative &&
      selectionStart === 0 &&
      !currentValue.includes('-')
    ) {
      return true;
    }

    if (key === '.' && this.decimalPlaces > 0) {
      const decimalIndex = currentValue.indexOf('.');
      return (
        decimalIndex === -1 ||
        (selectionStart <= decimalIndex && selectionEnd > decimalIndex)
      );
    }

    if (this.isDigit(key)) {
      if (this.decimalPlaces > 0 && currentValue.includes('.')) {
        const decimalIndex = currentValue.indexOf('.');
        const decimalPart = currentValue.substring(decimalIndex + 1);

        if (
          selectionStart > decimalIndex &&
          selectionStart === selectionEnd &&
          decimalPart.length >= this.decimalPlaces
        ) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): boolean {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const sanitizedText = this.sanitizeInput(pastedText);

    if (sanitizedText !== pastedText) {
      this.insertTextAtCursor(sanitizedText);
    } else if (this.isValidNumber(sanitizedText)) {
      this.insertTextAtCursor(sanitizedText);
    }

    return false;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.elementRef.nativeElement;
    const value = input.value;
    const sanitizedValue = this.sanitizeInput(value);

    if (value !== sanitizedValue) {
      input.value = sanitizedValue;
      this.onChange(sanitizedValue === '' ? null : parseFloat(sanitizedValue));
      return;
    }
    this.onChange(value === '' ? null : parseFloat(value));
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private isControlKey(event: KeyboardEvent): boolean {
    return (
      event.ctrlKey ||
      event.metaKey ||
      [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'Home',
        'End',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
      ].includes(event.key)
    );
  }

  private isDigit(key: string): boolean {
    return /^\d$/.test(key);
  }

  private sanitizeInput(value: string): string {
    let sanitized = value;

    sanitized = sanitized.replace(/[^0-9.-]/g, '');

    if (this.allowNegative) {
      const negativeMatches = sanitized.match(/-/g);
      if (negativeMatches && negativeMatches.length > 1) {
        sanitized = sanitized.replace(/-/g, '');
        if (value.charAt(0) === '-') {
          sanitized = '-' + sanitized;
        }
      } else if (sanitized.includes('-') && sanitized.indexOf('-') !== 0) {
        sanitized = sanitized.replace('-', '');
        if (value.charAt(0) === '-') {
          sanitized = '-' + sanitized;
        }
      }
    } else {
      sanitized = sanitized.replace(/-/g, '');
    }

    if (this.decimalPlaces === 0) {
      sanitized = sanitized.replace(/\./g, '');
    } else {
      const parts = sanitized.split('.');
      if (parts.length > 2) {
        sanitized = parts[0] + '.' + parts.slice(1).join('');
      }

      if (parts.length === 2 && parts[1].length > this.decimalPlaces) {
        sanitized = parts[0] + '.' + parts[1].substring(0, this.decimalPlaces);
      }
    }

    return sanitized;
  }

  private isValidNumber(value: string): boolean {
    if (value === '' || value === '-') return true;
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }

  private insertTextAtCursor(text: string): void {
    const input = this.elementRef.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentValue = input.value;

    const newValue =
      currentValue.substring(0, start) + text + currentValue.substring(end);
    const sanitizedValue = this.sanitizeInput(newValue);

    input.value = sanitizedValue;

    const newCursorPos = start + text.length;
    input.setSelectionRange(newCursorPos, newCursorPos);

    this.onChange(sanitizedValue === '' ? null : parseFloat(sanitizedValue));
  }

  writeValue(value: number | string): void {
    const input = this.elementRef.nativeElement;
    input.value = value !== null && value !== undefined ? value.toString() : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const input = this.elementRef.nativeElement;
    input.disabled = isDisabled;
  }
}
