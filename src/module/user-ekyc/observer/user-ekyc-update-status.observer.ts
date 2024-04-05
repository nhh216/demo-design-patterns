import {
  UpdateStatusSubject,
  IEKYCStatusSubject
} from '../observer/user-ekyc-update-status.subject';

/**
 * The Observer interface declares the update method, used by subjects.
 */
export interface IObserver {
  // Receive update from subject.
  statusUpdated(subject: IEKYCStatusSubject): void;
}

/**
 * Concrete Observers react to the updates issued by the Subject they had been
 * attached to.
 */
export class SendAuditLogObserver implements IObserver {
  public statusUpdated(subject: IEKYCStatusSubject): void {
    if (subject instanceof UpdateStatusSubject) {
      console.log('-------------------- SendAuditLogObserver --------------------');
      console.log(`Update EKYC for user_id: ${subject.userId} status to: ${subject.updateStatusTo}`);
      console.log('Send audit log to the system.');
    }
  }
}

export class PushNotificationObserver implements IObserver {
  public statusUpdated(subject: IEKYCStatusSubject): void {
    if (subject instanceof UpdateStatusSubject) {
      console.log('-------------------- PushNotificationObserver --------------------');
      console.log(`Update EKYC for user_id: ${subject.userId} status to: ${subject.updateStatusTo}`);
      console.log('Push notification for user about EKYC status updated.');
    }
  }
}

export class AggregateUserVerifiedObserver implements IObserver {
  public statusUpdated(subject: IEKYCStatusSubject): void {
    if (subject instanceof UpdateStatusSubject) {
      console.log('-------------------- AggregateUserVerifiedObserver --------------------');
      console.log(`Update EKYC for user_id: ${subject.userId} status to: ${subject.updateStatusTo}`);
      console.log(`Aggregate total user EKYC - ${subject.updateStatusTo}`);
    }
  }
}
