import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PickType(CreateUserDto, ['password'] as const) {
    newPassword : string;
}
