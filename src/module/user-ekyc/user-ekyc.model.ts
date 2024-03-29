import { EKYCStatus } from '@module/user-ekyc/user-ekyc.type';

export class UserEKYCModel {
  id: number;
  userId: number;
  form: string; // JSON type EkycFormData
  status: EKYCStatus;
  metaData: string; // JSON type EKYCMetaData
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
