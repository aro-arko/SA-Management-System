"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserDetailsById, editUserDetails } from "@/services/UserService";
import { TUserDetails } from "@/types/users/user.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const EditUser = () => {
  const { id } = useParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<TUserDetails>({
    _id: "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: new Date(),
    unit: "",
    role: "",
    email: "",
    status: "",
    password: "",
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserDetailsById(id as string);
      if (res?.data) setFormData(res.data);
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await editUserDetails(id as string, formData);
    console.log(res);
    if (res?.data) {
      toast.success("User updated successfully!");
      router.push(`/coordinator/users/${id}`);
    } else {
      toast.error("Failed to update user. Please try again.");
    }
  };

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;
  if (loading)
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <Skeleton className="h-10 w-3/4 mx-auto rounded-md mb-6" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );

  const selectThemeClass = isDark
    ? "bg-black/20 text-white border-neutral-700"
    : "bg-white/60 text-black border-neutral-300";

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      {/* Prevent Tailwind from purging these classes */}
      <div className="hidden">
        bg-black/20 bg-white/60 text-white text-black border-neutral-700
        border-neutral-300
      </div>

      <div className="max-w-full mx-auto space-y-10">
        <h1 className="text-3xl font-bold mb-6">Edit User</h1>
        <form
          onSubmit={handleSubmit}
          className={`rounded-xl p-6 border space-y-6 ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                name="dob"
                type="date"
                value={
                  formData.dob
                    ? typeof formData.dob === "string"
                      ? (formData.dob as string).slice(0, 10)
                      : formData.dob instanceof Date
                      ? formData.dob.toISOString().slice(0, 10)
                      : ""
                    : ""
                }
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Unit</Label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md transition-colors duration-200 ${selectThemeClass}`}
              >
                <option className="dark:bg-black dark:text-white" value="LMU">
                  LMU
                </option>
                <option className="dark:bg-black dark:text-white" value="EMU">
                  EMU
                </option>
                <option className="dark:bg-black dark:text-white" value="DSMM">
                  DSMM
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="HR_FINANCE"
                >
                  HR_FINANCE
                </option>
                <option className="dark:bg-black dark:text-white" value="ALL">
                  ALL
                </option>
              </select>
            </div>

            <div>
              <Label>Role</Label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md transition-colors duration-200 ${selectThemeClass}`}
              >
                <option
                  className="dark:bg-black dark:text-white"
                  value="coordinator"
                >
                  Coordinator
                </option>
                <option className="dark:bg-black dark:text-white" value="head">
                  Head
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="lmuAdmin"
                >
                  LMU Admin
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="lmuDataLeader"
                >
                  LMU Data Leader
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="lmuMember"
                >
                  LMU Member
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="emuAdmin"
                >
                  EMU Admin
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="emuMember"
                >
                  EMU Member
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="dsmmAdmin"
                >
                  DSMM Admin
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="hrFinanceAdmin"
                >
                  HR/Finance Admin
                </option>
              </select>
            </div>

            <div>
              <Label>Status</Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md transition-colors duration-200 ${selectThemeClass}`}
              >
                <option
                  className="dark:bg-black dark:text-white"
                  value="active"
                >
                  Active
                </option>
                <option
                  className="dark:bg-black dark:text-white"
                  value="inactive"
                >
                  Inactive
                </option>
              </select>
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full">
            Update User
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
