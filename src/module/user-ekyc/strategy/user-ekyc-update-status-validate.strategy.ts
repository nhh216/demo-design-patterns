import { EKYCStatus } from '../user-ekyc.type';

/**
 * ----- Strategy pattern
 * Strategy is a behavioral design pattern that lets you define a family of algorithms or logic,
 * put each of them into a separate class, and make them interchangeable.
 */
export abstract class IValidateEKYCStatusStrategy {
  abstract validate(status: EKYCStatus): Promise<any>;
}

export class ValidateStrategyContext {

  private strategy: IValidateEKYCStatusStrategy;

  constructor(strategy: IValidateEKYCStatusStrategy) {
    this.strategy = strategy;
  }

  public doValidate(newStatus: EKYCStatus): void {
    const result = this.strategy.validate(newStatus);
  }
}

export class StatusIsDraft extends IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const allowToUpdate = [EKYCStatus.SUBMITTED];
    if (!allowToUpdate.includes(newStatus)) {
      throw new Error(`Status cannot update from draft to ${newStatus}`);
    }
  }
}

export class StatusIsSummited extends IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const allowToUpdate = [EKYCStatus.VERIFIED, EKYCStatus.PENDING];
    if (!allowToUpdate.includes(newStatus)) {
      throw new Error(`Status cannot update from submitted to ${newStatus}`);
    }
  }
}

export class StatusIsSummitedByManually extends IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const allowToUpdate = [EKYCStatus.VERIFIED, EKYCStatus.REJECTED];
    if (!allowToUpdate.includes(newStatus)) {
      throw new Error(`Status cannot update from submitted to ${newStatus}`);
    }
  }
}

export class StatusIsPending extends IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const allowToUpdate = [EKYCStatus.FAILED, EKYCStatus.VERIFIED];
    if (!allowToUpdate.includes(newStatus)) {
      throw new Error(`Status cannot update from pending to ${newStatus}`);
    }
  }
}

export class StatusIsFailed extends IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    const allowToUpdate = [EKYCStatus.REJECTED, EKYCStatus.VERIFIED];
    if (!allowToUpdate.includes(newStatus)) {
      throw new Error(`Status cannot update from failed to ${newStatus}`);
    }
  }
}

export class StatusIsRejected extends IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    throw new Error(`Status is ${EKYCStatus.REJECTED} cannot update status`);
  }
}

export class StatusIsVerified extends IValidateEKYCStatusStrategy {
  public async validate(newStatus: EKYCStatus): Promise<any> {
    throw new Error(`Status is ${EKYCStatus.VERIFIED} cannot update status`);
  }
}
