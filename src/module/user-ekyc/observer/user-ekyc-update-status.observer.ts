import {
  EKYCStatusSubject,
  IEKYCStatusSubject
} from '@module/user-ekyc/observer/user-ekyc-update-status.subject';

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
export class UpdateEKYCStatusSendAuditLogObserver implements IObserver {
  public statusUpdated(subject: IEKYCStatusSubject): void {
    if (subject instanceof EKYCStatusSubject) {
      console.log('-------------------- UpdateEKYCStatusSendAuditLogObserver --------------------');
      console.log(`Update EKYC for user_id: ${subject.userId} status to: ${subject.updateStatusTo}`);
      console.log('Send audit log to the system.');
    }
  }
}

export class UpdateEKYCStatusPushNotificationObserver implements IObserver {
  public statusUpdated(subject: IEKYCStatusSubject): void {
    if (subject instanceof EKYCStatusSubject) {
      console.log('-------------------- UpdateEKYCStatusPushNotificationObserver --------------------');
      console.log(`Update EKYC for user_id: ${subject.userId} status to: ${subject.updateStatusTo}`);
      console.log('Push notification for user about EKYC status updated.');
    }
  }
}

export class AggregateUserEKYCVerifiedObserver implements IObserver {
  public statusUpdated(subject: IEKYCStatusSubject): void {
    if (subject instanceof EKYCStatusSubject) {
      console.log('-------------------- UpdateEKYCStatusPushNotificationObserver --------------------');
      console.log(`Update EKYC for user_id: ${subject.userId} status to: ${subject.updateStatusTo}`);
      console.log('Aggregate total user EKYC verified.');
    }
  }
}
