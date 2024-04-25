import {
  AggregateUserVerifiedObserver,
  IObserver, PushNotificationObserver,
  SendAuditLogObserver,
} from './user-ekyc-update-status.observer';
import { EKYCStatus } from '../user-ekyc.type';
import {
  IStoreDataObserver,
  PushNotificationObserverForStoreUseCase,
  SendAuditLogObserverForStoreUseCase,
} from './user-ekyc-store.observer';

/**
 * ---- Observer pattern
 * Observer is a behavioral design pattern that lets you define a subscription mechanism to notify
 * multiple objects about any events that happen to the object they’re observing.
 * - Structure of Observer pattern:
 * + Subject: knows its observers and notifies them automatically of any state changes, usually by calling one of their methods.
 * + Observer: subscriber to the subject to for do something after any state change.
 */

/**
 * The Subject interface declares a set of methods for managing subscribers.
 */
export interface IEKYCStatusSubject {
  // Attach an observer to the subject.
  attach(observer: IObserver | IStoreDataObserver): void;

  // Detach an observer from the subject.
  detach(observer: IObserver | IStoreDataObserver): void;

  // Notify all observers about an event.
  notify(): void;

  stateUpdated(userId: number, to: EKYCStatus): void;
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */
export class UpdateStatusSubject implements IEKYCStatusSubject {
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
  public stateUpdated(userId: number, updateStatusTo: EKYCStatus): void {
    this.userId = userId;
    this.updateStatusTo = updateStatusTo;
    console.log(`Subject: My state has just changed to: ${this.updateStatusTo}`);
    this.notify();
  }
}

/**
 * This is observer subject for store data use-case
 * After data committed form status change will notify to all observers
 */
export class StoreFormSubject implements IEKYCStatusSubject {
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
  private observers: IStoreDataObserver[] = [];

  /**
   * The subscription management methods.
   */
  public attach(observer: IStoreDataObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }

    this.observers.push(observer);
  }

  public detach(observer: IStoreDataObserver): void {
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
      observer.afterCommitted(this);
    }
  }

  /**
   * Usually, the subscription logic is only a fraction of what a Subject can
   * really do. Subjects commonly hold some important business logic, that
   * triggers a notification method whenever something important is about to
   * happen (or after it).
   */
  public stateUpdated(userId: number, updateStatusTo: EKYCStatus): void {
    this.userId = userId;
    this.updateStatusTo = updateStatusTo;
    console.log(`Subject: Stored form and status is: ${this.updateStatusTo}`);
    this.notify();
  }
}

/**
 * Apply Observer pattern
 * @param userId
 * @param status
 * @private
 */
export function updateStatusObserver(userId: number, status: EKYCStatus): void {
  // Int subject
  const subject: IEKYCStatusSubject = new UpdateStatusSubject();

// Int observers
  const sendAuditLogObserver = new SendAuditLogObserver();
  const pushNotificationObserver = new PushNotificationObserver();
  const aggregateVerifiedObserver = new AggregateUserVerifiedObserver();

// Int Attach observers to subject
  subject.attach(sendAuditLogObserver);
  subject.attach(pushNotificationObserver);
  subject.attach(aggregateVerifiedObserver);

// Update status to subject
  subject.stateUpdated(userId, status);
}


export function storeDataObserver(userId: number, status: EKYCStatus): void {
   /**
   * Init StoreFormSubject subject
   */
  const subject: IEKYCStatusSubject = new StoreFormSubject();

  /**
   * Int observers related with store data use-case bz
   */
  const sendAuditLogObserver = new SendAuditLogObserverForStoreUseCase();
  const pushNotificationObserver = new PushNotificationObserverForStoreUseCase();

  /**
   * Attach observers to subject
   */
  subject.attach(sendAuditLogObserver);
  subject.attach(pushNotificationObserver);

  /**
   * Trigger state updated and notify to all observers
   */
  subject.stateUpdated(userId, status);
}
