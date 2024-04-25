import { Request, Response, Router } from 'express';

import { IStoreEKYCUseCase, StoreWith3rdApi } from './use-case/store-user-ekyc.use-case';
import { UpdateStatusUseCase } from './use-case/update-status-use.case';
import { UserEKYCUpdateStatusDto } from './user-ekyc.dto';
import { UserEKYCRepositoryImpl } from './user-ekyc.repository';
import { EKYCFormData } from './user-ekyc.type';

import { StoreFormController, UpdateStatusController } from './user-ekyc.controller';
import { StoreManually } from './use-case/store-user-ekyc.use-case';

const providerEKYCIsAvailable = true;

export const userEKYCRouter = Router();
userEKYCRouter.post('/', store);
userEKYCRouter.post('/change-status', changeStatus);

async function store(req: Request, res: Response): Promise<void> {
  const repo = new UserEKYCRepositoryImpl();
  const storeUseCase = selectStoreUseCaseFactory(repo);
  const controller = new StoreFormController(storeUseCase);
  const body = req.body as EKYCFormData;
  const userId = 1;
  await controller.store(userId, body);
  res.json({
    data: 'Success',
  });
}

async function changeStatus(req: Request, res: Response): Promise<void> {
  const repo = new UserEKYCRepositoryImpl();
  const updateStatusUseCase = new UpdateStatusUseCase(repo);
  const controller = new UpdateStatusController(updateStatusUseCase);
  const body = req.body as UserEKYCUpdateStatusDto;
  await controller.updateStatus(body);
  res.json({
    data: 'Success',
  });
}

/**
 * ----- Simple factory pattern
 * The Simple factory pattern describes a class or function that has one creation method with a large conditional
 * that based on method parameters chooses which use-case class to instantiate and then return.
 */
const selectStoreUseCaseFactory = (repo: UserEKYCRepositoryImpl): IStoreEKYCUseCase => {
  if (providerEKYCIsAvailable) {
    return new StoreWith3rdApi(repo);
  }
  return new StoreManually(repo);
};
