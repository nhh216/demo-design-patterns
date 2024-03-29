import { UserEKYCUpdateStatusDto, UserModel } from '@module/user-ekyc/user-ekyc.dto';
import { UserEKYCModel } from '@module/user-ekyc/user-ekyc.model';

export abstract class UserEKYCUpdateStatusValidateTemplate {
  public validate(payload: UserEKYCUpdateStatusDto, form: UserEKYCModel): void {
    this.validatePayload(payload);
    this.validateFormStatus(form);
  }


  protected validatePayload(payload: UserEKYCUpdateStatusDto): void {

  }

  protected validateFormStatus(form: UserEKYCModel): void {

  }

}
