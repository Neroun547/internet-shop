import { Type, Platform, EntityProperty, ValidationError } from '@mikro-orm/core';

export class CustomDateType extends Type<Date, string> {

  //@ts-ignore
  convertToJSValue(value: Date | string | undefined, platform: Platform): string {
    //@ts-ignore
    return value;
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `date(${prop.length})`;
  }

}
