"use client";

import UserRow, { type UserRowUser } from "./UserRow";
import UserListSkeleton from "./UserListSkeleton";
import EmptyState from "./EmptyState";

interface UserListProps {
  users: UserRowUser[] | undefined;
  searchTerm?: string;
  onUserClick: (user: UserRowUser) => void;
}

/**
 * Orchestrates the three list states:
 *  - loading  → animated skeleton rows
 *  - empty    → contextual empty-state illustration
 *  - data     → tappable UserRow items
 */
export default function UserList({
  users,
  searchTerm,
  onUserClick,
}: UserListProps) {
  const isLoading = users === undefined;

  return (
    <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-6 space-y-1">
      {isLoading && <UserListSkeleton rows={6} />}

      {!isLoading &&
        users.map((user) => (
          <UserRow key={user.clerkId} user={user} onClick={onUserClick} />
        ))}

      {!isLoading && users.length === 0 && (
        <EmptyState searchTerm={searchTerm} />
      )}
    </div>
  );
}
