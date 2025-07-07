import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useApp } from '../context/AppContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import { Calendar, Activity, DollarSign, Users2, RefreshCcw, Download, Search } from 'lucide-react';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AreaChart, Area, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { 'en-US': enUS } });

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');
  const patient = state.patients.find((p) => p.id === user?.patientId);
  const incidents = state.incidents.filter((i) => 
    (isAdmin ? true : i.patientId === user?.patientId) &&
    (search ? i.title.toLowerCase().includes(search.toLowerCase()) : true)
  );
  const upcoming = incidents.filter((i) => new Date(i.appointmentDate) > new Date());
  const completed = incidents.filter((i) => i.status === 'Completed');
  const totalSpent = incidents.reduce((sum, i) => sum + Number(i.cost || 0), 0);
  const totalRevenue = state.incidents.reduce((sum, i) => sum + Number(i.cost || 0), 0);

  const revenueData = state.incidents.reduce((acc, i) => {
    const month = format(new Date(i.appointmentDate), 'MMM');
    const found = acc.find((m) => m.month === month);
    found ? (found.revenue += Number(i.cost || 0)) : acc.push({ month, revenue: Number(i.cost || 0) });
    return acc;
  }, []);

  const adminCalendarEvents = state.incidents.map((i) => ({
    id: i.id,
    title: i.title,
    start: new Date(i.appointmentDate),
    end: new Date(i.appointmentDate),
    status: i.status ?? 'Pending',
  }));

  const toggleStatus = (id, currentStatus) => {
    dispatch({
      type: 'UPDATE_INCIDENT',
      payload: { id, status: currentStatus === 'Completed' ? 'Pending' : 'Completed' },
    });
  };

  const exportChartAsPDF = () => {
    const chart = document.getElementById('revenueChart');
    htmlToImage.toPng(chart).then((dataUrl) => {
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, 'PNG', 10, 10, 190, 100);
      pdf.save('revenue.pdf');
    });
  };

  const csvData = state.incidents.map((i) => ({
    Title: i.title,
    Date: format(new Date(i.appointmentDate), 'PPp'),
    Status: i.status,
    Cost: `₹${i.cost || 0}`,
  }));

  if (isAdmin) {
    return (
      <PageWrapper className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4">Admin Dashboard</h1>
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard title="Appointments" value={upcoming.slice(0, 10).length} icon={Calendar} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" />
          <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={DollarSign} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" />
          <StatCard title="Patients" value={state.patients.length} icon={Users2} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" />
          <StatCard title="Pending" value={state.incidents.filter((i) => i.status !== 'Completed').length} icon={Activity} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Upcoming</h2>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 text-sm">
                {upcoming.length ? upcoming.slice(0, 10).map((i) => (
                  <li key={i.id} className="flex justify-between items-center">
                    <span>{i.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">{format(new Date(i.appointmentDate), 'PPp')}</span>
                      <button
                        onClick={() => toggleStatus(i.id, i.status)}
                        className={`text-xs px-2 py-1 rounded-full ${i.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {i.status}
                      </button>
                    </div>
                  </li>
                )) : <p className="text-gray-500 dark:text-gray-400">No upcoming appointments.</p>}
              </ul>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Calendar</h2>
              <BigCalendar
                localizer={localizer}
                events={adminCalendarEvents}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                style={{ height: 360 }}
                eventPropGetter={({ status }) => ({
                  style: {
                    backgroundColor: status === 'Completed' ? '#22c55e' : '#facc15',
                    borderRadius: 6,
                    padding: '2px 4px',
                    fontSize: '0.75rem',
                    color: '#1f2937',
                  },
                })}
                tooltipAccessor={(event) => `${event.title} - ${event.status}`}
              />
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="lg:col-span-2">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Revenue</h2>
                <div className="flex gap-2">
                  <CSVLink
                    data={csvData}
                    filename="incidents.csv"
                    className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                  >
                    <Download size={14} className="mr-1" /> CSV
                  </CSVLink>
                  <button
                    onClick={exportChartAsPDF}
                    className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    <Download size={14} className="mr-1" /> PDF
                  </button>
                </div>
              </div>
              <div id="revenueChart">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                      </filter>
                    </defs>
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      fill="url(#revGrad)"
                      strokeWidth={2}
                      filter="url(#shadow)"
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Welcome, {patient?.name || 'John Doe'}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Health Dashboard</p>
        </div>
        <button className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-4 gap-3 mb-4">
        <Card className="text-center py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-blue-600">{upcoming.length}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Upcoming</p>
        </Card>
        <Card className="text-center py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-green-600">{completed.length}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
        </Card>
        <Card className="text-center py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-yellow-600">₹{totalSpent.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Spent</p>
        </Card>
        <Card className="text-center py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-pink-600">
            {incidents.filter((i) => new Date(i.appointmentDate).toDateString() === new Date().toDateString()).length}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Today</p>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Upcoming</h2>
          {upcoming.length ? (
            <ul className="space-y-2 text-sm">
              {upcoming.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>{i.title}</span>
                  <span className="text-gray-600 dark:text-gray-400">{format(new Date(i.appointmentDate), 'PPp')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming appointments.</p>
          )}
        </Card>
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Info</h2>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-200">
            <li><strong>Name:</strong> {patient?.name || 'John Doe'}</li>
            <li><strong>Phone:</strong> {patient?.contact || '123456789'}</li>
            <li><strong>Email:</strong> {user?.email}</li>
            <li><strong>Health:</strong> {patient?.healthInfo || 'No allergies'}</li>
            <li><strong>Insurance:</strong> Delta Dental</li>
          </ul>
        </Card>
      </div>
      <div className="mt-6">
        <h2 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">Recent Activity</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{incidents.length} records</p>
        <div className="grid md:grid-cols-2 gap-3">
          {incidents.slice(0, 4).map((i) => (
            <Card key={i.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-between text-sm">
                <div>
                  <h3 className="font-semibold">{i.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(i.appointmentDate), 'PPp')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">₹{i.cost}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${i.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {i.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}