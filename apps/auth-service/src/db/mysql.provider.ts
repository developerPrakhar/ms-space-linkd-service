import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import * as mysql from 'mysql2';
import { Logger } from '@nestjs/common';

const logger = new Logger();

export const MYSQLPROVIDER: Provider = {
  provide: 'MYSQL_POOL',

  useFactory: async (configService: ConfigService) => {
    const pool = mysql
      .createPool({
        host: configService.get<string>('MYSQL_HOST'),
        port: Number(configService.get<string>('MYSQL_PORT')),
        user: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        waitForConnections: true,
        connectionLimit: 5,
      })
      .promise();
    try {
      await pool.getConnection();
      logger.debug(
        `Connected to MYSQL at ${configService.get<string>('MYSQL_HOST')}:${Number(configService.get<string>('MYSQL_PORT'))}/${configService.get<string>('MYSQL_DATABASE')}, `,
      );
    } catch (err) {
      logger.error(`MYSQL connection failed`, err);
      throw err;
    }
    return pool;
  },
  inject: [ConfigService],
};
