import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'Home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

const stats = [
  { label: 'Years Experience', value: '30+' },
  { label: 'Satisfied Patients', value: '60k+' },
  { label: 'Success Rate', value: '99%' },
];

const services = [
  'General Dentistry',
  'Cosmetic Dentistry',
  'Emergency Care',
  'Teeth Whitening',
  'Root Canal Therapy',
  'Dental Implants',
];

const testimonials = [
  { name: 'Aarav Mehta', tag: 'Orthodontics Patient', review: 'After years of hiding my smile, ENTNT gave me confidence with a smooth braces journey!' },
  { name: 'Neha Sharma', tag: 'Smile Makeover', review: 'Cosmetic dentistry transformed my teeth. Painless veneers, world-class care!' },
  { name: 'Rohit Verma', tag: 'Emergency Treatment', review: 'Severe toothache at midnight? ENTNT responded immediately. Lifesavers!' },
];

export default function Landing() {
  const [open, setOpen] = useState(false);
  const { dispatch } = useApp();

  useEffect(() => {
    const checkSections = () => navItems.forEach(({ id }) => console.log(`Section "${id}" ${document.getElementById(id) ? 'found' : 'NOT found'} in DOM`));
    checkSections();
    window.addEventListener('load', checkSections);
    return () => window.removeEventListener('load', checkSections);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch({
      type: 'ADD_INCIDENT',
      payload: {
        id: crypto.randomUUID(),
        title: formData.get('service'),
        appointmentDate: formData.get('datetime'),
        status: 'Pending',
        cost: 0,
      },
    });
    e.target.reset();
    alert('Appointment booked!');
  };

  const handleNavClick = (id, e) => {
    e.preventDefault();
    console.log(`Clicked ${id}`);
    setOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20, behavior: 'smooth' });
        console.log(`Scrolling to ${id}`);
      } else {
        console.error(`Element "${id}" not found`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  };

  const buttonVariants = { hover: { scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', transition: { duration: 0.2 } } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900">
      <header className="fixed w-full z-50 bg-white/70 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="ENTNT Logo" className="h-9 w-9 rounded-full bg-white p-1 shadow" onError={(e) => (e.target.src = '/fallback-logo.png')} />
            <span className="text-xl sm:text-2xl font-bold text-blue-700">ENTNT Dental</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map(({ id, label }) => (
              <motion.button key={id} onClick={(e) => handleNavClick(id, e)} variants={buttonVariants} whileHover="hover" className="hover:text-blue-600">
                {label}
              </motion.button>
            ))}
            <Link to="/login">
              <motion.button variants={buttonVariants} whileHover="hover" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                Login
              </motion.button>
            </Link>
          </nav>
          <motion.button
            className="md:hidden p-2 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            variants={buttonVariants}
            whileHover="hover"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white/90 backdrop-blur pb-4 shadow"
            >
              <ul className="flex flex-col gap-3 px-6 pt-2 text-sm font-medium">
                {navItems.map(({ id, label }) => (
                  <li key={id}>
                    <motion.a
                      href={`#${id}`}
                      onClick={(e) => handleNavClick(id, e)}
                      variants={buttonVariants}
                      whileHover="hover"
                      className="block w-full py-2 hover:text-blue-600"
                    >
                      {label}
                    </motion.a>
                  </li>
                ))}
                <li>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <motion.button variants={buttonVariants} whileHover="hover" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Login
                    </motion.button>
                  </Link>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section id="hero" className="relative pt-32 pb-20 md:pt-40 bg-[url('/hero-bg.jpg')] bg-cover bg-center isolate">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm -z-10" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
          <div>
            <p className="text-sm uppercase text-blue-600 font-semibold mb-3 tracking-wide">WELCOME TO ENTNT</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              World‑Class <span className="text-blue-600">Dental Services</span>
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-md">Advanced technology. Gentle care. Comfortable, transparent dentistry.</p>
            <div className="flex flex-wrap gap-4 mb-10">
              <motion.button onClick={(e) => handleNavClick('contact', e)} variants={buttonVariants} whileHover="hover" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700">
                Book Appointment
              </motion.button>
              <motion.button onClick={(e) => handleNavClick('services', e)} variants={buttonVariants} whileHover="hover" className="border border-gray-400 px-6 py-3 rounded-lg hover:bg-gray-100">
                Discover Services
              </motion.button>
            </div>
            <div className="flex gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-blue-700">{s.value}</p>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="/hero-dental.png" alt="Hero Dental" className="rounded-2xl shadow-2xl" loading="lazy" onError={(e) => (e.target.src = '/fallback-hero.png')} />
            <span className="absolute top-4 right-4 bg-yellow-400 text-xs font-semibold px-3 py-1 rounded-full shadow">⭐ 5.0 Rating</span>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service} className="p-8 border rounded-xl shadow-sm hover:shadow-md">
                <h4 className="font-semibold text-lg mb-2 text-blue-700">{service}</h4>
                <p className="text-sm text-gray-600">High-quality, painless dental treatment.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Real Stories. Real Smiles.</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">{t.name[0]}</div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.tag}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">“{t.review}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">Ready for a Healthier Smile?</h3>
            <p className="text-lg mb-6">Book your appointment today.</p>
            <motion.button variants={buttonVariants} whileHover="hover" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg">
              Call Now
            </motion.button>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-xl text-gray-800 space-y-4">
            <input required type="text" id="name" name="name" placeholder="Your Name" className="w-full border p-3 rounded" />
            <input required type="email" id="email" name="email" placeholder="Email" className="w-full border p-3 rounded" />
            <input required type="tel" id="phone" name="phone" placeholder="Phone" className="w-full border p-3 rounded" />
            <select id="service" name="service" className="w-full border p-3 rounded" required>
              <option value="" disabled selected>
                Select a Service
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input required type="datetime-local" id="datetime" name="datetime" className="w-full border p-3 rounded" min={new Date().toISOString().slice(0, 16)} />
            <motion.button type="submit" variants={buttonVariants} whileHover="hover" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Book Now
            </motion.button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-900 text-white pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img src="/logo.svg" alt="ENTNT Logo" className="h-10 w-10 rounded-full bg-white p-1" onError={(e) => (e.target.src = '/fallback-logo.png')} />
              <h4 className="text-xl font-bold">ENTNT Dental</h4>
            </div>
            <p className="text-gray-400 mb-4">Premium dental care with modern technology.</p>
            <div className="flex gap-4 text-gray-400">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
                LinkedIn
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
                Instagram
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="hover:text-white">
                WhatsApp
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Services</h5>
            <ul className="space-y-2 text-gray-400">
              {services.slice(0, 4).map((s) => (
                <li key={s} className="hover:text-white">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Contact</h5>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +91-987-654-3210</li>
              <li>📧 info@entntdental.com</li>
              <li>📍 123 Dental Lane, New Delhi</li>
              <li>🕒 Mon–Fri: 8AM–6PM</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Legal</h5>
            <ul className="space-y-2 text-gray-400">
              {['privacy-policy', 'terms', 'sitemap'].map((p) => (
                <li key={p}>
                  <Link to={`/${p}`} className="hover:text-white">
                    {p.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ENTNT Dental. All rights reserved.
        </div>
      </footer>
    </div>
  );
}