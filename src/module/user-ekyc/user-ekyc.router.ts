import { NextFunction, Request, Response, Router } from 'express';
import { UserEKYCController } from '@module/user-ekyc/user-ekyc.controller';
import { UserEKYCRepositoryImpl } from '@module/user-ekyc/user-ekyc.repository';
import { UserEKYCUpdateStatusDto } from '@module/user-ekyc/user-ekyc.dto';
import { EKYCFormData } from '@module/user-ekyc/user-ekyc.type';
import { StoreWith3rdApi } from '@module/user-ekyc/use-case/store-user-ekyc-with-3rd-api.use-case';
import { UpdateStatusUseCase } from '@module/user-ekyc/use-case/update-status-use.case';

export const userEKYCRouter = Router();
userEKYCRouter.post('/', store);
userEKYCRouter.post('/change-status', changeStatus);

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
  const repo = new UserEKYCRepositoryImpl();
  const storeUseCase = new StoreWith3rdApi(repo)
  const updateStatusUseCase = new UpdateStatusUseCase(repo)
  const controller = new UserEKYCController(storeUseCase, updateStatusUseCase);
  const body = req.body as EKYCFormData;
  const userId = 1;
  await controller.store(userId, body)
  res.json({
    data: 'Ok',
  });
}

async function changeStatus(req: Request, res: Response): Promise<void> {
  const repo = new UserEKYCRepositoryImpl();
  const storeUseCase = new StoreWith3rdApi(repo)
  const updateStatusUseCase = new UpdateStatusUseCase(repo)
  const controller = new UserEKYCController(storeUseCase, updateStatusUseCase);
  const body = req.body as UserEKYCUpdateStatusDto;
  await controller.updateEKYCFormStatus(body)
  res.json({
    data: 'Success',
  });
}
