import { IEKYCStatusSubject, StoreFormSubject } from './user-ekyc-update-status.subject';

/**
 * The Observer interface declares the update method, used by subjects.
 */
export interface IStoreDataObserver {
  // Receive update from subject.
  afterCommitted(subject: IEKYCStatusSubject): void;
}

/**
 * Concrete Observers react to the updates issued by the Subject they had been
 * attached to.
 */
export class SendAuditLogObserverForStoreUseCase implements IStoreDataObserver {
  public afterCommitted(subject: IEKYCStatusSubject): void {
    if (subject instanceof StoreFormSubject) {
      console.log('-------------------- SendAuditLogObserverForStoreUseCase --------------------');
      console.log(`Store form for user_id: ${subject.userId} status: ${subject.updateStatusTo}`);
      console.log('Send audit log to the system after store.');
    }
  }
}

export class PushNotificationObserverForStoreUseCase implements IStoreDataObserver {
  public afterCommitted(subject: IEKYCStatusSubject): void {
    if (subject instanceof StoreFormSubject) {
      console.log('-------------------- PushNotificationObserverForStoreUseCase --------------------');
      console.log(`Store form for user_id: ${subject.userId} status : ${subject.updateStatusTo}`);
      console.log('Push notification for User after store.');
      console.log('Push notification for Admin have new eKYC request.');
    }
  }
}

