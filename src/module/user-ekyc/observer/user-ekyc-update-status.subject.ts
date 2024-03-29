import {
  AggregateUserEKYCVerifiedObserver,
  IObserver, UpdateEKYCStatusPushNotificationObserver,
  UpdateEKYCStatusSendAuditLogObserver,
} from '@module/user-ekyc/observer/user-ekyc-update-status.observer';
import { EKYCStatus } from '@module/user-ekyc/user-ekyc.type';

/**
 * The Subject interface declares a set of methods for managing subscribers.
 */
export interface IEKYCStatusSubject {
  // Attach an observer to the subject.
  attach(observer: IObserver): void;

  // Detach an observer from the subject.
  detach(observer: IObserver): void;

  // Notify all observers about an event.
  notify(): void;

  changeStatus(userId: number, to: EKYCStatus): void;
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */
export class EKYCStatusSubject implements IEKYCStatusSubject {
  /**
   * @type {number} For the sake of simplicity, the Subject's state, essential
   * to all subscribers, is stored in this variable.
   */
  public userId: number;
  public updateStatusTo: EKYCStatus;

  /**
   * @type {IObserver[]} List of subscribers. In real life, the list of
   * subscribers can be stored more comprehensively (categorized by event
   * type, etc.).
   */
  private observers: IObserver[] = [];

  /**
   * The subscription management methods.
   */
  public attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }

    this.observers.push(observer);
  }

  public detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
  }

  /**
   * Trigger an update in each subscriber.
   */
  public notify(): void {
    console.log('Subject: Notifying observers...');
    for (const observer of this.observers) {
      observer.statusUpdated(this);
    }
  }

  /**
   * Usually, the subscription logic is only a fraction of what a Subject can
   * really do. Subjects commonly hold some important business logic, that
   * triggers a notification method whenever something important is about to
   * happen (or after it).
   */
  public changeStatus(userId: number, updateStatusTo: EKYCStatus): void {
    this.userId = userId;
    this.updateStatusTo = updateStatusTo;
    console.log(`Subject: My state has just changed to: ${this.updateStatusTo}`);
    this.notify();
  }
}

/**
 * Apply Observer pattern
 * @param userId
 * @param status
 * @private
 */
export function applyObserverPattern(userId: number, status: EKYCStatus): void {
  // Int subject
  const subject: IEKYCStatusSubject = new EKYCStatusSubject();

// Int observers
  const sendAuditLogObserver = new UpdateEKYCStatusSendAuditLogObserver();
  const pushNotificationObserver = new UpdateEKYCStatusPushNotificationObserver();
  const aggregateVerifiedObserver = new AggregateUserEKYCVerifiedObserver();

// Int Attach observers to subject
  subject.attach(sendAuditLogObserver);
  subject.attach(pushNotificationObserver);
  subject.attach(aggregateVerifiedObserver);

// Update status to subject
  subject.changeStatus(userId, status);
}
