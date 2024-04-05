import { UserEKYCModel } from './user-ekyc.model';

export interface IUserEKYCRepository {
  save(data: UserEKYCModel): Promise<UserEKYCModel>;

  findById(formId: number): Promise<UserEKYCModel>;
}

export class UserEKYCRepositoryImpl implements IUserEKYCRepository {
  async save(data: UserEKYCModel): Promise<UserEKYCModel> {
    // persistent data to database
    return {
      ...data,
    };
  }

  async findById(formId: number): Promise<UserEKYCModel> {
    return null;
    // get data from database
    // return Promise.resolve({
    //   id: 1,
    //   userId: 1,
    //   form: JSON.stringify({
    //     fullName: 'John Doe',
    //     birthDate: new Date('1990-01-01'),
    //     address: 'Jakarta',
    //     identityNumber: '1234567890',
    //     identityFrontImage: 'front.jpg',
    //     identityBackImage: 'back.jpg',
    //     selfieImage: ['selfie1.jpg', 'selfie2.jpg'],
    //   }),
    //   status: EKYCStatus.SUBMITTED,
    //   metaData: JSON.stringify({
    //     reason: 'Need more information',
    //     updateStatusBy: 1,
    //     providerApiResponse: 'Response from EKYC service for tracking',
    //     version: 1,
    //   }),
    //   verifiedAt: new Date(),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   deletedAt: new Date(),
    // } as UserEKYCModel);
  }
}
