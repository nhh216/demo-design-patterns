import { IUserEKYCRepository } from '@module/user-ekyc/user-ekyc.repository';
import { UserEKYCModel } from '@module/user-ekyc/user-ekyc.model';
import { EKYCFormData, EKYCStatus } from '@module/user-ekyc/user-ekyc.type';
import { applyObserverPattern } from '@module/user-ekyc/observer/user-ekyc-update-status.subject';
import { UserModel } from '@module/user-ekyc/user-ekyc.dto';
import { validatorTemplate } from '@module/user-ekyc/template/user-ekyc-store-form.validate';
import { storeFormWith3rdApiStrategyMap } from '@module/user-ekyc/strategy/user-ekyc-update-status-execute.strategy';

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
    applyObserverPattern(userId, status);
  }

  protected async getLatestEKYCByUserId(id: number): Promise<UserEKYCModel> {
    return this.userEKYCRepository.findById(id);
  }

}

export class StoreWith3rdApi extends IStoreUserEKYCUseCase {
  constructor(userEKYCRepository: IUserEKYCRepository) {
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
    const validator = validatorTemplate[payload.status];
    if (!validator) {
      throw new Error('Error');
    }
    validator.doValidate(user, latestForm, payload);

    const strategy = storeFormWith3rdApiStrategyMap[payload.status];
    if (strategy) {
      throw new Error();
    }
    const userEKYC = await strategy.execute(userId, payload);
    /**
     * Persistence data to DB
     */

      // start transaction
    const tx = {};
    try {
      const currentEntity = await this.userEKYCRepository.save(userEKYC);
      // commit transaction
      /**
       * apply observer pattern save audit logs
       *  and push notification after transaction committed
       */
      await this.afterCommitted(userId, payload.status);

      return currentEntity;
    } catch (e) {
      // throw exception and handle error
    }
  }

}
