import { useState, useEffect, useMemo } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  CalendarRange,
  TrendingUp,
  CalendarDays,
  Search,
  Download,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CSVLink } from 'react-csv';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const theme = {
  completed: {
    bg: 'rgba(34,197,94,0.25)',
    text: '#15803d',
  },
  pending: {
    bg: 'rgba(59,130,246,0.25)',
    text: '#1d4ed8',
  },
};

export default function CalendarPage() {
  
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateInput, setDateInput] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);


  const events = useMemo(
    () =>
      state.incidents
        .filter(
          (i) =>
            !search ||
            i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.status.toLowerCase().includes(search.toLowerCase()),
        )
        .map((i) => ({
          id: i.id,
          title: i.title,
          start: isValid(new Date(i.appointmentDate))
            ? new Date(i.appointmentDate)
            : new Date(),
          end: isValid(new Date(i.appointmentDate))
            ? new Date(i.appointmentDate)
            : new Date(),
          status: i.status ?? 'Pending',
          cost: i.cost ?? 0,
        })),
    [state.incidents, search],
  );

  
  const today = new Date();
  const upcomingMonth = events.filter(
    (e) => isSameMonth(e.start, today) && e.start >= today,
  );
  const todayEvents = events.filter((e) => isSameDay(e.start, today));
  const upcomingAll = events.filter((e) => e.start >= today);
  const selectedDayEvents = selectedDate
    ? events.filter((ev) => isSameDay(ev.start, selectedDate))
    : [];

  const toggleStatus = (id, status) => {
    dispatch({
      type: 'UPDATE_INCIDENT',
      payload: { id, status: status === 'Completed' ? 'Pending' : 'Completed' },
    });
    setSelectedEvent(null);
  };

  const csvData = events.map((e) => ({
    Title: e.title,
    Date: format(e.start, 'PPp'),
    Status: e.status,
    Cost: `₹${e.cost}`,
  }));

  
  useEffect(() => {
    if (dateInput) {
      const d = parseISO(dateInput);
      if (isValid(d)) setSelectedDate(d);
    }
  }, [dateInput]);

  /* Framer Motion variants */
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.05 },
    }),
  };

  return (
    <PageWrapper className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* ───────── Header ───────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="mb-4"
      >
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-400">
          Appointment Calendar
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Plan, track, and celebrate healthy smiles
        </p>
      </motion.div>

      {/* ───────── Controls ───────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-[10px] h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            placeholder="Search by title or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          />
          {search && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearch('')}
              className="absolute right-3 top-[10px] text-gray-500 dark:text-gray-400"
              aria-label="Clear search"
            >
              <X size={16} />
            </motion.button>
          )}
        </div>

        {/* Date & today */}
        <div className="flex gap-3">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-blue-500 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedDate(today);
              setDateInput(format(today, 'yyyy-MM-dd'));
            }}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            Today
          </motion.button>
        </div>
      </div>

      {/* ───────── KPI Cards ───────── */}
      <motion.div
        className="grid sm:grid-cols-3 gap-4 mb-6"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        {[
          {
            label: 'This Month',
            count: upcomingMonth.length,
            icon: CalendarRange,
            gradient: 'from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800',
          },
          {
            label: 'Today',
            count: todayEvents.length,
            icon: CalendarDays,
            gradient: 'from-green-100 to-green-50 dark:from-green-900 dark:to-green-800',
          },
          {
            label: 'Upcoming',
            count: upcomingAll.length,
            icon: TrendingUp,
            gradient: 'from-pink-100 to-pink-50 dark:from-pink-900 dark:to-pink-800',
          },
        ].map(({ label, count, icon: Icon, gradient }, i) => (
          <motion.div
            custom={i}
            variants={fadeInUp}
            key={label}
            whileHover={{ y: -2 }}
            className={`relative overflow-hidden rounded-xl p-4 flex items-center gap-3 bg-gradient-to-br ${gradient}`}
          >
            <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {count}
              </p>
              <span className="text-xs uppercase text-gray-600 dark:text-gray-400 tracking-wide">
                {label}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ───────── Calendar + Side Panel ───────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          initial="hidden"
          animate="show"
          variants={fadeInUp}
        >
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week']}
            selectable
            popup
            onSelectSlot={(slot) => {
              setSelectedDate(slot.start);
              setSelectedEvent(null);
            }}
            onSelectEvent={(event) => {
              setSelectedDate(event.start);
              setSelectedEvent(event);
            }}
            style={{ minHeight: '60vh', maxHeight: 500 }}
            className="text-sm"
            eventPropGetter={({ status }) => ({
              style: {
                background: `linear-gradient(135deg,${
                  status === 'Completed'
                    ? 'rgba(34,197,94,.9)'
                    : 'rgba(59,130,246,.9)'
                },rgba(0,0,0,0))`,
                borderRadius: 6,
                color: '#fff',
                fontWeight: 600,
                padding: 2,
              },
            })}
            tooltipAccessor={(e) => `${e.title} · ₹${e.cost}`}
            components={{
              toolbar: ({ label, onNavigate }) => (
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onNavigate('PREV')}
                    className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    ‹
                  </motion.button>
                  <h2 className="text-sm font-semibold">{label}</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onNavigate('NEXT')}
                    className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    ›
                  </motion.button>
                </div>
              ),
            }}
          />
        </motion.div>

        {/* Right info panel */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">
              {selectedDate ? format(selectedDate, 'PPPP') : 'Pick a date'}
            </h3>
            <CSVLink
              data={csvData}
              filename="appointments.csv"
              className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              <Download size={14} /> CSV
            </CSVLink>
          </div>

          {selectedDayEvents.length ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {selectedDayEvents.map((ev) => (
                <motion.li
                  whileHover={{ scale: 1.02 }}
                  key={ev.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded p-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium truncate">{ev.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ₹{ev.cost}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleStatus(ev.id, ev.status)}
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      ev.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {ev.status}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-sm text-gray-400 py-8">
              {selectedDate ? 'No appointments' : 'Tap a date'}
            </div>
          )}
        </motion.div>
      </div>

      {/* ───────── Modal ───────── */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            key="modal"
            layoutId={`event-${selectedEvent.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 w-80 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 dark:text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {format(selectedEvent.start, 'PPp')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Cost: ₹{selectedEvent.cost}
              </p>
              <p
                className={`inline-block px-2 py-0.5 text-xs rounded-full mb-4 ${
                  selectedEvent.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {selectedEvent.status}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  toggleStatus(selectedEvent.id, selectedEvent.status)
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
              >
                Mark as{' '}
                {selectedEvent.status === 'Completed'
                  ? 'Pending'
                  : 'Completed'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
