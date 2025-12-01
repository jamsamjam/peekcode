import { ActivityCalendar, type ThemeInput } from 'react-activity-calendar'

const minimalTheme: ThemeInput = {
  light: ['#e6f7ff', '#b3ecff', '#70ccebff', '#6eaae9ff', '#5697ddff'],
  dark: ['#0a1f33', '#0e3a4d', '#106a7c', '#12a4a6', '#16d7c5'],
};

interface CalendarProps {
  data: Array<{ date: string; count: number; level: number }>;
  loading?: boolean;
}

const Calendar = ({ data, loading }: CalendarProps) => {
    if (loading) {
      return <ActivityCalendar data={[]} theme={minimalTheme} loading />;
    }

    if (!data || data.length === 0) {
      return <ActivityCalendar data={[]} theme={minimalTheme} loading />;
    }

    return <ActivityCalendar data={data} theme={minimalTheme} />;
}

export default Calendar;