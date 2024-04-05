import { EKYCFormData, EKYCStatus } from '../user-ekyc.type';
import { UserModel } from '../user-ekyc.dto';
import { UserEKYCModel } from '../user-ekyc.model';

export abstract class StoreFormValidateTemplateAbs {
  /**
   * The template method defines the skeleton of an algorithm.
   */
  public doValidate(user: UserModel, latestForm: UserEKYCModel, payload: EKYCFormData): void {
    this.formStatusValidate(payload.status);
    this.formDataValidate(payload);
    this.userIsVerified(user);
    this.validateExistedEKYCData(latestForm);
  }

  protected formStatusValidate(status: EKYCStatus): void {
    const allowToUpdate = [EKYCStatus.SUBMITTED, EKYCStatus.DRAFT];
    if (!allowToUpdate.includes(status)) {
      throw new Error(`Status form fro store invalid`);
    }
  };

  protected formDataValidate(payload: EKYCFormData): void {};

  protected userIsVerified(user: UserModel): void {
    if (user.isVerified) {
      throw new Error('User is verified');
    }
  }

  protected validateExistedEKYCData(latestForm: UserEKYCModel): void {
    if (latestForm && (latestForm.status === EKYCStatus.DRAFT || latestForm.status === EKYCStatus.SUBMITTED)) {
      throw new Error('Form existed wait for processing');
    }
  };
}


export class SaveDraftFormValidator extends StoreFormValidateTemplateAbs {
  protected formDataValidate(payload: EKYCFormData): void {
    console.log('Status is draft no need validate anything');
  };
}

export class SubmitFormValidator extends StoreFormValidateTemplateAbs {
  protected formDataValidate(payload: EKYCFormData): void {
    if (!payload.fullName) {
      throw new Error('Full name is required');
    }
    if (!payload.birthDate) {
      throw new Error('Birth date is required');
    }
    if (!payload.address) {
      throw new Error('Address is required');
    }
    if (!payload.identityNumber) {
      throw new Error('Identity number is required');
    }
    if (!payload.identityFrontImage) {
      throw new Error('Identity front image is required');
    }
    if (!payload.identityBackImage) {
      throw new Error('Identity back image is required');
    }
    if (!payload.selfieImage) {
      throw new Error('Selfie image is required');
    }
    if (!payload.status) {
      throw new Error('Status is required');
    }
    if (payload.status !== EKYCStatus.SUBMITTED) {
      throw new Error('Status must be submitted');
    }
  }

}

export const validatorTemplateFactory = {
  [EKYCStatus.DRAFT]: new SaveDraftFormValidator(),
  [EKYCStatus.SUBMITTED]: new SubmitFormValidator(),
}
