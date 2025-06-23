import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {Pool} from "mysql2/promise"
import { CreatePropertyDTO } from '../dto/createProperty.dto';

@Injectable()
export class PropertyServiceService {
  private readonly logger = new Logger(PropertyServiceService.name);
  

  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    @Inject("MYSQL_POOL") private readonly pool:Pool  
  ) {}

  async getUserById(id: number) {
    this.logger.log(
      `🚀 ~ PropertyServiceService ~ getUserById Method invoked with id: ${id}`,
    );
    const resp = await lastValueFrom(this.authClient.send('getUserById', id));
    if (!resp.ok) {
      return { ok: false, message: resp.message, status: resp.status || 500 };
    }
    return { ok: resp.ok, message: resp.message, user: resp.user };
  }

  async createProperty(dto: CreatePropertyDTO) {
   this.logger.log(
     `🚀 ~ PropertyServiceService ~ createProperty Method invoked with dto: ${JSON.stringify(dto)}`,
   );
   try {
     const [result] = await this.pool.query(
       `INSERT INTO properties (user_id, title, description, address, price) VALUES(?,?,?,?,?)`,
       [dto.user_id, dto.title, dto.description, dto.address, dto.price],
     );
     return { id: (result as any).insertId, ...dto };
   } catch (err) {
     this.logger.error('Error in PropertyServiceService signup:', err);
     throw {
       message: err.message,
       status: 500,
     };
   }
 }


 async getAllProperties() {
   this.logger.log(
     `🚀 ~ PropertyServiceService ~ getAllProperties Method invoked }`,
   );


   try {
     const [rows] = await this.pool.query(`SELECT * FROM properties`);
     const properties = rows as any[];
     const data = await Promise.all(
       properties.map(async (property) => {
         const user = await this.getUserById(property.user_id);
         return { ...property, user };
       }),
     );
     return { data };
   } catch (err) {
     this.logger.error(
       'Error in PropertyServiceService getAllProperties:',
       err,
     );
     throw {
       message: err.message,
       status: 500,
     };
   }
 }





 async getPropertyById(id: number) {
   this.logger.log(
     `🚀 ~ PropertyServiceService ~ getPropertyById Method invoked with id: ${id}`,
   );
   const [rows] = await this.pool.query(
     `SELECT * FROM properties WHERE id=?`,
     [id],
   );
   const property = (rows as any)[0];
   if (!property) {
     return null;
   }
   const user = (await this.getUserById(property.user_id)).user
   return {
     ...property,
     user,
   };
 }


}
