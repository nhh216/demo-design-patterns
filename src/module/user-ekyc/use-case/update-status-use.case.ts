import { UserEKYCUpdateStatusDto, UserModel } from '../user-ekyc.dto';
import { IUserEKYCRepository } from '../user-ekyc.repository';
import { EKYCStatus } from '../user-ekyc.type';
import { UserEKYCModel } from '../user-ekyc.model';
import { ValidatorStatusFactory } from '../factory/user-ekyc-update-status-validate.factory';
import { UpdateStatusValidateTemplate } from '../template/user-ekyc-update-status.validate';

export abstract class IUpdateUserEKYCUseCase {
  protected userEKYCRepository: IUserEKYCRepository;
  protected mockData = {
    status: EKYCStatus.SUBMITTED,
    metaData: {},
    userId: 1,
    form: {},
    createdAt: new Date(),
    deletedAt: new Date(),
    id: 1,
  } as UserEKYCModel;

  constructor(userEKYCRepository: IUserEKYCRepository) {
    this.userEKYCRepository = userEKYCRepository;
  }

  abstract changeStatus(payload: UserEKYCUpdateStatusDto): Promise<void>;
}

export class UpdateStatusUseCase extends IUpdateUserEKYCUseCase {
  async changeStatus(payload: UserEKYCUpdateStatusDto): Promise<void> {
    const entity = {
      ...this.mockData,
    };
    if (!entity) {
      throw Error('Form not found');
    }
    const userId = entity.userId;
    const user = new UserModel();
    const validateTemplate = new UpdateStatusValidateTemplate();
    validateTemplate.updateStatusValidate(user, payload, entity)

    // change status
    entity.status = payload.status;
    console.log('Updated status', entity);
    const tx = {};
    try {
      const result = await this.userEKYCRepository.save(entity);
      console.log('Transaction committed');
    } catch (e) {
      throw e;
    }
  }
}
