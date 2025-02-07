import clsx from "clsx";
import Image from "next/image";

import { StatusIcon } from "@/constants";
import { AppointmentStatus } from "@prisma/client";

export const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const iconSrc = StatusIcon[status as keyof typeof StatusIcon];
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "APPROVED",
        "bg-blue-600": status === "SCHEDULED",
        "bg-red-600": status === "CANCELED",
      })}
    >
      <Image
        src={iconSrc}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "APPROVED",
          "text-blue-500": status === "SCHEDULED",
          "text-red-500": status === "CANCELED",
        })}
      >
        {status}
      </p>
    </div>
  );
};
