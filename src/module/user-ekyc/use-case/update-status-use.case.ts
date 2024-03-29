import { UserEKYCUpdateStatusDto } from '@module/user-ekyc/user-ekyc.dto';
import { IUserEKYCRepository } from '@module/user-ekyc/user-ekyc.repository';
import { EKYCStatus } from '@module/user-ekyc/user-ekyc.type';
import { UserEKYCModel } from '@module/user-ekyc/user-ekyc.model';

export abstract class IUpdateUserEKYCUseCase {
  protected userEKYCRepository: IUserEKYCRepository;
  protected mockData = {
    status: EKYCStatus.SUBMITTED,
    metaData: {},
    userId: 1,
    form: {},
    createdAt: new Date(),
    deletedAt: new Date(),
    id: 1
  } as UserEKYCModel;

  protected constructor(userEKYCRepository: IUserEKYCRepository) {
    this.userEKYCRepository = userEKYCRepository;
  }
  abstract async changeStatus(payload: UserEKYCUpdateStatusDto): Promise<void>;
}

export class UpdateStatusUseCase extends IUpdateUserEKYCUseCase {
  async changeStatus(payload: UserEKYCUpdateStatusDto): Promise<void> {
    const currentEntity = {
      ...this.mockData,
    };
    const userEKYC = this.mockData;
    // change status
    userEKYC.status = payload.status;
    console.log('Updated status', userEKYC);
    const result = await this.userEKYCRepository.save(userEKYC);
  }
}
