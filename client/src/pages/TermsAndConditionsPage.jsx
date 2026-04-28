import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'

export default function TermsAndConditionsPage() {
  usePageMeta({
    title: 'Terms and Conditions',
    description: 'Terms governing the use of Prinstine Academy services and website.',
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
          Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-blue-100">Last updated: April 27, 2026</p>
      </div>
      <article className="glass-card space-y-6 p-6 md:p-8">
        <Section
          title="1. Acceptance of Terms"
          items={[
            'By accessing or using Prinstine Academy services, you agree to be bound by these Terms and Conditions.',
            'If you do not agree with any part of these terms, you should not use our services.',
          ]}
        />
        <Section
          title="2. Eligibility and Account Responsibility"
          items={[
            'Users must provide accurate registration and profile information where required.',
            'You are responsible for maintaining the confidentiality of your login credentials.',
            'You are responsible for activity performed under your account unless reported unauthorized.',
          ]}
        />
        <Section
          title="3. Programs, Enrollment, and Access"
          items={[
            'Course offerings, schedules, and delivery formats may be updated based on academic and operational needs.',
            'Enrollment confirmation may require successful payment, eligibility checks, or administrative approval.',
            'Access to specific learning materials may be time-limited according to program policy.',
          ]}
        />
        <Section
          title="4. Fees, Payments, and Refunds"
          items={[
            'Program fees and payment terms are communicated during enrollment.',
            'Learners are responsible for completing payment obligations on time.',
            'Refund requests are reviewed under the applicable refund policy and may depend on course progress or service usage.',
          ]}
        />
        <Section
          title="5. Certificates and Verification"
          items={[
            'Certificates are issued only when program requirements are completed and verified.',
            'Certificate verification tools are provided for authenticity checks.',
            'Misuse, falsification, or unauthorized modification of certificates is prohibited.',
          ]}
        />
        <Section
          title="6. Acceptable Use"
          items={[
            'Users must not engage in unlawful, abusive, fraudulent, or disruptive conduct.',
            'Users must not attempt unauthorized access, interference, scraping, or compromise of systems.',
            'Harassment, hate speech, and intellectual property infringement are strictly prohibited.',
          ]}
        />
        <Section
          title="7. Intellectual Property"
          items={[
            'All website content, course materials, branding, and media are owned by or licensed to Prinstine Academy unless otherwise stated.',
            'Content may not be copied, redistributed, sold, or republished without written permission.',
            'Limited personal learning use is allowed for enrolled users within permitted access scope.',
          ]}
        />
        <Section
          title="8. Third-Party Services and Links"
          items={[
            'Our platform may include links to third-party websites or tools for convenience.',
            'We are not responsible for third-party content, policies, availability, or security practices.',
          ]}
        />
        <Section
          title="9. Service Availability and Changes"
          items={[
            'We aim to provide reliable service but do not guarantee uninterrupted availability.',
            'We may modify, suspend, or discontinue features to maintain quality, security, or compliance.',
          ]}
        />
        <Section
          title="10. Limitation of Liability"
          items={[
            'To the maximum extent permitted by law, Prinstine Academy is not liable for indirect, incidental, or consequential damages arising from service use.',
            'Our total liability, where applicable, is limited to the amount paid for the specific service in dispute.',
          ]}
        />
        <Section
          title="11. Termination"
          items={[
            'We may suspend or terminate access for violations of these terms, legal requirements, or security risks.',
            'You may stop using the service at any time, subject to applicable payment or enrollment obligations.',
          ]}
        />
        <Section
          title="12. Governing Law and Dispute Resolution"
          items={[
            'These terms are governed by applicable laws in the jurisdictions where Prinstine Academy operates.',
            'Disputes should first be addressed through good-faith communication with our support team.',
          ]}
        />
        <Section
          title="13. Updates to Terms"
          items={[
            'We may revise these terms from time to time.',
            'Updated terms are effective when published, and continued use indicates acceptance.',
          ]}
        />
        <section>
          <h2 className="text-lg font-semibold text-white md:text-xl">14. Contact</h2>
          <p className="mt-2 text-sm leading-relaxed text-blue-100 md:text-base">
            For questions regarding these terms, contact us at
            {' '}
            <span className="text-white">info@prinstineacademy.org</span>.
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
