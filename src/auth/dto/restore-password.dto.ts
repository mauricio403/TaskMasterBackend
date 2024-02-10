import { IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class RestorePasswordDTO {

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The old password must have a Uppercase, lowercase letter and a number'
    })
    oldPassword: string


    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The  new password must have a Uppercase, lowercase letter and a number'
    })
    newPassword: string

    @IsString()
    @IsUUID()
    userId: string

}