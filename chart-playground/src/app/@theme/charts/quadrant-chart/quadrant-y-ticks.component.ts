import {
    Component,
    Input,
    Output,
    OnChanges,
    ElementRef,
    ViewChild,
    EventEmitter,
    AfterViewInit,
    ChangeDetectionStrategy,
    SimpleChanges
} from '@angular/core';
import { trimLabel, reduceTicks } from '@swimlane/ngx-charts';


@Component({
    selector: 'g[ngx-quadrant-y-ticks]',
    template: `
    <svg:g #ticksel>
        <svg:g *ngFor="let tick of ticks" class="tick"
            [attr.transform]="transform(tick)" >
            <title>{{tickFormat(tick)}}</title>
            <svg:text
                *ngIf="!quadrantSwitch"
                stroke-width="0.01"
                [attr.dy]="dy"
                [attr.x]="x1"
                [attr.y]="y1"
                [attr.text-anchor]="textAnchor"
                [style.font-size]="'12px'">
                {{trimLabel(tickFormat(tick))}}
            </svg:text>
        </svg:g>
    </svg:g>

    <svg:g *ngFor="let tick of ticks;"
        [attr.transform]="transform(tick)">
        <svg:g
            *ngIf="!quadrantSwitch && showGridLines"
            [attr.transform]="gridLineTransform()">
            <svg:line
                class="gridline-path gridline-path-horizontal"
                x1="0"
                [attr.x2]="gridLineWidth" />
        </svg:g>
    </svg:g>

    <svg:g
        [attr.transform]="directionTransform('left')">
        <svg:g>
            <svg:line
                style="stroke:black"
                class="gridline-path gridline-path-vertical"
                [attr.x2]="(gridLineWidth/2)-20"
                [attr.x1]="gridLineWidth/2" />
        </svg:g>
    </svg:g>
    <svg:g
        [attr.transform]="directionTransform('right')">
        <svg:g>
            <svg:line
                style="stroke:black"
                class="gridline-path gridline-path-vertical"
                [attr.x2]="(gridLineWidth/2)-20"
                [attr.x1]="gridLineWidth/2" />
        </svg:g>
    </svg:g>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuadrantYTicksComponent implements OnChanges, AfterViewInit {
    // prperty
    @Input() quadrantSwitch: boolean;
    @Input() scale;
    @Input() orient;
    @Input() tickArguments = [5];
    @Input() tickValues: any[];
    @Input() tickStroke = '#ccc';
    @Input() tickFormatting;
    @Input() showGridLines = false;
    @Input() gridLineWidth;
    @Input() height;

    @Output() dimensionsChanged = new EventEmitter();

    innerTickSize: any = 6;
    tickPadding: any = 3;
    tickSpacing: any;
    verticalSpacing: number = 20;
    textAnchor: any = 'middle';
    dy: any;
    x1: any;
    x2: any;
    y1: any;
    y2: any;
    adjustedScale: any;
    transform: (o: any) => string;
    tickFormat: (o: any) => string;
    ticks: any;
    width: number = 0;
    outerTickSize: number = 6;
    rotateLabels: boolean = false;
    trimLabel: any;

    @ViewChild('ticksel') ticksElement: ElementRef;


    // implements
    ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.updateDims());
    }


    // constructor
    constructor() {
        this.trimLabel = trimLabel;
    }

    
    // method
    updateDims(): void {
        const width = parseInt(this.ticksElement.nativeElement.getBoundingClientRect().width, 10);
        if (width !== this.width) {
            this.width = width;
            this.dimensionsChanged.emit({ width });
            setTimeout(() => this.updateDims());
        }
    }

    update(): void {
        let scale;
        const sign = this.orient === 'top' || this.orient === 'right' ? -1 : 1;
        this.tickSpacing = Math.max(this.innerTickSize, 0) + this.tickPadding;

        scale = this.scale;
        this.ticks = this.getTicks();

        if (this.tickFormatting) {
            this.tickFormat = this.tickFormatting;
        } else if (scale.tickFormat) {
            this.tickFormat = scale.tickFormat.apply(scale, this.tickArguments);
        } else {
            this.tickFormat = function(d) {
            if (d.constructor.name === 'Date') {
                return d.toLocaleDateString();
            }
            return d.toLocaleString();
            };
        }

        this.adjustedScale = scale.bandwidth ? function(d) {
            return scale(d) + scale.bandwidth() * 0.5;
        } : scale;

        switch (this.orient) {
            case 'top':
                this.transform = function(tick) {
                    return 'translate(' + this.adjustedScale(tick) + ',0)';
                };
                this.textAnchor = 'middle';
                this.y2 = this.innerTickSize * sign;
                this.y1 = this.tickSpacing * sign;
                this.dy = sign < 0 ? '0em' : '.71em';
            break;
            case 'bottom':
                this.transform = function(tick) {
                    return 'translate(' + this.adjustedScale(tick) + ',0)';
                };
                this.textAnchor = 'middle';
                this.y2 = this.innerTickSize * sign;
                this.y1 = this.tickSpacing * sign;
                this.dy = sign < 0 ? '0em' : '.71em';
            break;
            case 'left':
                this.transform = function(tick) {
                    return 'translate(0,' + this.adjustedScale(tick) + ')';
                };
                this.textAnchor = 'end';
                this.x2 = this.innerTickSize * -sign;
                this.x1 = this.tickSpacing * -sign;
                this.dy = '.32em';
            break;
            case 'right':
                this.transform = function(tick) {
                    return 'translate(0,' + this.adjustedScale(tick) + ')';
                };
                this.textAnchor = 'start';
                this.x2 = this.innerTickSize * -sign;
                this.x1 = this.tickSpacing * -sign;
                this.dy = '.32em';
            break;
            default:
        }
        setTimeout(() => this.updateDims());
    }

    getTicks(): any {
        let ticks;
        const maxTicks = this.getMaxTicks(20);
        const maxScaleTicks = this.getMaxTicks(50);

        if (this.tickValues) {
            ticks = this.tickValues;
        } else if (this.scale.ticks) {
            ticks = this.scale.ticks.apply(this.scale, [maxScaleTicks]);
        } else {
            ticks = this.scale.domain();
            ticks = reduceTicks(ticks, maxTicks);
        }

        return ticks;
    }

    getMaxTicks(tickHeight: number): number {
        return Math.floor(this.height / tickHeight);
    }

    tickTransform(tick): string {
        return `translate(${this.adjustedScale(tick)},${this.verticalSpacing})`;
    }

    gridLineTransform(): string {
        return `translate(5,0)`;
    }

    directionTransform(directrion: string): string{

        let angle = 0;
        if(directrion == 'left'){
            angle = -45;
        }else{
            angle = 225;
        }

        let xOffset = 0;
        if(this.quadrantSwitch){
            xOffset = 5;
        }else {
            xOffset = -(this.gridLineWidth/2)+5
        }
        return 'translate(' + xOffset +', 0)' + ' ' + 'rotate(' + angle + ',' + this.gridLineWidth/2 + ',0)';
    }
}
