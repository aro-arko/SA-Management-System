"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllUsers } from "@/services/UserService";
import { TUserDetails } from "@/types/users/user.type";
import Link from "next/link";
import { Pagination } from "@/utils/Pagination";
import UserCard from "../../Users/UserCard";

const AllUsersForDashboard = () => {
  const [users, setUsers] = useState<TUserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const query = `page=${currentPage}&limit=5${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      }`;
      const res = await getAllUsers(query);
      if (res.success) setUsers(res.data);
      else setUsers([]);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`px-4 py-6 transition-colors duration-300 rounded-xl ${
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
          : "bg-white text-black"
      }`}
    >
      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full px-4 py-2 rounded-md border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "bg-black text-white border-neutral-700"
              : "bg-white border-gray-300"
          }`}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-24 w-full rounded-xl ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground text-center">No users found.</p>
      ) : (
        <div>
          {users.map((user) => (
            <Link href={`/coordinator/users/${user._id}`} key={user._id}>
              <UserCard user={user} />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4">
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default AllUsersForDashboard;
