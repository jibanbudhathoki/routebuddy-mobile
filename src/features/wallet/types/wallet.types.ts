export interface WalletBalance {
  totalBalance: number;
  withdrawableBalance: number;
  escrowBalance: number;
}

export type ActivityType = "earnings" | "withdrawal";
export type ActivityStatus = "completed" | "pending";

export interface WalletActivity {
  id: string;
  title: string;
  date: string;
  category: string;
  amount: number;
  isPositive: boolean;
  status: ActivityStatus;
  type: ActivityType;
  destination?: string;
}

export interface ApiWalletSummary {
  balance?: number;
  totalBalance?: number;
  withdrawable?: number;
  withdrawableBalance?: number;
  pendingEscrow?: number;
  escrowBalance?: number;
  totalEarned?: number;
  totalWithdrawn?: number;
}

export interface ApiWalletActivity {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  status?: string;
}

export interface WithdrawalRequestItem {
  id: string;
  walletId: string;
  amount: number;
  destinationEmail: string;
  status: "pending" | "paid" | "failed" | string;
  requestedAt: string;
  paidAt?: string | null;
  paidByAdminId?: string | null;
}

export interface ApiWithdrawalRequest {
  amount: number;
  destinationEmail: string;
}

export interface ApiWithdrawalResponse {
  message: string;
  withdrawalId: string;
  amount: number;
  status: string;
}

export interface WithdrawInput {
  email: string;
  amount: number;
}

export interface WithdrawalResult {
  email: string;
  amount: number;
  securityAnswer: string;
  timestamp: string;
}

export function mapApiWalletSummary(data: any): WalletBalance {
  const withdrawable =
    typeof data?.withdrawable === "number"
      ? data.withdrawable
      : typeof data?.withdrawableBalance === "number"
      ? data.withdrawableBalance
      : typeof data?.balance === "number"
      ? data.balance
      : 0;

  const escrow =
    typeof data?.pendingEscrow === "number"
      ? data.pendingEscrow
      : typeof data?.escrowBalance === "number"
      ? data.escrowBalance
      : 0;

  const total =
    typeof data?.totalBalance === "number"
      ? data.totalBalance
      : Number((withdrawable + escrow).toFixed(2));

  return {
    withdrawableBalance: Number(withdrawable.toFixed(2)),
    escrowBalance: Number(escrow.toFixed(2)),
    totalBalance: Number(total.toFixed(2)),
  };
}

export function mapApiWalletActivity(item: any): WalletActivity {
  const isPositive =
    item.type === "credit" ||
    item.reason === "delivery_payout" ||
    item.reason === "reversal";
  const isWithdrawal = item.type === "debit" || item.reason === "withdrawal";

  let title = "Transaction";
  if (item.reason === "delivery_payout") {
    title = item.orderId
      ? `Delivery Payout (#${String(item.orderId).slice(-6)})`
      : "Delivery Payout";
  } else if (item.reason === "withdrawal") {
    title = "Withdrawal Request";
  } else if (item.reason === "reversal") {
    title = "Withdrawal Reversal";
  } else if (item.description) {
    title = item.description;
  } else if (isWithdrawal) {
    title = "Withdrawal";
  } else {
    title = "Earnings";
  }

  let dateFormatted = "Recent";
  const dateField = item.createdAt || item.date || item.requestedAt;
  if (dateField) {
    try {
      dateFormatted = new Date(dateField).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      dateFormatted = "Recent";
    }
  }

  const rawAmount = Number(item.amount);
  const amount = !isNaN(rawAmount) ? Math.abs(rawAmount) : 0;

  return {
    id: item.id || String(Math.random()),
    title,
    date: dateFormatted,
    category: isWithdrawal ? "Withdrawal" : "Earnings",
    amount,
    isPositive,
    status: item.status === "pending" ? "pending" : "completed",
    type: isWithdrawal ? "withdrawal" : "earnings",
  };
}
