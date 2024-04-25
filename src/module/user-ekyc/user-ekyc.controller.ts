import { IStoreEKYCUseCase } from './use-case/store-user-ekyc.use-case';
import { IUpdateUserEKYCUseCase } from './use-case/update-status-use.case';
import { UserEKYCUpdateStatusDto } from './user-ekyc.dto';
import { EKYCFormData } from './user-ekyc.type';

export class UpdateStatusController {
  private updateStatusUseCase: IUpdateUserEKYCUseCase;

  constructor(updateStatusUseCase: IUpdateUserEKYCUseCase) {
    this.updateStatusUseCase = updateStatusUseCase;
  }

  public async updateStatus(payload: UserEKYCUpdateStatusDto): Promise<any> {
    return this.updateStatusUseCase.changeStatus(payload);
  }
}

export class StoreFormController {
  private userEKYCService: IStoreEKYCUseCase;

  constructor(userEKYCService: IStoreEKYCUseCase) {
    this.userEKYCService = userEKYCService;
  }

  public async store(userId: number, payload: EKYCFormData): Promise<any> {
    return this.userEKYCService.store(userId, payload);
  }
}
