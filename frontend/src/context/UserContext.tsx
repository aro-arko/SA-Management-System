"use client";

import { getCurrentUser } from "@/services/AuthService";
import { IUser } from "@/types/users/user.type";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const justLoggedIn = localStorage.getItem("justLoggedIn") === "true";

    const fetchUser = async () => {
      try {
        const payload = await getCurrentUser();

        if (
          payload &&
          typeof payload === "object" &&
          "email" in payload &&
          "role" in payload
        ) {
          setUser(payload as IUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        if (!user) {
          window.location.reload();
        }
      } finally {
        setIsLoading(false);
        if (justLoggedIn) localStorage.removeItem("justLoggedIn");
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
