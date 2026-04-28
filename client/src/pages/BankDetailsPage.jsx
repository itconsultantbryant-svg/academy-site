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
          Use these official details for tuition and program payments. Always confirm the account
          name before making transfers.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Info label="Bank Name" value="Prinstine Academy Partner Bank" />
        <Info label="Account Name" value="Prinstine Academy" />
        <Info label="Account Number" value="0000-0000-0000" />
        <Info label="Swift Code" value="PRINLBRXXX" />
      </div>
    </motion.section>
  )
}

function Info({ label, value }) {
  return (
    <article className="glass-card p-5 md:p-6">
      <p className="text-xs uppercase tracking-wide text-amber-300">{label}</p>
      <p className="mt-2 text-base text-white">{value}</p>
    </article>
  )
}
