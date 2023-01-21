export interface User {
  _id: string;
  stripe_id: string;
  number: string;
  name: string;
  email: string;
  createdAt: string;
}

export const isUser = (user: any): user is User => {
  const unsafeCast = user as User;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.stripe_id !== undefined &&
    unsafeCast.number !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.email !== undefined &&
    unsafeCast.createdAt !== undefined
  );
};
