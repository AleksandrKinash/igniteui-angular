import {
    AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, DoCheck, HostBinding, HostListener, Input, OnDestroy, OnInit
} from '@angular/core';
import { DataType } from '../data-operations/data-util';
import { IgxGridAPIService } from './api.service';
import { IgxColumnComponent } from './column.component';
import { IgxDateSummaryOperand, IgxNumberSummaryOperand, IgxSummaryOperand, IgxSummaryResult } from './grid-summary';
import { autoWire, IGridBus } from './grid.common';
import { IgxDensityEnabledComponent } from '../core/density';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: 'igx-grid-summary',
    templateUrl: './grid-summary.component.html'
})
export class IgxGridSummaryComponent extends IgxDensityEnabledComponent
     implements IGridBus, OnInit, DoCheck, AfterContentInit {

    fieldName: string;

    @Input()
    public column: IgxColumnComponent;

    @Input()
    public gridID: string;

    get dataType(): DataType {
        return this.column.dataType;
    }

    @HostBinding('class.igx-grid-summary--fw')
    get widthPersistenceClass(): boolean {
        return this.column.width !== null;
    }

    @HostBinding('class.igx-grid-summary--pinned')
    get isPinned() {
        return this.column.pinned;
    }

    @HostBinding('class.igx-grid-summary--pinned-last')
    get isLastPinned() {
        const pinnedCols = this.gridAPI.get(this.gridID).pinnedColumns;
        if (pinnedCols.length === 0) {
            return false;
        } else {
            return pinnedCols.indexOf(this.column) === pinnedCols.length - 1;
        }
    }

    @HostBinding('class.igx-grid-summary--empty')
    get emptyClass(): boolean {
        return !this.column.hasSummary;
    }

    @HostBinding('style.min-width')
    @HostBinding('style.flex-basis')
    get width() {
        return this.column.width;
    }

    public summaryItemHeight;
    public itemClass = 'igx-grid-summary__item';
    private hiddenItemClass = 'igx-grid-summary__item--inactive';
    private summaryResultClass = 'igx-grid-summary-item__result--left-align';
    private numberSummaryResultClass = 'igx-grid-summary-item__result';

    constructor(public gridAPI: IgxGridAPIService, public cdr: ChangeDetectorRef) {
        super();
    }

    @autoWire(true)
    public ngOnInit() {
    }

    ngDoCheck() {
        this.cdr.detectChanges();
    }

    ngAfterContentInit() {
        this.displayDensity = this.gridAPI.get(this.gridID).displayDensity;
        this.summaryItemHeight = this.defaultRowHeight;
    }

    get resolveSummaries(): any[] {
        if (this.fieldName) {
            const field = this.fieldName;
            this.fieldName = null;
            this.gridAPI.set_summary_by_column_name(this.gridID, field);
            if (this.column.field === field) {
                return this.gridAPI.get_summaries(this.gridID).get(field);
            } else {
                return this.gridAPI.get_summaries(this.gridID).get(this.column.field);
            }
        } else {
            this.gridAPI.set_summary_by_column_name(this.gridID, this.column.field);
            return this.gridAPI.get_summaries(this.gridID).get(this.column.field);
        }
    }

    protected get hostClassPrefix() {
        return 'igx-grid-summary';
    }
}
