"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createNewUser } from "@/services/UserService";
import { TCreateUser } from "@/types/users/user.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const CreateUser = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const [formData, setFormData] = useState<TCreateUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dob: new Date(),
    unit: "LMU",
    role: "",
    status: "active",
  });

  useEffect(() => setMounted(true), []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createNewUser(formData);
      if (response?.success) {
        toast.success("User created successfully!");
        router.push(`/${user?.role.toLocaleLowerCase()}/users`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const selectStyle = `w-full mt-1 px-3 py-2 border rounded-md transition-colors duration-200 ${
    isDark
      ? "bg-black/20 text-white border-neutral-700"
      : "bg-white/60 text-black border-neutral-300"
  }`;

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;
  if (loading)
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <Skeleton className="h-10 w-3/4 mx-auto rounded-md mb-6" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        <h1 className="text-3xl font-bold mb-6">Create User</h1>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label>Unit</Label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={selectStyle}
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

            <div className="space-y-2">
              <Label>Role</Label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={selectStyle}
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
          </div>

          <Button type="submit" className="w-full mt-6">
            Create User
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
