import { Test, TestingModule } from '@nestjs/testing';
import { PropertyServiceService } from './property-service.service';


const mockProperty = {
 id: 3,
 user_id: 1,
 title: 'Modern Apartment',
 description: 'desc',
 address: 'china',
 price: 2000000,
 created_at: '2025-06-18 15:31:59',
 updated_at: '2025-06-18 15:36:59',
};


const poolMock = {
 query: jest.fn(),
};


const authClientMock = {
 send: jest.fn(),
};


describe('PropertyServiceService', () => {
 let service: PropertyServiceService;


 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     providers: [
       PropertyServiceService,
       { provide: 'MYSQL_POOL', useValue: poolMock },
       { provide: 'AUTH_CLIENT', useValue: authClientMock },
     ],
   }).compile();


   service = module.get<PropertyServiceService>(PropertyServiceService);


   (poolMock.query as jest.Mock).mockReset();
 });


 it('should be defined', () => {
   expect(service).toBeDefined();
 });
 describe('createProperty', () => {
   it('it should create property', async () => {
     (poolMock.query as jest.Mock).mockResolvedValueOnce([{ insertId: 3 }]);
     const dto = {
       user_id: 1,
       title: 'Modern Apartment',
       description: 'desc',
       address: 'china',
       price: 2000000,
     };


     const result = await service.createProperty(dto);
     expect(result).toEqual({ id: 3, ...dto });
   });
 });


 describe('getPropertyById', () => {
   it('it should return property with user', async () => {
     (poolMock.query as jest.Mock).mockResolvedValueOnce([[mockProperty]]);
     service['getUserById'] = jest.fn().mockResolvedValue({
       id: 1,
       name: 'Tom',
       email: 'tom@test.com',
     });


     const result = await service.getPropertyById(1);
     expect(result.id).toBe(3);
     expect(result).toEqual({
       id: 3,
       user_id: 1,
       title: 'Modern Apartment',
       description: 'desc',
       address: 'china',
       price: 2000000,
       created_at: '2025-06-18 15:31:59',
       updated_at: '2025-06-18 15:36:59',
       user: undefined,
     });
   });


   it('should return null if property not found', async () => {
     poolMock.query.mockResolvedValueOnce([[]]);
     const result = await service.getPropertyById(5);
     expect(result).toBeNull();
   });
 });


 describe('getAllProperties', () => {
   it('should return all properties with user', async () => {
     poolMock.query.mockResolvedValueOnce([[mockProperty]]);
     service['getUserById'] = jest.fn().mockResolvedValue({
       id: 1,
       name: 'Tom',
       email: 'tom@test.com',
     });


     const result = await service.getAllProperties();
     expect(Array.isArray(result.data)).toBe(true);
     expect(result.data[0].user).toEqual({
       id: 1,
       name: 'Tom',
       email: 'tom@test.com',
     });
   });
 });
});



