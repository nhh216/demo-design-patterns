
export enum EKYCStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PENDING = 'pending',
  FAILED = 'verify_failed',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export type EKYCFormData = {
  fullName: string;
  birthDate: Date;
  address: string;
  identityNumber: string;
  identityFrontImage: string;
  identityBackImage: string;
  selfieImage: string[];
  status: EKYCStatus;
}

export type EKYCMetaData = {
  reason: string;
  updateStatusBy: number; // User admin id
  providerApiResponse: string; // Response from ekyc service for tracking
  version: 1;
}
