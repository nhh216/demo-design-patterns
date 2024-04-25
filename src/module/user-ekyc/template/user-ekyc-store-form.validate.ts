import { UserModel } from '../user-ekyc.dto';
import { UserEKYCModel } from '../user-ekyc.model';
import { EKYCFormData, EKYCStatus } from '../user-ekyc.type';

/**
 * ----- Template Method
 * Template Method is a behavioral design pattern that defines the skeleton of an algorithm, business logic ...
 * in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.
 * - Structure of Template Method pattern:
 *  + Abstract Class declares methods that act as steps
 *  + Concrete Class implements these steps and can override some steps, but not the template method
 * In here I defined template for validate form data with 2 case and do validate step by step by order
 * have defined in parent abstract class.
 */
export abstract class StoreFormValidateTemplateAbs {
  /**
   * Template method - Subclass cannot override this method
   * The template method defines the skeleton of an algorithm or bz logic.
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
  }

  protected formDataValidate(payload: EKYCFormData): void {}

  protected userIsVerified(user: UserModel): void {
    if (user.isVerified) {
      throw new Error('User is verified');
    }
  }

  protected validateExistedEKYCData(latestForm: UserEKYCModel): void {
    if (
      latestForm &&
      (latestForm.status === EKYCStatus.DRAFT || latestForm.status === EKYCStatus.SUBMITTED)
    ) {
      throw new Error('Form existed wait for processing');
    }
  }
}

// With save draft form validator will not validate anything
export class SaveDraftFormValidator extends StoreFormValidateTemplateAbs {
  protected formDataValidate(payload: EKYCFormData): void {
    console.log('Status is draft no need validate anything');
  }
}

// With save draft form status is submitted and validate all required fields
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
};
