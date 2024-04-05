import { storeDataObserver } from '../observer/user-ekyc-update-status.subject';
import { validatorTemplateFactory } from '../template/user-ekyc-store-form.validate';
import { UserModel } from '../user-ekyc.dto';
import { UserEKYCModel } from '../user-ekyc.model';
import { IUserEKYCRepository } from '../user-ekyc.repository';
import { EKYCStatus } from '../user-ekyc.type';

import { storeStrategyFactory } from '../strategy/user-ekyc-store-data.strategy';

/**
 * The Command interface declares a method for executing a command.
 */
interface Command {
  execute(): void | Promise<void | UserEKYCModel>;
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
    console.log('2.1.1 ---- Select strategy for validate form data');
    const validator = validatorTemplateFactory[this.payload.status];
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
  public async execute(): Promise<UserEKYCModel> {
    console.log('2.2.1 ---- Select strategy to store data');
    const strategy = storeStrategyFactory[this.payload.status];
    if (!strategy) {
      throw new Error();
    }
    const userEKYC = await strategy.execute(this.userId, this.payload);

    // start transaction
    const tx = {};
    try {
      console.log('Transaction committed');
      return await this.userEKYCRepository.save(userEKYC);
      // commit transaction
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
    storeDataObserver(this.userId, this.status);
  }
}

export class Invoker {
  private onValidate: Command;
  private onStore: Command;
  private onCommitted: Command;

  constructor() {
    console.log('2. Init Invoker class for implement command pattern');
  }
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

  public async doStoreEKYCFormManually(): Promise<void | UserEKYCModel> {
    console.log('2.1 - Invoker: Do validate EKYC form');
    if (this.isCommand(this.onValidate)) {
      await this.onValidate.execute();
    }
    console.log('2.2 - Invoker: Store from to DB');
    if (this.isCommand(this.onStore)) {
      await this.onStore.execute();
    }

    console.log('2.3 - Invoker: Update Subject state for Observer listen');
    if (this.isCommand(this.onCommitted)) {
      return this.onCommitted.execute();
    }
  }

  private isCommand(object): object is Command {
    return object.execute !== undefined;
  }
}
