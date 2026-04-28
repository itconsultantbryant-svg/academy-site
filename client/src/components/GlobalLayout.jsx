import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import logoImage from '../assets/logo.png'
import SubscribePopup from './SubscribePopup'
import { getBackgroundsForPath } from '../data/pageBackgrounds'

const navClass = ({ isActive }, theme) =>
  [
    'block whitespace-nowrap rounded-full px-3 py-1.5 text-left text-sm transition-all duration-300 md:text-center',
    theme === 'light'
      ? 'hover:bg-blue-900/10 hover:text-blue-900'
      : 'hover:bg-blue-200/10 hover:text-white',
    isActive
      ? theme === 'light'
        ? 'bg-blue-600/15 text-blue-700'
        : 'bg-blue-300/20 text-blue-100'
      : theme === 'light'
        ? 'text-blue-800'
        : 'text-blue-200',
  ].join(' ')

function SocialIcon({ type }) {
  const cls = 'h-4 w-4'
  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path fill="currentColor" d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.4V10H8v3h2.7v8h2.8Z" />
      </svg>
    )
  }
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    )
  }
  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path fill="currentColor" d="M6.7 8.3a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM5 10h3.3v9H5v-9Zm5.3 0h3.1v1.3h.1c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5.1v4.2h-3.3v-3.8c0-.9 0-2.1-1.3-2.1s-1.5 1-1.5 2v3.9h-3.3v-9Z" />
      </svg>
    )
  }
  if (type === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path fill="currentColor" d="M14.5 3h2.2c.1 1.2.8 2.3 1.9 3 .8.5 1.7.8 2.6.8v2.2a7 7 0 0 1-4.5-1.6v6.5a4.8 4.8 0 1 1-4.1-4.8v2.3a2.5 2.5 0 1 0 1.9 2.5V3Z" />
      </svg>
    )
  }
  if (type === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path fill="currentColor" d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2 .3V7l7 4.7L19 7v-.2a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5Zm14 2.6-6.4 4.3a1 1 0 0 1-1.2 0L5 9.4v8.1c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V9.4Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
      <path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 6.8 9 11 9 11s9-4.2 9-11a9 9 0 0 0-9-9Zm0 12.5A3.5 3.5 0 1 1 12 7a3.5 3.5 0 0 1 0 7.5Z" />
    </svg>
  )
}

