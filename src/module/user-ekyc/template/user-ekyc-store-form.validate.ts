import { EKYCFormData, EKYCStatus } from '@module/user-ekyc/user-ekyc.type';
import { UserModel } from '@module/user-ekyc/user-ekyc.dto';
import { UserEKYCModel } from '@module/user-ekyc/user-ekyc.model';

export abstract class StoreFormValidateTemplateAbs {
  /**
   * The template method defines the skeleton of an algorithm.
   */
  public doValidate(user: UserModel, latestForm: UserEKYCModel, payload: EKYCFormData): void {
    this.formStatusValidate(payload);
    this.formDataValidate(payload);
    this.userIsVerified(user);
    this.validateExistedEKYCData(latestForm);
  }

  protected formStatusValidate(payload: EKYCFormData): void {
    const allowToUpdate = [EKYCStatus.SUBMITTED, EKYCStatus.DRAFT];
    if (!allowToUpdate.includes(payload.status)) {
      throw new Error(`Status form fro store invalid`);
    }
  };

  protected formDataValidate(payload: EKYCFormData): void {
    console.log('Status is draft no need validate anything');
  };

  protected userIsVerified(user: UserModel): void {
    if (user.isVerified) {
      throw new Error('User is verified');
    }
  }

  protected validateExistedEKYCData(latestForm: UserEKYCModel): void {
    if (latestForm.status === EKYCStatus.DRAFT || latestForm.status === EKYCStatus.SUBMITTED) {
      throw new Error('Form existed wait for processing');
    }
  };
}


export class SaveDraftFormValidator extends StoreFormValidateTemplateAbs {
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

export const validatorTemplate = {
  [EKYCStatus.DRAFT]: new SaveDraftFormValidator(),
  [EKYCStatus.SUBMITTED]: new SubmitFormValidator(),
}
