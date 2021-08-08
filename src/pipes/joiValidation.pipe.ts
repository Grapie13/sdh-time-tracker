import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  transform(val: any, _metadata: ArgumentMetadata): any {
    const { error } = this.schema.validate(val);
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return val;
  }
}

export { JoiValidationPipe };
