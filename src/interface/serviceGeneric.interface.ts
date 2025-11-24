import { QueryRunner } from "typeorm";
import { User } from "../user/entity/User.entity";

interface GenericoProp{
  userId: string;
  qR?: QueryRunner;
}

export interface GetProp<T> extends GenericoProp {
  relaciones?: (keyof T)[];
  entidadError?: string;
  orden?: keyof T & string;
}

export interface GetIdProp<T> extends Omit<GetProp<T>, 'orden'> {
  id: string;
}

export interface GetNameProp<T> extends Omit<GetProp<T>, 'orden'> {
  name: string;
}

export interface DeletProp<T> extends Omit<GetIdProp<T>, 'relaciones'> {
}

export interface EditarProp<P> extends GenericoProp{
  dto:P;
  id:string;
}

export interface CreateProp<P> extends Pick<GenericoProp,'qR'>{
  user:User;
  dto:P;
}

export interface CreateObjet extends Pick<GenericoProp, 'qR'>{
  usuario:User
}

export interface GetIdsProp<T> extends GetProp<T>{
  ids:string[]
}

export interface AddDatoProp<T> extends GetIdProp<T>{
  datos:string[];
}

export interface EditarPedidoProp<P> extends Omit<EditarProp<P>, 'qR'> {
  user: User;
}

export interface CreateDefault<P> extends Omit<CreateProp<P>, 'dto'>{}

export interface GetPaginadoProp<T> extends GetProp<T> {
  pagina: number;
  limite: number;
}

