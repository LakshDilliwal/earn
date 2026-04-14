// =============================================================================
// A36 Earn — Commission Engine
// Business Rules:
//   - Bounties: 6% platform fee on sponsor funding amount
//   - Grants:   6% platform fee on sponsor funding amount
//   - Jobs:     0% — always free, never subject to commission
//   - Promo Codes can reduce the fee to 0% (full waiver) or a partial %
// =============================================================================

export const DEFAULT_FEE_PERCENT = 6;
export const JOB_FEE_PERCENT = 0;

export type FeeCalculation = {
  originalAmount: number;
  feePercent: number;
  feeAmount: number;
  totalCharged: number; // originalAmount + feeAmount
  promoCodeApplied: boolean;
  promoCode: string | null;
  feeWaived: boolean;
};

/**
 * Calculate the platform fee for a Bounty or Grant.
 * @param amount       The reward/funding amount in USD
 * @param promoDiscount 0-100 discount percent from a promo code (0 = no promo)
 * @param promoCode    The promo code string (for record-keeping)
 */
export function calculateFee(
  amount: number,
  promoDiscount = 0,
  promoCode: string | null = null,
): FeeCalculation {
  const effectiveFeePercent =
    DEFAULT_FEE_PERCENT * (1 - promoDiscount / 100);
  const feeAmount = parseFloat(
    ((amount * effectiveFeePercent) / 100).toFixed(2),
  );

  return {
    originalAmount: amount,
    feePercent: parseFloat(effectiveFeePercent.toFixed(4)),
    feeAmount,
    totalCharged: parseFloat((amount + feeAmount).toFixed(2)),
    promoCodeApplied: promoCode !== null && promoDiscount > 0,
    promoCode,
    feeWaived: effectiveFeePercent === 0,
  };
}

/**
 * Jobs are always free. Returns a zero-fee calculation.
 */
export function calculateJobFee(amount: number): FeeCalculation {
  return {
    originalAmount: amount,
    feePercent: JOB_FEE_PERCENT,
    feeAmount: 0,
    totalCharged: amount,
    promoCodeApplied: false,
    promoCode: null,
    feeWaived: true,
  };
}
