import React from "react";
import type { User } from "next-auth";

type Props = {
  user: User;
};
function UserCard({ user }: Props) {
  return <div>UserCard</div>;
}

export default UserCard;
