import { EKYCStatus } from '@module/user-ekyc/user-ekyc.type';
import { UserEKYCChangeStatusValidator } from '@module/user-ekyc/singleton/user-ekyc-change-status.validator';

export interface IValidateEKYCStatusStrategy {
  validate(status: EKYCStatus): Promise<any>;
}

export class ValidateStatusContext {

  private strategy: IValidateEKYCStatusStrategy;

  constructor(strategy: IValidateEKYCStatusStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IValidateEKYCStatusStrategy) {
    this.strategy = strategy;
  }

  public doValidate(newStatus: EKYCStatus): void {
    const result = this.strategy.validate(newStatus);
  }
}

export class FormStatusIsDraft implements IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const validator = UserEKYCChangeStatusValidator.getInstance();
    validator.updateFromDraft(newStatus);
  }
}

export class FormStatusIsSummited implements IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const validator = UserEKYCChangeStatusValidator.getInstance();
    validator.updateFromSubmittedWith3rdApi(newStatus);
  }
}

export class FormStatusIsPending implements IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const validator = UserEKYCChangeStatusValidator.getInstance();
    validator.updateFromPending(newStatus);
  }
}

export class FormStatusIsFailed implements IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const validator = UserEKYCChangeStatusValidator.getInstance();
    validator.updateFromFailed(newStatus);
  }
}

export class FormStatusIsRejected implements IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const validator = UserEKYCChangeStatusValidator.getInstance();
    validator.updateFromRejected();
  }
}

export class FormStatusIsVerified implements IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const validator = UserEKYCChangeStatusValidator.getInstance();
    validator.updateFromVerified();
  }
}

export class FormStatusIsCanceled implements IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const validator = UserEKYCChangeStatusValidator.getInstance();
    validator.updateFromCanceled();
  }
}

export const validatorStrategyMap = {
  [EKYCStatus.DRAFT]: new FormStatusIsDraft(),
  [EKYCStatus.SUBMITTED]: new FormStatusIsSummited(),
  [EKYCStatus.PENDING]: new FormStatusIsPending(),
  [EKYCStatus.FAILED]: new FormStatusIsFailed(),
  [EKYCStatus.REJECTED]: new FormStatusIsRejected(),
  [EKYCStatus.VERIFIED]: new FormStatusIsVerified(),
  [EKYCStatus.CANCELED]: new FormStatusIsCanceled()
}
