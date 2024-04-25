import { updateStatusObserver } from '../observer/user-ekyc-update-status.subject';
import { validatorTemplateFactory } from '../template/user-ekyc-store-form.validate';
import { UserModel } from '../user-ekyc.dto';
import { UserEKYCModel } from '../user-ekyc.model';
import { IUserEKYCRepository } from '../user-ekyc.repository';
import { EKYCFormData, EKYCStatus } from '../user-ekyc.type';

import { storeStrategyFactory } from '../strategy/user-ekyc-store-data.strategy';
import { CommittedCommand, Invoker, StoreCommand, ValidateCommand } from '../command/user-ekyc-store.command';

export abstract class IStoreEKYCUseCase {
  protected userEKYCRepository: IUserEKYCRepository;

  protected constructor(userEKYCRepository: IUserEKYCRepository) {
    this.userEKYCRepository = userEKYCRepository;
  }

  /**
   * Store EKYC form to database
   */

  abstract store(userId: number, payload: EKYCFormData): Promise<UserEKYCModel>;

  /**
   * Apply Observer pattern
   * @param userId
   * @param status
   * @private
   */
  protected async afterCommitted(userId: number, status: EKYCStatus): Promise<void> {
    updateStatusObserver(userId, status);
  }

  protected async getLatestEKYCByUserId(id: number): Promise<UserEKYCModel> {
    return this.userEKYCRepository.findById(id);
  }
}

export class StoreManually extends IStoreEKYCUseCase {
  constructor(userEKYCRepository: IUserEKYCRepository) {
    console.log("1. Init class StoreManually for eKYC manually")
    super(userEKYCRepository);
  }

  /**
   * Implement store and verify eKYC form manually with
   * + Command pattern
   * + Template pattern
   * + Strategy pattern
   * + Observer pattern
   */
  async store(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    console.log('----- Store eKYC form to database without 3rd party API');
    const user = new UserModel();
    const latestForm = await this.userEKYCRepository.findById(userId);
    // Init invoker for command pattern
    const invoker = new Invoker();
    // Set command for invoker
    invoker.setOnValidate(new ValidateCommand(user, latestForm, payload));
    invoker.setOnStore(new StoreCommand(userId, payload, this.userEKYCRepository));
    invoker.setOnCommitted(new CommittedCommand(userId, payload.status));
    // Execute command
    return await invoker.doStoreEKYCFormManually() as UserEKYCModel;
  }
}

export class StoreWith3rdApi extends IStoreEKYCUseCase {
  constructor(userEKYCRepository: IUserEKYCRepository) {
    console.log('1. Init class StoreWith3rdApi for eKYC with 3rd party API');
    super(userEKYCRepository);
  }

  async store(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    /**
     * Find user by ID
     * Find the latest form by user ID
     */
    const user = new UserModel();
    const latestForm = await this.userEKYCRepository.findById(userId);
    /**
     * Apply template method to validate form
     */
    const validator = validatorTemplateFactory[payload.status];
    if (!validator) {
      throw new Error('Error');
    }
    console.log('2. Template method validate form - StoreFormValidateTemplateAbs');
    validator.doValidate(user, latestForm, payload);

    /**
     * Apply strategy pattern to store form
     */
    console.log('3. Select strategy to store by status obj factory');
    const strategy = storeStrategyFactory[payload.status];
    if (!strategy) {
      throw new Error();
    }
    const userEKYC = await strategy.execute(userId, payload);

    // start transaction
    const tx = {};
    try {
      const currentEntity = await this.userEKYCRepository.save(userEKYC);
      // commit transaction
      /**
       * Apply observer pattern save audit logs
       * and push notification after transaction committed
       */
      console.log('4. After committed - Update subject state for observer listen');
      await this.afterCommitted(userId, userEKYC.status);
      return currentEntity;
    } catch (e) {
      // throw exception and handle error
      throw e;
    }
  }
}
