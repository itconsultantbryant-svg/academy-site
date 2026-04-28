import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/1FdM9mJ6oT/?mibextid=wwXIfr' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/prinstine-group-of-companies/' },
]

export default function ContactPage() {
  usePageMeta({
    title: 'Contact',
    description: 'Get in touch with Prinstine Academy for enrollment, support, and training inquiries.',
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 lg:space-y-10"
    >
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2fce] to-[#2148df] p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Contact Us</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-100 md:text-base">
          Reach out for admissions, partnerships, corporate training, and learner support.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Phone / WhatsApp" value="0774917393" />
        <InfoCard label="Email" value="info@prinstineacademy.org" />
        <InfoCard label="Support Hours" value="Mon-Fri: 8:30 AM - 5:30 PM | Sat: 10:00 AM - 2:00 PM" />
        <InfoCard label="Location" value="PA Rib House Junction, Airfield Sinkor, Monrovia-Liberia" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="glass-card space-y-4 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Send us a message</h2>
          <p className="text-sm text-blue-100">
            Tell us which program or service you are interested in and our team will respond quickly.
          </p>
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = 'mailto:info@prinstineacademy.org'
            }}
          >
            <input type="text" placeholder="Full name" required />
            <input type="email" placeholder="Email address" required />
            <input type="text" placeholder="Phone number" />
            <input type="text" placeholder="Course or service of interest" />
            <textarea rows={4} placeholder="Your message" required className="md:col-span-2" />
            <button type="submit" className="btn-primary md:col-span-2">
              Send Inquiry
            </button>
          </form>
        </section>

        <section className="glass-card space-y-4 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Connect with us</h2>
          <a
            href="https://wa.me/231774917393?text=Hello%20Prinstine%20Academy.%20I%20need%20assistance."
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full justify-center"
          >
            Chat on WhatsApp
          </a>
          <div className="space-y-2">
            {SOCIALS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="section-surface block px-4 py-3 text-sm text-blue-100 transition hover:border-amber-300/40 hover:text-amber-300"
              >
                {item.label}
              </a>
            ))}
          </div>
          <article className="section-surface p-4">
            <h3 className="text-sm font-semibold text-white">Need urgent support?</h3>
            <p className="mt-2 text-sm text-blue-100">
              Call or message us directly on WhatsApp and our admissions team will assist you.
            </p>
          </article>
        </section>
      </div>
    </motion.section>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-blue-200/20 bg-blue-900/20 p-4">
      <p className="text-xs uppercase tracking-wide text-amber-300">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-white">{value}</p>
    </div>
  )
}
