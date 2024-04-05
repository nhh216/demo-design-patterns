import { IStoreUserEKYCUseCase } from './use-case/store-user-ekyc-with-3rd-api.use-case';
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
  private userEKYCService: IStoreUserEKYCUseCase;

  constructor(userEKYCService: IStoreUserEKYCUseCase) {
    this.userEKYCService = userEKYCService;
  }

  public async store(userId: number, payload: EKYCFormData): Promise<any> {
    return this.userEKYCService.store(userId, payload);
  }
}
