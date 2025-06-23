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
        host: configService.get<string>('MYSQL_PROPERTY_HOST'),
        port: Number(configService.get<string>('MYSQL_PROPERTY_PORT')),
        user: configService.get<string>('MYSQL_PROPERTY_USER'),
        password: configService.get<string>('MYSQL_PROPERTY_PASSWORD'),
        database: configService.get<string>('MYSQL_PROPERTY_DATABASE'),
        waitForConnections: true,
        connectionLimit: 5,
      })
      .promise();

    const maxRetries = 10;
    const delayMs = 2000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const conn = await pool.getConnection();
        conn.release();
        logger.debug(
          `Connected to MYSQL at ${configService.get<string>('MYSQL_PROPERTY_HOST')}:${Number(configService.get<string>('MYSQL_PROPERTY_PORT'))}/${configService.get<string>('MYSQL_PROPERTY_DATABASE')}, `,
        );
        break;
      } catch (err) {
        logger.error(`MYSQL connection failed`, err);
        if (attempt === maxRetries) {
          logger.error(`MYSQL connection failed after max retries`);
          throw err;
        }
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }

    return pool;
  },
  inject: [ConfigService],
};
