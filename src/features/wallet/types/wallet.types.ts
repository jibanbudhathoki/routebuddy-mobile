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
  // Support both backend API format (totalBalance, withdrawable, pendingEscrow)
  // and documentation format (balance, pendingEscrow)
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

export function mapApiWalletActivity(item: ApiWalletActivity): WalletActivity {
  const isPositive = item.type === "credit" || item.type === "earnings";
  const isWithdrawal = item.type === "withdrawal" || item.type === "debit";
  
  let dateFormatted = "Recent";
  if (item.createdAt) {
    try {
      dateFormatted = new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      dateFormatted = "Recent";
    }
  }

  return {
    id: item.id,
    title: item.description || (isWithdrawal ? "Withdrawal" : "Earnings"),
    date: dateFormatted,
    category: isWithdrawal ? "Withdrawal" : "Earnings",
    amount: Math.abs(item.amount || 0),
    isPositive,
    status: item.status === "pending" ? "pending" : "completed",
    type: isWithdrawal ? "withdrawal" : "earnings",
  };
}
