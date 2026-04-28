import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'

export default function PrivacyPolicyPage() {
  usePageMeta({
    title: 'Privacy Policy',
    description: 'How Prinstine Academy collects, uses, and protects your data.',
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-blue-100">Last updated: April 27, 2026</p>
      </div>
      <article className="glass-card space-y-6 p-6 md:p-8">
        <Section
          title="1. Information We Collect"
          items={[
            'Identity and contact details such as name, email address, phone number, and account login details.',
            'Learning and enrollment data such as selected programs, progress records, certificates, and support requests.',
            'Technical information such as browser type, device information, pages visited, timestamps, and IP-related metadata.',
            'Subscription details submitted through our website forms, including newsletter preferences.',
          ]}
        />
        <Section
          title="2. How We Use Your Information"
          items={[
            'To provide courses, manage enrollment, verify certificates, and deliver requested services.',
            'To communicate essential updates including schedules, platform notices, policy updates, and support responses.',
            'To improve learning quality, website performance, and administrative workflow.',
            'To maintain account security, prevent fraud, and enforce legal and policy obligations.',
          ]}
        />
        <Section
          title="3. Legal Bases for Processing"
          items={[
            'Performance of a contract when delivering educational services you requested.',
            'Legitimate interests such as service improvement, fraud prevention, and platform integrity.',
            'Consent where required, such as optional subscription communications.',
            'Compliance with legal obligations where records are required by law or regulation.',
          ]}
        />
        <Section
          title="4. Data Sharing"
          items={[
            'We do not sell personal data.',
            'Information may be shared with service providers that support hosting, analytics, communication, and infrastructure operations.',
            'Information may be disclosed where required by law, lawful process, or to protect rights and safety.',
            'Shared data is limited to what is necessary for the intended purpose.',
          ]}
        />
        <Section
          title="5. Cookies and Tracking"
          items={[
            'We may use cookies or similar technologies to maintain sessions, remember preferences, and improve site usage analytics.',
            'You can manage cookie behavior in your browser settings, but disabling some cookies may affect functionality.',
          ]}
        />
        <Section
          title="6. Data Security"
          items={[
            'We implement reasonable technical and organizational safeguards to protect personal data from unauthorized access, loss, misuse, or alteration.',
            'No online system is absolutely secure, but we continuously review and improve our controls.',
          ]}
        />
        <Section
          title="7. Data Retention"
          items={[
            'We retain personal data only for as long as necessary to deliver services, maintain lawful records, resolve disputes, and enforce agreements.',
            'Retention periods may vary based on account activity, legal requirements, and service type.',
          ]}
        />
        <Section
          title="8. Your Rights"
          items={[
            'You may request access to personal data we hold about you.',
            'You may request correction of inaccurate or outdated information.',
            'You may request deletion or restriction of data where legally permitted.',
            'You may opt out of non-essential communication such as promotional updates.',
          ]}
        />
        <Section
          title="9. Children and Minors"
          items={[
            'Our services are intended for learners and professionals; where minors are involved, consent and supervision requirements may apply under local law.',
          ]}
        />
        <Section
          title="10. Policy Updates"
          items={[
            'We may revise this Privacy Policy from time to time.',
            'Changes become effective when posted on this page, and continued use indicates acceptance of the updated policy.',
          ]}
        />
        <section>
          <h2 className="text-lg font-semibold text-white md:text-xl">11. Contact</h2>
          <p className="mt-2 text-sm leading-relaxed text-blue-100 md:text-base">
            For privacy questions, requests, or concerns, contact us at
            {' '}
            <span className="text-white">info@prinstineacademy.org</span>
            {' '}
            or visit our contact page.
          </p>
        </section>
      </article>
    </motion.section>
  )
}

function Section({ title, items }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white md:text-xl">{title}</h2>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-blue-100 md:text-base">
            - {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
