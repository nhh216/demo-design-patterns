import {
  IValidateEKYCStatusStrategy,
  StatusIsDraft,
  StatusIsFailed,
  StatusIsRejected,
  StatusIsSummited,
  StatusIsSummitedByManually,
  StatusIsVerified,
} from '../strategy/user-ekyc-update-status-validate.strategy';
import { EKYCStatus } from '../user-ekyc.type';

/**
 * First way to apply factory method for create a validator strategy
 */
export class ValidatorStatusFactory {
  createValidator(status: EKYCStatus): IValidateEKYCStatusStrategy {
    if (status === EKYCStatus.DRAFT) {
      return new StatusIsDraft();
    } else if (status === EKYCStatus.SUBMITTED) {
      return new StatusIsSummited();
    }
    // .... condition with another status
  }
}

/**
 * My way to implement factory method
 */
export const validatorFactory = {
  [EKYCStatus.DRAFT]: new StatusIsDraft(),
  [EKYCStatus.SUBMITTED]: new StatusIsSummited(),
  [EKYCStatus.PENDING]: new StatusIsFailed(),
  [EKYCStatus.FAILED]: new StatusIsFailed(),
  [EKYCStatus.REJECTED]: new StatusIsRejected(),
  [EKYCStatus.VERIFIED]: new StatusIsVerified(),
};

export const validatorFactoryForManually = {
  ...validatorFactory,
  [EKYCStatus.SUBMITTED]: new StatusIsSummitedByManually(),
};
