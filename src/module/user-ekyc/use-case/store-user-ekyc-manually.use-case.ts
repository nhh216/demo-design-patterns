import { IUserEKYCRepository } from '@module/user-ekyc/user-ekyc.repository';
import { UserEKYCModel } from '@module/user-ekyc/user-ekyc.model';
import { EKYCFormData } from '@module/user-ekyc/user-ekyc.type';
import { IStoreUserEKYCUseCase } from '@module/user-ekyc/use-case/store-user-ekyc-with-3rd-api.use-case';
import {
  CommittedCommand,
  Invoker,
  StoreCommand,
  ValidateCommand,
} from '@module/user-ekyc/command/user-ekyc-store.command';
import { UserModel } from '@module/user-ekyc/user-ekyc.dto';

export class StoreManually extends IStoreUserEKYCUseCase {
  constructor(userEKYCRepository: IUserEKYCRepository) {
    super(userEKYCRepository);
  }

  async store(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    console.log('Store EKYC form to database dont use 3rd party API');
    const user = new UserModel();
    const latestForm = await this.getLatestEKYCByUserId(userId);
    const invoker = new Invoker();
    invoker.setOnValidate(new ValidateCommand(user, latestForm, payload));
    invoker.setOnStore(new StoreCommand(userId, payload, this.userEKYCRepository));
    invoker.setOnCommitted(new CommittedCommand(userId, payload.status));
    await invoker.doStoreEKYCFormManually();
  }

}