export default function GlobalLayout() {
  const location = useLocation()
  const routeBackgrounds = getBackgroundsForPath(location.pathname)
  const whatsappHref = 'https://wa.me/231774917393?text=Hello%20Prinstine%20Academy.%20I%20need%20assistance%20and%20directions.'
  const [chatMinimized, setChatMinimized] = useState(() => sessionStorage.getItem('wa_chat_minimized') === '1')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ui_theme')
    return saved === 'light' || saved === 'dark' ? saved : 'dark'
  })

  useEffect(() => {
    localStorage.setItem('ui_theme', theme)
    document.documentElement.classList.toggle('theme-light', theme === 'light')
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoMissing, setLogoMissing] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const links = [
    { to: '/', label: 'Home', shortLabel: 'Home', end: true },
    { to: '/about', label: 'About', shortLabel: 'About' },
    { to: '/courses', label: 'Courses', shortLabel: 'Courses' },
    { to: '/faculty', label: 'Faculty', shortLabel: 'Faculty' },
    { to: '/gallery', label: 'Gallery', shortLabel: 'Gallery' },
    { to: '/blog', label: 'Blog', shortLabel: 'Blog' },
    { to: '/handbook', label: 'Handbook', shortLabel: 'Handbook' },
    { to: '/online-courses-link', label: 'Online Courses Link', shortLabel: 'Online' },
    { to: '/contact', label: 'Contact', shortLabel: 'Contact' },
    { to: '/verify-certificate', label: 'Student Portal', shortLabel: 'Portal' },
  ]
  const companyLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/courses', label: 'Courses' },
    { to: '/faculty', label: 'Faculty' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/blog', label: 'Articles' },
    { to: '/handbook', label: 'Handbook' },
    { to: '/contact', label: 'Contact' },
  ]
  const resourceLinks = [
    { to: '/bank-details', label: 'Bank Details' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms-and-conditions', label: 'Terms and Conditions' },
    { to: '/online-courses-link', label: 'Online Courses Link' },
    { to: '/verify-certificate', label: 'Student Portal' },
    { to: '/handbook', label: 'Handbook' },
  ]
  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/share/1FdM9mJ6oT/?mibextid=wwXIfr',
      type: 'facebook',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/prinstinegroup?utm_source=qr&igsh=MnoyN21meGoyZGN1',
      type: 'instagram',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/prinstine-group-of-companies/',
      type: 'linkedin',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@prinstinegroup001?_r=1&_t=ZT-95uC1j0NpDq',
      type: 'tiktok',
    },
    { label: 'Email', href: 'mailto:info@prinstineacademy.org', type: 'email' },
    { label: 'Phone', href: whatsappHref, type: 'phone' },
  ]

  const renderLink = (to, label, shortLabel, end = false) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      onClick={() => setMobileOpen(false)}
      className={(s) =>
        [
          navClass(s, theme),
          'relative',
          'after:absolute after:bottom-0 after:left-3 after:h-[2px] after:w-0 after:rounded-full after:transition-all after:duration-300',
          s.isActive
            ? theme === 'light'
              ? 'after:w-[calc(100%-1.5rem)] after:bg-cyan-600'
              : 'after:w-[calc(100%-1.5rem)] after:bg-cyan-300'
            : '',
        ].join(' ')
      }
    >
      <span className="md:hidden">{shortLabel || label}</span>
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  )

  useEffect(() => {
    function onKeyDown(event) {
      if (!mobileOpen) return

      if (event.key === 'Escape') {
        setMobileOpen(false)
        return
      }

      if (event.key === 'Tab') {
        const focusable = menuRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement

        if (event.shiftKey && active === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    function onPointerDown(event) {
      if (!mobileOpen) return
      const target = event.target
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [mobileOpen])

  useEffect(() => {
    if (mobileOpen) {
      const first = menuRef.current?.querySelector('a')
      first?.focus()
    } else {
      menuButtonRef.current?.focus()
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    sessionStorage.setItem('wa_chat_minimized', chatMinimized ? '1' : '0')
  }, [chatMinimized])

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {routeBackgrounds[0] ? (
          <img
            src={routeBackgrounds[0]}
            alt=""
            aria-hidden="true"
            className="absolute left-[-6%] top-[-8%] h-[55vh] w-[55vw] rounded-[40px] object-cover opacity-[0.08] blur-[1px]"
          />
        ) : null}
        {routeBackgrounds[1] ? (
          <img
            src={routeBackgrounds[1]}
            alt=""
            aria-hidden="true"
            className="absolute bottom-[-10%] right-[-10%] h-[52vh] w-[52vw] rounded-[40px] object-cover opacity-[0.08] blur-[1px]"
          />
        ) : null}
      </div>
      <img
        src={logoImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 w-[260px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] md:w-[360px] lg:w-[460px]"
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <header
        className={[
          'sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300',
          theme === 'light'
            ? 'border-b border-blue-900/10 bg-blue-50/85'
            : 'border-b border-blue-200/15 bg-[#07103a]/85',
        ].join(' ')}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Prinstine Academy homepage"
          >
            {!logoMissing ? (
              <img
                src={logoImage}
                alt="Prinstine Academy"
                className="h-10 w-auto rounded-md"
                onError={() => setLogoMissing(true)}
              />
            ) : (
              <span
                className={[
                  'bg-clip-text text-lg font-semibold text-transparent',
                  theme === 'light'
                    ? 'bg-gradient-to-r from-blue-700 to-amber-600'
                    : 'bg-gradient-to-r from-blue-200 to-amber-300',
                ].join(' ')}
              >
                Prinstine Academy
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2 md:flex-1 md:justify-end">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={[
                'md:hidden rounded-full px-3 py-1.5 text-sm transition',
                theme === 'light'
                  ? 'border border-blue-900/20 text-blue-800 hover:bg-blue-900/10'
                  : 'border border-blue-100/25 text-blue-100 hover:bg-blue-200/10',
              ].join(' ')}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              Menu
            </button>
            <nav
              className="hidden md:mx-3 md:flex md:flex-1 md:items-center md:justify-center md:gap-1 lg:gap-1.5"
              aria-label="Main navigation"
            >
              {links.map((link) =>
                renderLink(link.to, link.label, link.shortLabel, link.end)
              )}
            </nav>
            <button
              type="button"
              onClick={toggleTheme}
              className={[
                'shrink-0 rounded-full px-3 py-1.5 text-sm transition',
                theme === 'light'
                  ? 'border border-blue-900/20 text-blue-800 hover:bg-blue-900/10'
                  : 'border border-blue-100/25 text-blue-100 hover:bg-blue-200/10',
              ].join(' ')}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-[#030b2f]/35 backdrop-blur-[1.5px] md:hidden"
                aria-hidden="true"
              />
              <motion.nav
                ref={menuRef}
                initial={{ opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={[
                  'relative z-50 mx-4 mb-3 overflow-hidden rounded-2xl border px-3 py-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)] md:hidden',
                  theme === 'light'
                    ? 'border-blue-900/10 bg-white/70 backdrop-blur-md'
                    : 'border-blue-100/15 bg-[#0b164d]/60 backdrop-blur-md',
                ].join(' ')}
                aria-label="Mobile navigation"
              >
                <motion.ul
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: {
                      transition: { staggerChildren: 0.03, staggerDirection: -1 },
                    },
                    show: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="grid gap-1.5"
                >
                  {links.map((link) => (
                    <motion.li
                      key={link.to}
                      variants={{
                        hidden: { opacity: 0, y: -6 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      {renderLink(link.to, link.label, link.shortLabel, link.end)}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.nav>
            </>
          ) : null}
        </AnimatePresence>
      </header>

      <motion.main
        id="main-content"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="page-wrap relative z-10"
      >
        <Outlet />
      </motion.main>
      {!location.pathname.startsWith('/admin') ? (
        <div className="fixed bottom-5 right-5 z-[95]">
          {chatMinimized ? (
            <button
              type="button"
              onClick={() => setChatMinimized(false)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-emerald-400"
              aria-label="Open WhatsApp support chat"
            >
              <span className="h-2 w-2 rounded-full bg-white" />
              <span>Chat</span>
            </button>
          ) : (
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500 p-2 text-white shadow-[0_14px_35px_rgba(0,0,0,0.3)]">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <p className="text-xs font-semibold">Customer Service</p>
                <button
                  type="button"
                  onClick={() => setChatMinimized(true)}
                  className="rounded-full bg-white/20 px-2 py-0.5 text-xs transition hover:bg-white/30"
                  aria-label="Minimize WhatsApp support chat"
                >
                  Minimize
                </button>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold transition hover:bg-emerald-700"
                aria-label="Chat on WhatsApp for immediate assistance and directions"
              >
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-200" />
                <span>Online now</span>
                <span className="hidden sm:inline">0774917393</span>
              </a>
            </div>
          )}
        </div>
      ) : null}
      {!location.pathname.startsWith('/admin') ? (
        <Link
          to="/register"
          className="fixed bottom-[108px] right-5 z-[94] inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_14px_35px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-amber-300"
          aria-label="Register now"
        >
          Register Now
          <span aria-hidden="true">{'->'}</span>
        </Link>
      ) : null}
      {!location.pathname.startsWith('/admin') ? <SubscribePopup /> : null}

      <footer
        className={[
          'relative z-10 border-t transition-colors duration-300',
          theme === 'light'
            ? 'border-blue-900/10 bg-blue-50/70 text-blue-900'
            : 'border-blue-100/10 bg-[#081244] text-blue-100',
        ].join(' ')}
      >
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 lg:grid-cols-4 md:px-6">
          <div className="space-y-3">
            {!logoMissing ? (
              <img
                src={logoImage}
                alt="Prinstine Academy"
                className="h-10 w-auto rounded-md"
                onError={() => setLogoMissing(true)}
              />
            ) : (
              <p className="text-lg font-semibold">Prinstine Academy</p>
            )}
            <p className="text-sm text-blue-200">
              Educate. Empower. Elevate.
            </p>
            <p className="text-sm text-blue-200">
              Practical learning designed for measurable career growth.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/25 bg-white/5 px-2.5 py-1 text-xs text-blue-100 transition hover:-translate-y-0.5 hover:border-amber-300/45 hover:text-amber-300"
                  aria-label={item.label}
                >
                  <SocialIcon type={item.type} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-300">
              Company
            </p>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="ui-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-300">
              Resources
            </p>
            <ul className="space-y-2 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="ui-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-amber-300">Contact</p>
            <p>0774917393</p>
            <p>info@prinstineacademy.org</p>
            <p>PA Rib House Junction, Airfield Sinkor, Monrovia-Liberia</p>
          </div>
        </div>
        <div className="border-t border-blue-100/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-sm md:flex-row md:px-6">
            <p>Powered by Prinstine Group of Companies</p>
            <div className="flex items-center gap-3">
              <p className="text-blue-200">
                © {new Date().getFullYear()} Prinstine Academy. All rights reserved.
              </p>
              <Link
                to="/admin"
                aria-label="Admin access"
                title="Admin"
                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-200/20 text-[8px] text-blue-200/70 transition hover:text-blue-100"
              >
                °
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
