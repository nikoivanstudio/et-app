export type EditableUser = {
  id: number;
  login: string;
  role: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarPhotoId: number | null;
  email: string | null;
  rating: number | null;
};

export type UserEditPayload = Partial<EditableUser> & { id: number };
