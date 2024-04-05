import { EKYCStatus } from './user-ekyc.type';

export class UserEKYCUpdateStatusDto {
  formId: number;
  status: EKYCStatus;
}

export class UserModel {
  id: number;
  fullName: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
