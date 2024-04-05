import { EKYCFormData, EKYCStatus } from '../user-ekyc.type';
import { UserEKYCModel } from '../user-ekyc.model';

export abstract class IExecuteStoreFormStrategy {
  protected async executeEKYCData(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    const userEKYC = new UserEKYCModel();
    userEKYC.userId = userId;
    userEKYC.status = payload.status;
    /**
     * Upload image to storage
     */
    console.log('Upload image to storage...... - IExecuteStoreFormStrategy');
    const uploadImage = 'URL string';
    const uploadImage2 = 'URL string';
    const uploadImage3 = 'URL string';
    const uploadImage4 = 'URL string';
    const uploadImage5 = 'URL string';
    payload.identityFrontImage = uploadImage;
    payload.identityBackImage = uploadImage2;
    payload.selfieImage = [uploadImage3, uploadImage4, uploadImage5];
    userEKYC.form = JSON.stringify(payload);
    return userEKYC;
  }

  abstract execute(userId: number, payload: EKYCFormData): Promise<UserEKYCModel>;
}

export class StoreDraftFormStrategy extends IExecuteStoreFormStrategy {
  public async execute(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    return this.executeEKYCData(userId, payload);
  }
}

export class SummitFormWith3rdApiStrategy extends IExecuteStoreFormStrategy {
  public async execute(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    const userEKYC = await this.executeEKYCData(userId, payload);
    /**
     * Send data to 3rd EKYC provider for verification
     * Save log request to DB
     * Response from EKYC provider
     * Can apply Template Method
     */
    console.log('Send verification request to 3rd party API...... - SummitFormWith3rdApiStrategy');
    const result: any = {
      data: {
        status: 'success',
        rate: 0.97,
      },
    };

    /**
     * Default status = FAILED for request failed or  rate < 0.95
     * if request success and rate > 0.95 then status = VERIFIED
     */
    userEKYC.status = EKYCStatus.FAILED;
    if (result.data.status !== 'success') {
      return userEKYC;
    }
    userEKYC.metaData = JSON.stringify({
      reason: result.data.message,
      updateStatusBy: null,
      providerApiResponse: result.data.response,
      version: 1,
    });
    if (result.data.rate > 0.95) {
      userEKYC.status = EKYCStatus.VERIFIED;
      console.log(`Update status to ${EKYCStatus.VERIFIED}........ - SummitFormWith3rdApiStrategy`);
    }
    return userEKYC;
  }
}

export class StoreSummitedFormManuallyStrategy extends IExecuteStoreFormStrategy {
  public async execute(userId: number, payload: EKYCFormData): Promise<UserEKYCModel> {
    return this.executeEKYCData(userId, payload);
  }
}

export const storeStrategyFactory = {
  [EKYCStatus.DRAFT]: new StoreDraftFormStrategy(),
  [EKYCStatus.SUBMITTED]: new SummitFormWith3rdApiStrategy(),
};


export const storeStrategyFactoryManually = {
  [EKYCStatus.DRAFT]: new StoreDraftFormStrategy(),
  [EKYCStatus.SUBMITTED]: new StoreSummitedFormManuallyStrategy(),
};
