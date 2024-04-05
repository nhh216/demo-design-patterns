import { updateStatusObserver } from '../observer/user-ekyc-update-status.subject';
import { validatorTemplateFactory } from '../template/user-ekyc-store-form.validate';
import { UserModel } from '../user-ekyc.dto';
import { UserEKYCModel } from '../user-ekyc.model';
import { IUserEKYCRepository } from '../user-ekyc.repository';
import { EKYCFormData, EKYCStatus } from '../user-ekyc.type';

import { storeStrategyFactory } from '../strategy/user-ekyc-store-data.strategy';

export abstract class IStoreUserEKYCUseCase {
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

export class StoreWith3rdApi extends IStoreUserEKYCUseCase {
  constructor(userEKYCRepository: IUserEKYCRepository) {
    console.log('1. Init class use-case store EKYC to database and verify by 3rd party API');
    super(userEKYCRepository);
  }

  async store(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    /**
     * Find user by ID
     * Find the latest form by user ID
     */
    const user = new UserModel();
    const latestForm = await this.getLatestEKYCByUserId(userId);
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
