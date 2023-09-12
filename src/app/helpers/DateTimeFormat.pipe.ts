import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constantes } from '../util/constantes';

@Pipe({
  name: 'DateFormatPipe'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  override transform(value: any, args?: any): any {
    return super.transform(value, Constantes.DATE_TIME_FMT);
  }

}
