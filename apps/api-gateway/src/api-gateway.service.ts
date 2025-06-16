import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  health() {
    console.log('🚀 ~ ApiGatewayService ~ health method invoked:');
    const data = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    };
    return data;
  }
}
