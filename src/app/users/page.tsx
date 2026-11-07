"use client";

import React, { useState } from "react";
import { MOCK_USERS } from "@/lib/mock/data/users.mock";
import { User, UserRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { useRoleStore } from "@/store/roleStore";
import {
  UserCog,
  Plus,
  Search,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building,
  Key,
  Users,
} from "lucide-react";

export default function UserManagementPage() {
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"directory" | "permissions">("directory");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "RECRUITER" as UserRole,
    department: "Talent Acquisition",
  });

  const filtered = usersList.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    };
    setUsersList([...usersList, created]);
    setIsAddUserOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "RECRUITER",
      department: "Talent Acquisition",
    });
  };

  const PERMISSION_MATRIX = [
    { module: "Dashboard Overview", super: true, tenant: true, hr: true, recruiter: true, author: true, analyst: true, candidate: false },
    { module: "Assessment Management & Creation", super: true, tenant: true, hr: true, recruiter: false, author: true, analyst: false, candidate: false },
    { module: "Question Bank & Scoring Authoring", super: true, tenant: true, hr: false, recruiter: false, author: true, analyst: false, candidate: false },
    { module: "AI Question Synthesis Engine", super: true, tenant: true, hr: true, recruiter: false, author: true, analyst: false, candidate: false },
    { module: "Candidate Management & Invitations", super: true, tenant: true, hr: true, recruiter: true, author: false, analyst: false, candidate: false },
    { module: "Comprehensive Evaluation Reports", super: true, tenant: true, hr: true, recruiter: true, author: false, analyst: true, candidate: false },
    { module: "Candidate Head-to-Head Comparison", super: true, tenant: true, hr: true, recruiter: true, author: false, analyst: true, candidate: false },
    { module: "Platform Analytics & Psychometric Science", super: true, tenant: true, hr: true, recruiter: false, author: false, analyst: true, candidate: false },
    { module: "Integrity Telemetry Diagnostic", super: true, tenant: true, hr: true, recruiter: true, author: false, analyst: true, candidate: false },
    { module: "Tenant & User Admin Control", super: true, tenant: true, hr: false, recruiter: false, author: false, analyst: false, candidate: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              User Management & Access Control
            </h1>
            <Badge variant="purple" className="text-xs">
              Role-Based Access Control (RBAC)
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Administer organizational team members, psychometric authors, recruiters, and role permission matrices.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsAddUserOpen(true)} className="gap-1.5 shadow-sm">
          <Plus className="h-3.5 w-3.5" />
          <span>Add User</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "directory"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          User Directory ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "permissions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Role Permissions Matrix
        </button>
      </div>

      {activeTab === "directory" ? (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, or role..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Department / Tenant</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-slate-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="purple" className="text-[10px]">
                          {user.role.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {user.department || user.tenantName || "Corporate"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success" className="text-[10px]">
                          Active
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                          Edit Role
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Permissions Matrix */
        <Card className="p-6">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Enterprise Role Permission Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Access privilege enforcement mapped across the 7 application roles.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="py-2.5 px-3 font-bold">Platform Capability</th>
                  <th className="py-2.5 px-3 text-center font-bold">Super Admin</th>
                  <th className="py-2.5 px-3 text-center font-bold">Tenant Admin</th>
                  <th className="py-2.5 px-3 text-center font-bold">HR Manager</th>
                  <th className="py-2.5 px-3 text-center font-bold">Recruiter</th>
                  <th className="py-2.5 px-3 text-center font-bold">Author</th>
                  <th className="py-2.5 px-3 text-center font-bold">Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {PERMISSION_MATRIX.map((row) => (
                  <tr key={row.module} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {row.module}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.super ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.tenant ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.hr ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.recruiter ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.author ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.analyst ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <Modal
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          title="Add New Platform Team Member"
          description="Provision a new user account with designated role-based permissions."
          size="md"
        >
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name *
              </label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                placeholder="e.g. Rachel Adams"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                placeholder="rachel.adams@company.com"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assign User Role *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as UserRole })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="HR_MANAGER">HR Manager</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="ASSESSMENT_AUTHOR">Assessment Author</option>
                  <option value="ANALYST">Psychometric Analyst</option>
                  <option value="TENANT_ADMIN">Tenant Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department
                </label>
                <Input
                  value={newUser.department}
                  onChange={(e) =>
                    setNewUser({ ...newUser, department: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddUserOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Provision User
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

