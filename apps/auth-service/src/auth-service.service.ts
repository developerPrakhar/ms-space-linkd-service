import { Inject, Injectable } from '@nestjs/common';
import { SignupDTO } from './dto/signup.dto';
import { Logger } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { User } from './interfaces/user.interface';
import * as jwt from 'jsonwebtoken';
import { QueryBuilder } from '../../../utils/queryBuilder';

@Injectable()
export class AuthServiceService {
  private readonly logger = new Logger(AuthServiceService.name);
  constructor(
    @Inject('MYSQL_POOL') private readonly pool: Pool,
    private readonly queryBuilder: QueryBuilder,
  ) {}

  async signup(dto: SignupDTO) {
    this.logger.log(
      `🚀 ~ AuthServiceService ~ signup Method invoked with email: ${dto.email}, password: ${dto.password} and name: ${dto.name}`,
    );
    try {
      const [rows] = await this.pool.query(
        'SELECT id from users WHERE email = ?',
        [dto.email],
      );
      if ((rows as any[]).length > 0)
        throw { message: 'Email already registered', status: 401 };
      const hash = await bcrypt.hash(dto.password, 10);
      const [result] = await this.pool.query(
        'INSERT INTO users (email, password, name) VALUES (?,?,?)',
        [dto.email, hash, dto.name],
      );
      return {
        id: (result as any).insertId,
        email: dto.email,
        name: dto.name,
      };
    } catch (err) {
      this.logger.error('Error in AuthServiceService signup:', err);
      throw {
        message: err.message,
        status: 500,
      };
    }
  }

  async login(dto: LoginDTO) {
    this.logger.log(
      `🚀 ~ AuthServiceService ~ login Method invoked with email: ${dto.email}, password: ${dto.password}`,
    );
    try {
      const user = await this.validateUser(dto.email, dto.password);
      if (!user) {
        throw { message: 'Invalid email or password', status: 401 };
      }
      const token = jwt.sign(
        { sub: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: Number(process.env.JWT_EXPIRES_IN) || '1h' },
      );
      const resp = {
        user: {
          access_token: token,
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (err) {
      this.logger.error('Error in AuthServiceService login:', err);
      throw { message: 'Invalid email or password', status: 401 };
    }
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    this.logger.log(
      `🚀 ~ AuthServiceService ~ getUserById Method invoked with id:${id}`,
    );
    try {
      const [rows] = await this.pool.query(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [id],
      );
      return (rows as Omit<User, 'password'>[])[0] || null;
    } catch (err) {
      this.logger.error('Error in AuthServiceService getUserById:', err);
      throw {
        message: err.message,
        status: 500,
      };
    }
  }

  async getUserByEmail(email: string) {
    this.logger.log(
      `🚀 ~ AuthServiceService ~ getUserByEmail Method invoked with email: ${email}`,
    );
    try {
      const qb = new QueryBuilder().append(
        'SELECT * FROM users WHERE email = ?',
        [email],
      );
      const build = qb.build();
      const [rows] = await this.pool.query(build.sql, build.args);
      const user = (rows as User[])[0];
      const { password, ...data } = user;
      return data;
    } catch (err) {
      this.logger.error('Error in AuthServiceService getUserByEmail:', err);
      throw {
        message: err.message,
        status: 500,
      };
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.log(
      `🚀 ~ AuthServiceService ~ validateUser Method invoked with email:${email}, password: ${password}`,
    );
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
      );
      const user = (rows as User[])[0];
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (err) {
      this.logger.error('Error in AuthServiceService validateUser:', err);
      throw {
        message: err.message,
        status: 500,
      };
    }
  }
}
