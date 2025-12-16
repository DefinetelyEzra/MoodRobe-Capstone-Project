-- Add check constraint for valid status values
ALTER TABLE payments
ADD CONSTRAINT check_payment_status 
CHECK (status IN ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded'));

-- Add check constraint for valid provider values
ALTER TABLE payments
ADD CONSTRAINT check_payment_provider 
CHECK (provider IN ('paystack', 'stripe', 'manual'));

-- Add check constraint for amounts
ALTER TABLE payments
ADD CONSTRAINT check_payment_amount_positive 
CHECK (amount >= 0);

ALTER TABLE payments
ADD CONSTRAINT check_refunded_amount_non_negative 
CHECK (refunded_amount >= 0);

-- Add constraint to ensure refunded amount doesn't exceed payment amount
ALTER TABLE payments
ADD CONSTRAINT check_refunded_not_exceed_amount 
CHECK (refunded_amount <= amount);