import { EKYCFormData, EKYCStatus } from '@module/user-ekyc/user-ekyc.type';

export class UserEKYCChangeStatusValidator {
  private static instance: UserEKYCChangeStatusValidator;
  public validateStatusMapFunction = {
    [EKYCStatus.DRAFT]: this.updateFromDraft,
    [EKYCStatus.SUBMITTED]: this.updateFromSubmittedWith3rdApi,
    [EKYCStatus.PENDING]: this.updateFromPending,
    [EKYCStatus.FAILED]: this.updateFromFailed,
    [EKYCStatus.REJECTED]: this.updateFromRejected,
    [EKYCStatus.VERIFIED]: this.updateFromVerified,
    [EKYCStatus.CANCELED]: this.updateFromCanceled,
  }
  constructor() {}

  public static getInstance(): UserEKYCChangeStatusValidator {
    if (!UserEKYCChangeStatusValidator.instance) {
      UserEKYCChangeStatusValidator.instance = new UserEKYCChangeStatusValidator();
    }
    return UserEKYCChangeStatusValidator.instance;
  }

  public updateFromDraft(status: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.SUBMITTED, EKYCStatus.CANCELED];
    if (!allowToUpdate.includes(status)) {
      throw new Error(`Status cannot update from draft to ${status}`);
    }
  }

  public updateFromSubmittedWithout3rdApi(status: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.VERIFIED, EKYCStatus.VERIFIED, EKYCStatus.CANCELED];
    if (!allowToUpdate.includes(status)) {
      throw new Error(`Status cannot update from submitted to ${status}`);
    }
  }

  public updateFromSubmittedWith3rdApi(status: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.VERIFIED, EKYCStatus.PENDING, EKYCStatus.CANCELED];
    if (!allowToUpdate.includes(status)) {
      throw new Error(`Status cannot update from submitted to ${status}`);
    }
  }

  public updateFromPending(status: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.FAILED, EKYCStatus.VERIFIED];
    if (!allowToUpdate.includes(status)) {
      throw new Error(`Status cannot update from pending to ${status}`);
    }
  }

  public updateFromFailed(status: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.REJECTED, EKYCStatus.VERIFIED];
    if (!allowToUpdate.includes(status)) {
      throw new Error(`Status cannot update from failed to ${status}`);
    }
  }

  public updateFromRejected(): void {
      throw new Error(`Status is ${EKYCStatus.REJECTED} cannot update status`);
  }

  public updateFromVerified(): void {
    throw new Error(`Status is ${EKYCStatus.VERIFIED} cannot update status`);
  }

  public updateFromCanceled(): void {
    throw new Error(`Status is ${EKYCStatus.CANCELED} cannot update status`);
  }
}
