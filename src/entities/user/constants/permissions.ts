import { Role } from '@/entities/user/domain';

const admins = new Set([Role.SUPER_ADMIN, Role.ADMIN]);
const adminsAndGuides = new Set([Role.SUPER_ADMIN, Role.ADMIN, Role.GUIDE]);
const guides = new Set([Role.GUIDE, Role.SUPER_ADMIN]);
const superAdmin = new Set([Role.SUPER_ADMIN]);

export const permissions: Record<string, Set<string>> = {
  dashboard: new Set([Role.GUIDE, Role.ADMIN, Role.SUPER_ADMIN]),
  getAllUsers: superAdmin,
  deleteUser: superAdmin,
  createTour: guides,
  updateTour: guides,
  createActivity: guides,
  createPosts: admins,
  editPosts: admins,
  deletePost: admins,
  postsJsonFile: superAdmin,
  getActivity: guides,
  uploadFile: adminsAndGuides,
  downloadFile: adminsAndGuides,
  deleteFile: adminsAndGuides,
  getUsersByFiles: admins
};
