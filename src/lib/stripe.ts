import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const CREDIT_PACKAGES = {
  starter: {
    credits: 5,
    label: 'Starter',
    price: 199, // cents
    priceDisplay: '1,99 €',
  },
  standard: {
    credits: 15,
    label: 'Standard',
    price: 499,
    priceDisplay: '4,99 €',
  },
  pro: {
    credits: 35,
    label: 'Pro',
    price: 999,
    priceDisplay: '9,99 €',
  },
} as const

export type PackageId = keyof typeof CREDIT_PACKAGES
