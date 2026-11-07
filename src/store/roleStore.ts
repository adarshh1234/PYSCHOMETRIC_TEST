import { create } from "zustand";
import { User, UserRole } from "@/types";
import { MOCK_USERS } from "@/lib/mock/data/users.mock";

interface RoleState {
  currentUser: User;
  setRole: (role: UserRole) => void;
  setUser: (user: User) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  currentUser: MOCK_USERS[2]!, // Defaults to HR_MANAGER (Samantha Wright)
  setRole: (role: UserRole) => {
    const user = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0]!;
    set({ currentUser: user });
  },
  setUser: (user: User) => set({ currentUser: user }),
}));

