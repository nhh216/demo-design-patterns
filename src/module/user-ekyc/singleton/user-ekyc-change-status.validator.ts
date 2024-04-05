import { EKYCStatus } from '../user-ekyc.type';

export class UserEKYCChangeStatusValidator {
  private static instance: UserEKYCChangeStatusValidator;
  // Use factory instead
  // public validatorStatusMap = {
  //   [EKYCStatus.DRAFT]: this.updateFromDraft,
  //   [EKYCStatus.SUBMITTED]: this.updateFromSubmittedWith3rdApi,
  //   [EKYCStatus.PENDING]: this.updateFromPending,
  //   [EKYCStatus.FAILED]: this.updateFromFailed,
  //   [EKYCStatus.REJECTED]: this.updateFromRejected,
  //   [EKYCStatus.VERIFIED]: this.updateFromVerified,
  // }
  // public validatorStatusMapForManually = {
  //   ...this.validatorStatusMap,
  //   [EKYCStatus.SUBMITTED]: this.updateFromSubmittedWithout3rdApi,
  // }
  constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): UserEKYCChangeStatusValidator {
    if (!UserEKYCChangeStatusValidator.instance) {
      UserEKYCChangeStatusValidator.instance = new UserEKYCChangeStatusValidator();
    }
    return UserEKYCChangeStatusValidator.instance;
  }

  public statusIsDraft(to: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.SUBMITTED];
    if (!allowToUpdate.includes(to)) {
      throw new Error(`Status cannot update from draft to ${to}`);
    }
  }

  public statusIsSubmittedWithout3rdApi(to: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.VERIFIED, EKYCStatus.REJECTED];
    if (!allowToUpdate.includes(to)) {
      throw new Error(`Status cannot update from submitted to ${to}`);
    }
  }

  public statusIsSubmittedWith3rdApi(to: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.VERIFIED, EKYCStatus.PENDING];
    if (!allowToUpdate.includes(to)) {
      throw new Error(`Status cannot update from submitted to ${to}`);
    }
  }

  public statusIdPending(to: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.FAILED, EKYCStatus.VERIFIED];
    if (!allowToUpdate.includes(to)) {
      throw new Error(`Status cannot update from pending to ${to}`);
    }
  }

  public statusIsFailed(to: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.REJECTED, EKYCStatus.VERIFIED];
    if (!allowToUpdate.includes(to)) {
      throw new Error(`Status cannot update from failed to ${to}`);
    }
  }

  public statusIsRejected(): void {
      throw new Error(`Status is ${EKYCStatus.REJECTED} cannot update status`);
  }

  public statusIsVerified(): void {
    throw new Error(`Status is ${EKYCStatus.VERIFIED} cannot update status`);
  }
}
