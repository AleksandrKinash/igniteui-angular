import { Component, ContentChild, Pipe, PipeTransform, OnInit, Input, Directive, TemplateRef } from '@angular/core';
import { IgxInputGroupComponent } from '../input-group/input-group.component';
import { IgxInputGroupBase } from '../input-group/input-group.common';
import { NgControl } from '@angular/forms';
import { IgxDateTimeEditorDirective } from '../directives/date-time-editor';
import { formatDate } from '@angular/common';

export interface DateRange {
    start: Date;
    end: Date;
}

/** @hidden @internal */
@Pipe({ name: 'dateRange' })
export class DateRangeFormatPipe implements PipeTransform {
    transform(values: DateRange, inputFormat?: string, locale?: string): string {
        if (!values) {
            return '';
        }
        const { start, end } = values;
        // TODO: move default locale from IgxDateTimeEditorDirective to its commons file/use displayFormat
        const startDate = inputFormat ? formatDate(start, inputFormat, locale || 'en') : start?.toLocaleDateString();
        const endDate = inputFormat ? formatDate(end, inputFormat, locale || 'en') : end?.toLocaleDateString();
        let formatted;
        if (start) {
            formatted = `${startDate} - `;
            if (end) {
                formatted += endDate;
            }
        } else if (end) {
            formatted = `${endDate} - `;
            if (start) {
                formatted += startDate;
            }
        }

        // TODO: no need to set format twice
        return formatted ? formatted : '';
    }

    parse(value: string): DateRange {
        const values = value.trim().split(/ - /g);
        return {
            start: values[0] && new Date(Date.parse(values[0])),
            end: values[1] && new Date(Date.parse(values[1]))
        };
    }
}

/** @hidden @internal */
@Component({
    template: ``,
    selector: `igx-date-range-base`,
    providers: [{ provide: IgxInputGroupBase, useExisting: IgxDateRangeBaseComponent }]
})
class IgxDateRangeBaseComponent extends IgxInputGroupComponent implements OnInit {
    @ContentChild(NgControl)
    protected ngControl: NgControl;

    @ContentChild(IgxDateTimeEditorDirective)
    public dateTimeEditor: IgxDateTimeEditorDirective;

    /** @hidden @internal */
    public ngOnInit(): void {
        // this.input.nativeElement.readOnly = true;
    }

    /** @hidden @internal */
    public get nativeElement() {
        return this.element.nativeElement;
    }

    /** @hidden @internal */
    public setFocus(): void {
        this.input.focus();
    }

    /** @hidden @internal */
    public updateInput(value: Date) {
        if (this.ngControl) {
            this.ngControl.control.setValue(value);
        }

        this.dateTimeEditor.value = value;
    }
}

/**
 * Defines the start input for a date range picker
 *
 * @igxModule IgxDateRangeModule
 *
 * @igxTheme igx-input-group-theme, igx-calendar-theme
 *
 * @igxKeywords date, range, date range, date picker
 *
 * @igxGroup scheduling
 *
 * @remarks
 * When templating, start input has to be template seperately
 *
 * @example
 * ```html
 * <igx-date-range mode="dropdown">
 *      <igx-date-start>
 *          <input igxInput igxDateTimeEditor type="text" required>
 *      </igx-date-start>
 *      ...
 * </igx-date-range>
 * ```
 */
@Component({
    selector: 'igx-date-start',
    templateUrl: '../input-group/input-group.component.html',
    providers: [{ provide: IgxInputGroupBase, useExisting: IgxDateStartComponent }]
})
export class IgxDateStartComponent extends IgxDateRangeBaseComponent { }

/**
 * Defines the end input for a date range picker
 *
 * @igxModule IgxDateRangeModule
 *
 * @igxTheme igx-input-group-theme, igx-calendar-theme
 *
 * @igxKeywords date, range, date range, date picker
 *
 * @igxGroup scheduling
 *
 * @remarks
 * When templating, end input has to be template seperately
 *
 * @example
 * ```html
 * <igx-date-range mode="dropdown">
 *      <igx-date-end>
 *          <input igxInput igxDateTimeEditor type="text" required>
 *      </igx-date-end>
 *      ...
 * </igx-date-range>
 * ```
 */
@Component({
    selector: 'igx-date-end',
    templateUrl: '../input-group/input-group.component.html',
    providers: [{ provide: IgxInputGroupBase, useExisting: IgxDateEndComponent }]
})
export class IgxDateEndComponent extends IgxDateRangeBaseComponent { }

/** @hidden @internal */
@Component({
    selector: 'igx-date-single',
    templateUrl: 'igx-date-range-inputs.common.html',
    providers: [{ provide: IgxInputGroupBase, useExisting: IgxDateSingleComponent }]
})
export class IgxDateSingleComponent extends IgxDateRangeBaseComponent {
    public updateInput(value: any, inputFormat?: string, locale?: string) {
        value = new DateRangeFormatPipe().transform(value, inputFormat, locale);
        if (this.ngControl) {
            this.ngControl.control.setValue(value);
        } else {
            this.input.value = value;
        }
    }
}

@Directive({
    selector: '[igxDateRangePrefix]',
    exportAs: 'igxDateRangePrefix',
})
export class IgxDateRangePrefixDirective {
    constructor(public templateRef: TemplateRef<any>) { }
}

@Directive({
    selector: '[igxDateRangeSuffix]',
    exportAs: 'igxDateRangeSuffix',
})
export class IgxDateRangeSuffixDirective {
    constructor(public templateRef: TemplateRef<any>) { }
}
