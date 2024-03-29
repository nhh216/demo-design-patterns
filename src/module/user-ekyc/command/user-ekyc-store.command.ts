import { UserModel } from '@module/user-ekyc/user-ekyc.dto';
import { validatorTemplate } from '@module/user-ekyc/template/user-ekyc-store-form.validate';
import { storeFormWith3rdApiStrategyMap } from '@module/user-ekyc/strategy/user-ekyc-update-status-execute.strategy';
import { IUserEKYCRepository } from '@module/user-ekyc/user-ekyc.repository';
import {
  applyObserverPattern,
  EKYCStatusSubject,
  IEKYCStatusSubject,
} from '@module/user-ekyc/observer/user-ekyc-update-status.subject';
import {
  AggregateUserEKYCVerifiedObserver,
  UpdateEKYCStatusPushNotificationObserver,
  UpdateEKYCStatusSendAuditLogObserver,
} from '@module/user-ekyc/observer/user-ekyc-update-status.observer';
import { EKYCStatus } from '@module/user-ekyc/user-ekyc.type';

/**
 * The Command interface declares a method for executing a command.
 */
interface Command {
  execute(): void;
}

/**
 * Some commands can implement simple operations on their own.
 */
export class ValidateCommand implements Command {
  private readonly user: UserModel;
  private readonly latestForm: any;
  private readonly payload: any;

  constructor(user: UserModel, latestForm: any, payload: any) {
    this.user = user;
    this.latestForm = latestForm;
    this.payload = payload;
  }

  public execute(): void {
    /**
     * Apply template method to validate form
     */
    const validator = validatorTemplate[this.payload.status];
    if (!validator) {
      throw new Error('Error');
    }
    validator.doValidate(this.user, this.latestForm, this.payload);
  }
}

export class StoreCommand implements Command {
  private readonly userId: number;
  private readonly payload: any;
  protected userEKYCRepository: IUserEKYCRepository;

  constructor(userId: number, payload: any, userEKYCRepository: IUserEKYCRepository) {
    this.userId = userId;
    this.payload = payload;
    this.userEKYCRepository = userEKYCRepository;

  }
  /**
   * Commands can delegate to any methods of a receiver.
   */
  public async execute(): Promise<void> {
    const strategy = storeFormWith3rdApiStrategyMap[this.payload.status];
    if (strategy) {
      throw new Error();
    }
    const userEKYC = await strategy.execute(this.userId, this.payload);

    // start transaction
    const tx = {};
    try {
      const currentEntity  = await this.userEKYCRepository.save(userEKYC);
      // commit transaction
      console.log('Transaction committed');
    } catch (e) {
      // throw exception and handle error
      console.log('Transaction rollback');
    }
  }
}

export class CommittedCommand implements Command {
  private readonly userId: number;
  private readonly status: EKYCStatus;

  constructor(userId: number, status: EKYCStatus) {
    this.userId = userId;
    this.status = status;
  }
  public async execute(): Promise<void> {
    applyObserverPattern(this.userId, this.status)
  }
}


export class Invoker {
  private onValidate: Command;
  private onStore: Command;
  private onCommitted: Command;
  /**
   * Initialize commands.
   */
  public setOnValidate(command: Command): void {
    this.onValidate = command;
  }

  public setOnStore(command: Command): void {
    this.onStore = command;
  }

  public setOnCommitted(command: Command): void {
    this.onCommitted = command;
  }

  public async doStoreEKYCFormManually(): Promise<void> {
    console.log('Invoker: Does anybody want something done before I begin?');
    if (this.isCommand(this.onValidate)) {
     await this.onValidate.execute();
    }
    console.log('Invoker: ...doing something really important...');
    if (this.isCommand(this.onStore)) {
     await this.onStore.execute();
    }
    console.log('Invoker: ...doing something really important...');

    console.log('Invoker: Does anybody want something done after I finish?');
    if (this.isCommand(this.onCommitted)) {
      await this.onCommitted.execute();
    }
  }

  private isCommand(object): object is Command {
    return object.execute !== undefined;
  }
}
