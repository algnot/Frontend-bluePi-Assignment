export const displayMoney = (value: number): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getStatusBadge = (status: string): string => {
  if (!status) return "";

  let badgeColor = "";
  switch (status.toLocaleLowerCase()) {
    case "created":
      badgeColor = "bg-yellow-500";
      break;
    case "paid":
      badgeColor = "bg-blue-500";
      break;
    default:
      badgeColor = "bg-red-500";
      break;
  }

  return badgeColor;
};
