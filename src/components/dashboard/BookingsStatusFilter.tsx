'use client';

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Select } from "@/components/ui/Select";

type StatusOption = { value: string; label: string };

type BookingsStatusFilterProps = {
  selectedStatus: string;
  options: ReadonlyArray<StatusOption>;
  label: string;
  allLabel: string;
};

export function BookingsStatusFilter({ selectedStatus, options, label, allLabel }: BookingsStatusFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(selectedStatus);

  return (
    <Select
      id="booking-status"
      name="status"
      label={label}
      placeholder={allLabel}
      options={options}
      value={currentStatus}
      onChange={(event) => {
        const status = event.target.value;
        setCurrentStatus(status);
        router.push(status ? `${pathname}?status=${encodeURIComponent(status)}` : pathname, { scroll: false });
      }}
    />
  );
}
