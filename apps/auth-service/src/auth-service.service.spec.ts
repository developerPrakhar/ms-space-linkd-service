import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceService } from './auth-service.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';


const mockUser = {
 id: 1,
 email: 'tom@test.com',
 name: 'Tom',
 password: 'hashed',
};
const poolMock = {
 query: jest.fn(),
};


jest.mock('bcrypt');
jest.mock('jsonwebtoken');


describe('AuthServiceService', () => {
 let service: AuthServiceService;


 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     providers: [
       AuthServiceService,
       { provide: 'MYSQL_POOL', useValue: poolMock },
     ],
   }).compile();


   service = module.get<AuthServiceService>(AuthServiceService);


   (poolMock.query as jest.Mock).mockReset();
   (bcrypt.hash as jest.Mock).mockReset();
   (bcrypt.compare as jest.Mock).mockReset();
   (jwt.sign as jest.Mock).mockReset();
 });


 it('should be defined', () => {
   expect(service).toBeDefined();
 });


 describe('signup', () => {
   it('should create user if email not exists', async () => {
     (poolMock.query as jest.Mock).mockResolvedValueOnce([[]]);
     (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');
     (poolMock.query as jest.Mock).mockResolvedValueOnce([{ insertId: 2 }]);


     const result = await service.signup({
       email: 'test@test.com',
       password: 'Test1234@',
       name: 'Test',
     });
     expect(result).toEqual({ id: 2, email: 'test@test.com', name: 'Test' });
   });
 });


 describe('login', () => {
   it('should login successfully', async () => {
     (poolMock.query as jest.Mock).mockResolvedValueOnce([[mockUser]]);
     (bcrypt.compare as jest.Mock).mockResolvedValue(true);
     (jwt.sign as jest.Mock).mockReturnValue('token');
     const result = await service.login({
       email: 'tom@test.com',
       password: 'Test1234@',
     });
     expect(result.access_token).toBe('token');
     expect(result.user.email).toBe('tom@test.com');
   });


   it('should throw unauthorised for wrong password', async () => {
     (poolMock.query as jest.Mock).mockResolvedValue([[mockUser]]);
     (bcrypt.compare as jest.Mock).mockResolvedValue(false);


     await expect(
       service.login({ email: 'tom@test.com', password: 'wrong' }),
     ).rejects.toMatchObject({
       message: 'Invalid email or password',
       status: 401,
     });
   });
 });
 describe('getUserById', () => {
   it('should return user', async () => {
     poolMock.query.mockResolvedValueOnce([[mockUser]]);
     const result = await service.getUserById(1);
     expect(result).toEqual(mockUser);
   });
 });
});



