import { storeDataObserver } from '../observer/user-ekyc-update-status.subject';
import { validatorTemplateFactory } from '../template/user-ekyc-store-form.validate';
import { UserModel } from '../user-ekyc.dto';
import { UserEKYCModel } from '../user-ekyc.model';
import { IUserEKYCRepository } from '../user-ekyc.repository';
import { EKYCStatus } from '../user-ekyc.type';

import { storeStrategyFactoryManually } from '../strategy/user-ekyc-store-data.strategy';

/** ----- Command pattern
 * Command is a behavioral design pattern that turns a request into a stand-alone object that contains
 * all information about the request.
 * - Structure of Command pattern:
 *  + Client: Create invoker and set commands to invoker.
 *  + Interface or Abstract (Command): declares a method for executing a command.
 *  + Concrete Command (ValidateCommand, StoreCommand, CommittedCommand): implements simple operations on their own.
 *  + Invoker: asks the command to carry out the request.
 *  * Receiver: knows how to perform (execute) the command. Any class or function do logic on command execute method
 */

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
    // Using simple factory for select template for validate form
    // because user can save form with status is Draft or Submitted
    const validator = validatorTemplateFactory[this.payload.status];
    if (!validator) {
      throw new Error('Error');
    }
    // Command pattern receiver
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
    const strategy = storeStrategyFactoryManually[this.payload.status];
    if (!strategy) {
      throw new Error();
    }
    // Command pattern receiver
    const userEKYC = await strategy.execute(this.userId, this.payload);

    // start transaction
    const tx = {};
    try {
      console.log('Transaction committed and wait admin approve');
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
    // Command pattern receiver
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

  /**
   * Initialize commands.
   */
  public setOnStore(command: Command): void {
    this.onStore = command;
  }

  /**
   * Initialize commands.
   */
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
    return (object.execute !== undefined);
  }
}
