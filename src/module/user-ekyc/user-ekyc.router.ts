import { Request, Response, Router } from 'express';

import { StoreWith3rdApi } from './use-case/store-user-ekyc-with-3rd-api.use-case';
import { UpdateStatusUseCase } from './use-case/update-status-use.case';
import { UserEKYCUpdateStatusDto } from './user-ekyc.dto';
import { UserEKYCRepositoryImpl } from './user-ekyc.repository';
import { EKYCFormData } from './user-ekyc.type';

import {
  StoreFormController,
  UpdateStatusController,
} from './user-ekyc.controller';
import { StoreManually } from './use-case/store-user-ekyc-manually.use-case';

const providerEKYCIsAvailable = false;

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

const selectStoreUseCaseFactory = (repo: UserEKYCRepositoryImpl) => {
  if (providerEKYCIsAvailable) {
    return new StoreWith3rdApi(repo);
  }
  return new StoreManually(repo);
};
