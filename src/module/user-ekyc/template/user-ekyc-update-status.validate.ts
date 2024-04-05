import { UserEKYCUpdateStatusDto, UserModel } from '../user-ekyc.dto';
import { UserEKYCModel } from '../user-ekyc.model';
import { StoreFormValidateTemplateAbs } from './user-ekyc-store-form.validate';
import { EKYCStatus } from '../user-ekyc.type';
import {
  validatorFactoryForManually,
  ValidatorStatusFactory,
} from '../factory/user-ekyc-update-status-validate.factory';
import { ValidateStrategyContext } from '../strategy/user-ekyc-update-status-validate.strategy';

const status = [
  EKYCStatus.DRAFT,
  EKYCStatus.SUBMITTED,
  EKYCStatus.PENDING,
  EKYCStatus.FAILED,
  EKYCStatus.REJECTED,
  EKYCStatus.VERIFIED,
];

export class UpdateStatusValidateTemplate extends StoreFormValidateTemplateAbs {

  public async updateStatusValidate(user: UserModel, payload: UserEKYCUpdateStatusDto, form: UserEKYCModel): Promise<void> {
    this.validatePayload(payload);
    this.userIsVerified(user);
    await this.validateStatus(form, payload);
  }

  protected validatePayload(payload: UserEKYCUpdateStatusDto): void {
    if (!payload.formId) {
      throw new Error('Form id is required');
    }
    if (!payload.status) {
      throw new Error('Status is required');
    }
    if (!status.includes(payload.status)) {
      throw new Error('Status is invalid');
    }
  }

  protected async validateStatus(form: UserEKYCModel, payload: UserEKYCUpdateStatusDto): Promise<void> {
    const from = form.status;
    const to = payload.status;
    const statusAbleToUpdate = [EKYCStatus.SUBMITTED, EKYCStatus.FAILED];
    if (!statusAbleToUpdate.includes(from)) {
      throw new Error('Can not update status this form');
    }
    /** The first way
     * Using factory object select strategy then apply to strategy context do validate
     */
    const validatorStrategy = validatorFactoryForManually[from];
    const validateContext = new ValidateStrategyContext(validatorStrategy)
    await validateContext.doValidate(to);

    /** The second way
     * Using factory class select strategy then apply to strategy context do validate
    * const validatorFactory = new ValidatorStatusFactory();
    * const validateStrategy = validatorFactory.createValidator(form.status);
    * const validateContext2 = new ValidateStrategyContext(validateStrategy)
    * await validateContext2.doValidate(to);
     */
  }

}
