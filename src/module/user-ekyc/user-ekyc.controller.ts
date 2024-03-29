import { EKYCFormData, EKYCStatus } from '@module/user-ekyc/user-ekyc.type';
import { IStoreUserEKYCUseCase } from '@module/user-ekyc/use-case/store-user-ekyc-with-3rd-api.use-case';
import { IUpdateUserEKYCUseCase } from '@module/user-ekyc/use-case/update-status-use.case';
import { UserEKYCUpdateStatusDto } from '@module/user-ekyc/user-ekyc.dto';

export class UserEKYCController {
  private userEKYCService: IStoreUserEKYCUseCase;
  private updateStatusUseCase: IUpdateUserEKYCUseCase;

  constructor(userEKYCService: IStoreUserEKYCUseCase, updateStatusUseCase: IUpdateUserEKYCUseCase) {
    this.userEKYCService = userEKYCService;
    this.updateStatusUseCase = updateStatusUseCase;
  }

  public async store(userId: number, payload: EKYCFormData): Promise<any> {
    return this.userEKYCService.store(userId, payload);
  }

  public async updateEKYCFormStatus(payload: UserEKYCUpdateStatusDto): Promise<any> {
    return this.updateStatusUseCase.changeStatus(payload);
  }
}
