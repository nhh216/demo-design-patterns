import { IUserEKYCRepository } from '../user-ekyc.repository';
import { UserEKYCModel } from '../user-ekyc.model';
import { EKYCFormData } from '../user-ekyc.type';
import { IStoreUserEKYCUseCase } from './store-user-ekyc-with-3rd-api.use-case';
import {
  CommittedCommand,
  Invoker,
  StoreCommand,
  ValidateCommand,
} from '../command/user-ekyc-store.command';
import { UserModel } from '../user-ekyc.dto';

export class StoreManually extends IStoreUserEKYCUseCase {
  constructor(userEKYCRepository: IUserEKYCRepository) {
    console.log("1. Init class use-case store EKYC form to database and verify manually")
    super(userEKYCRepository);
  }

  async store(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    console.log('----- Store EKYC form to database don"t use 3rd party API');
    const user = new UserModel();
    const latestForm = await this.getLatestEKYCByUserId(userId);
    const invoker = new Invoker();
    invoker.setOnValidate(new ValidateCommand(user, latestForm, payload));
    invoker.setOnStore(new StoreCommand(userId, payload, this.userEKYCRepository));
    invoker.setOnCommitted(new CommittedCommand(userId, payload.status));
    return await invoker.doStoreEKYCFormManually() as UserEKYCModel;
  }

}
