import {
  getAllUsersModel,
  getUserByTokenModel,
} from '../models/usersModels.js';

function getAllUsersService() {
  return getAllUsersModel();
}

async function getUserByTokenService(currentUserInfo) {
  const user = await getUserByTokenModel(currentUserInfo);
  const userInfo = {
    userName: user.name,
    role: user.role,
    totalPoint: user.total_points,
  };
  return userInfo;
}

export { getAllUsersService, getUserByTokenService };
