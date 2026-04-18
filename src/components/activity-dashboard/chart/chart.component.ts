import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ChartDataset } from '../activity-dashboard.model';

export interface ChartConfig {
  view?: [number, number];
  colorScheme?: any;
  showXAxis?: boolean;
  showYAxis?: boolean;
  gradient?: boolean;
  showLegend?: boolean;
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  timeline?: boolean;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {

  @Input() type: ChartType = 'bar';
  @Input() data: ChartDataset[] = [];
  @Input() config: ChartConfig = {};
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No data available';

  @Output() select = new EventEmitter<any>();
  @Output() activate = new EventEmitter<any>();

  // Default configuration
  defaultConfig: ChartConfig = {
    view: [400, 300],
    colorScheme: {
      name: 'custom',
      selectable: true,
      group: 'Ordinal',
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF8A80', '#82B1FF', '#B388FF', '#A5D6A7']
    },
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: false,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: 'X Axis',
    yAxisLabel: 'Y Axis',
    timeline: false
  };

  /**
   * Gets the merged configuration
   */
  get chartConfig(): ChartConfig {
    return { ...this.defaultConfig, ...this.config };
  }

  /**
   * Checks if data is available
   */
  get hasData(): boolean {
    return this.data && this.data.length > 0;
  }

  /**
   * Handles chart selection events
   */
  onSelect(event: any): void {
    this.select.emit(event);
  }

  /**
   * Handles chart activation events
   */
  onActivate(event: any): void {
    this.activate.emit(event);
  }
}