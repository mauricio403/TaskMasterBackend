import { IsDate, IsIn, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTareaDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    @MaxLength(200)
    description: string;

    @IsString()
    expiration_date: String

    @IsIn(['low', 'medium', 'high'])
    priority:string

    @IsIn(['pending', 'in progress', 'completed'])
    estado: string

};
