"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Mail,
  Phone,
  MessageCircle,
  ListChecks,
  RefreshCw,
} from "lucide-react";

const FilterTasks = ({
  setFilterQuery,
  setCurrentPage,
}: {
  setFilterQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}) => {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const applyFilter = () => {
    let query = "";
    if (type !== "all") query += `&type=${type}`;
    if (status !== "all") query += `&status=${status}`;
    setFilterQuery(query);
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setType("all");
    setStatus("all");
    setFilterQuery("");
    setCurrentPage(1);
  };

  // Custom mapping for label without icon in placeholder
  const typeLabelMap: Record<string, string> = {
    all: "All Types",
    whatsapp: "WhatsApp",
    calling: "Calling",
    email: "Email",
  };

  return (
    <div className="w-full flex justify-end mb-4">
      <div className="flex flex-nowrap gap-2 items-center">
        {/* Type Filter */}
        <div className="w-9 sm:w-[180px]">
          <Select value={type} onValueChange={(value) => setType(value)}>
            <SelectTrigger className="w-full px-2 sm:px-4 [&>svg:last-child]:hidden sm:[&>svg:last-child]:inline">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline ml-2">
                {typeLabelMap[type]}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="whatsapp">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp
                </div>
              </SelectItem>
              <SelectItem value="calling">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Calling
                </div>
              </SelectItem>
              <SelectItem value="email">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Email
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-9 sm:w-[180px]">
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full px-2 sm:px-4 [&>svg:last-child]:hidden sm:[&>svg:last-child]:inline">
              <ListChecks className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline ml-2">
                <SelectValue placeholder="Task Status" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <Button
            onClick={applyFilter}
            className="bg-primary text-white shadow px-2 sm:px-4"
          >
            <span className="sm:inline">Apply</span>
            <Filter className="sm:hidden w-4 h-4" />
          </Button>
          <Button
            onClick={resetFilter}
            variant="ghost"
            className="text-muted-foreground px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Reset</span>
            <RefreshCw className="sm:hidden w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterTasks;
