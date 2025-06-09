import catchAsync from '../../../utils/catchAsync';

const createLmuGoal = catchAsync(async (req, res) => {
  const user = req.user;
});

export const lmuGoalsController = {
  createLmuGoal,
};
