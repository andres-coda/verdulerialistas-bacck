import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";
import { Role } from "../../auth/rol/rol.enum";

export class CrearUser{
    @IsNotEmpty()
    @IsEmail()
    email!:string;

    @IsNotEmpty()
    @IsString()
    @Length(6,undefined,{ message:"La contraseña no puede tener menos de 6 caracteres"})
    password!:string;

    @IsNotEmpty()
    @IsString()
    nombre!:string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 20,{ message:"El telefono no puede tener mas de 20 caracteres"})
    telefono!:string;

    @IsOptional()
    role?:Role;
}