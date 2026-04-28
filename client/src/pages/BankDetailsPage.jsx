import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'

export default function BankDetailsPage() {
  usePageMeta({
    title: 'Bank Details',
    description: 'Official Prinstine Academy payment and bank transfer details.',
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Bank Details
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Secure banking information for your transactions.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BankCard
          title="Prinstine Group of Companies (USD)"
          bankName="EcoBank"
          accountNumber="6102243542"
        />
        <BankCard
          title="Prinstine Academy Inc. (USD)"
          bankName="EcoBank"
          accountNumber="6102243552"
        />
        <BankCard
          title="Prinstine Group of Companies Inc (USD)"
          bankName="Bloom Bank"
          accountNumber="00210306847013"
        />
      </div>

      <section className="glass-card p-5 md:p-6">
        <h2 className="text-2xl font-semibold text-white">Mobile Money Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <MobileCard provider="MTN Mobile Money" merchantNumber="0887417954" />
          <MobileCard provider="Orange Money" merchantNumber="8644338" />
        </div>
      </section>

      <section className="glass-card p-5 md:p-6">
        <h2 className="text-2xl font-semibold text-white">Payment Inquiry</h2>
        <p className="mt-2 text-sm leading-relaxed text-blue-100">
          For inquiries related to payments or bank transfers, contact:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="section-surface p-4">
            <p className="text-xs uppercase tracking-wide text-amber-300">Phone</p>
            <p className="mt-2 text-base text-white">+231(0)-774-917-393 / +231(0)-887-917-393</p>
          </article>
          <article className="section-surface p-4">
            <p className="text-xs uppercase tracking-wide text-amber-300">Email</p>
            <p className="mt-2 text-base text-white">info@prinstinegroup.org</p>
          </article>
        </div>
      </section>
    </motion.section>
  )
}

function BankCard({ title, bankName, accountNumber }) {
  return (
    <article className="glass-card p-5 md:p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        <div className="section-surface p-3.5">
          <p className="text-xs uppercase tracking-wide text-amber-300">Bank Name</p>
          <p className="mt-1 text-base text-white">{bankName}</p>
        </div>
        <div className="section-surface p-3.5">
          <p className="text-xs uppercase tracking-wide text-amber-300">Account Number</p>
          <p className="mt-1 text-base font-semibold tracking-wide text-white">{accountNumber}</p>
        </div>
      </div>
    </article>
  )
}

function MobileCard({ provider, merchantNumber }) {
  return (
    <article className="section-surface p-4">
      <p className="text-xs uppercase tracking-wide text-amber-300">Provider</p>
      <h3 className="mt-1 text-lg font-semibold text-white">{provider}</h3>
      <p className="mt-3 text-xs uppercase tracking-wide text-amber-300">Merchant Number</p>
      <p className="mt-1 text-base font-semibold tracking-wide text-white">{merchantNumber}</p>
    </article>
  )
}
