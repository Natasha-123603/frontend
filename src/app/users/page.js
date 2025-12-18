"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import StatusPill from "@/components/common/StatusPill";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import { useDashboard } from "@/components/layout/DashboardShell";
import { getAllUsers, deleteUser as deleteUserApi } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";

const formatPermissions = (permissions) =>
  (permissions ?? [])
    .map((permission) =>
      typeof permission === "string" ? permission : permission?.name ?? ""
    )
    .filter(Boolean);

export default function UsersPage() {
  const { role } = useDashboard();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [userPendingDelete, setUserPendingDelete] = useState(null);

  useEffect(() => {
    if (role !== "Admin" || !isAuthenticated) {
      return;
    }

    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllUsers();
        if (isMounted) {
          setUsersData(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load users");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [role, isAuthenticated]);

  const handleDeleteUser = async (userId) => {
    try {
      setIsDeletingId(userId);
      await deleteUserApi(userId);
      setUsersData((prev) =>
        prev.filter((user) => (user.id || user._id) !== userId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete user");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userPendingDelete) return;
    const userId = userPendingDelete.id || userPendingDelete._id;
    await handleDeleteUser(userId);
    setUserPendingDelete(null);
  };

  const rows = usersData.map((user, index) => {
    const permissionLabels = formatPermissions(user.permissions);
    const userId = user.id || user._id || `user-${index}`;

    return {
      id: userId,
      cells: [
        user.name,
        user.email,
        user.role,
        <div key={`permissions-${userId}`} className="flex flex-wrap gap-1">
          {permissionLabels.length > 0 ? (
            permissionLabels.map((permission, permIndex) => (
              <span
                key={`${userId}-permission-${permIndex}-${permission}`}
                className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {permission}
              </span>
            ))
          ) : (
            <span className="text-xs uppercase tracking-wide text-slate-400">
              None
            </span>
          )}
        </div>,
        <StatusPill key={`status-${userId}`} label={user.status || "Active"} />,
        <div className="flex items-center gap-3" key={`actions-${userId}`}>
          <button
            className="text-sm text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
            onClick={() => setSelectedUser(user)}
          >
            Edit
          </button>
          <button
            className="text-sm text-rose-500 underline-offset-2 hover:text-rose-700 hover:underline disabled:opacity-50"
            disabled={isDeletingId === userId}
            onClick={() => setUserPendingDelete(user)}
          >
            {isDeletingId === userId ? "Deleting..." : "Delete"}
          </button>
        </div>,
      ],
    };
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-slate-600">
        Checking your access…
      </div>
    );
  }

  if (role !== "Admin") {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/80 p-8 text-center text-rose-600">
        This module is limited to Admins. Switch to Admin via the top bar to manage user permissions.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-slate-600">
        Loading users…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/80 p-8 text-center text-rose-600">
        {error}
      </div>
    );
  }

  const selectedPermissions = formatPermissions(selectedUser?.permissions);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">
            Invite teammates, assign roles, and control permissions.
          </p>
        </div>
        <button
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setCreateOpen(true)}
        >
          Invite user
        </button>
      </div>

      <DataTable
        headers={["Name", "Email", "Role", "Permissions", "Status", ""]}
        rows={rows}
      />

      <Modal
        title="Edit user"
        description="Adjust level of access instantly."
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      >
        <FormField label="Full name" defaultValue={selectedUser?.name} />
        <FormField label="Email" defaultValue={selectedUser?.email} />
        <FormField
          label="Role"
          as="select"
          defaultValue={selectedUser?.role}
          options={["Admin", "Manager", "Staff"]}
        />
        <FormField
          label="Permissions (comma separated)"
          defaultValue={selectedPermissions.join(", ")}
        />
      </Modal>

      <Modal
        title="Invite user"
        description="Send an invite with role + permissions."
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        primaryActionLabel="Send invite"
      >
        <FormField label="Full name" placeholder="Teammate" />
        <FormField label="Email" placeholder="team@domain.com" />
        <FormField
          label="Role"
          as="select"
          defaultValue="Manager"
          options={["Admin", "Manager", "Staff"]}
        />
        <FormField
          label="Permissions"
          as="select"
          defaultValue="properties"
          options={["properties", "bookings", "payments", "tasks", "users"]}
        />
      </Modal>

      <Modal
        title="Delete user"
        description={`Are you sure you want to delete ${userPendingDelete?.name || "this user"}?`}
        isOpen={Boolean(userPendingDelete)}
        onClose={() => setUserPendingDelete(null)}
        primaryActionLabel="Delete"
        primaryAction={handleConfirmDelete}
      >
        <p className="text-sm text-slate-500">
          This action cannot be undone. The user will lose access immediately.
        </p>
      </Modal>
    </div>
  );
}
 
