import catchAsync from '../../utils/catchAsync';
import { authService } from './auth.service';

const createUser = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await authService.createUser(data);
  res.status(200).json({
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const authController = {
  createUser,
};
