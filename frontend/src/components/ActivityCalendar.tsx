import { ActivityCalendar, type ThemeInput } from 'react-activity-calendar'

const minimalTheme: ThemeInput = {
  light: ['#e6f7ff', '#cfeeff', '#b7e3ff', '#8fceff', '#64b5ff', '#3a99ff'],
  dark: ['#0a1f33', '#0e3a4d', '#106a7c', '#12a4a6', '#16d7c5', '#17d7c5'],
};

interface CalendarProps {
  data: Array<{ date: string; count: number; level: number }>;
  loading?: boolean;
}

const Calendar = ({ data, loading }: CalendarProps) => {
    if (loading) {
      return <ActivityCalendar data={[]} theme={minimalTheme} maxLevel={5} loading />;
    }

    if (!data || data.length === 0) {
      return <ActivityCalendar data={[]} theme={minimalTheme} maxLevel={5} loading />;
    }

    return <ActivityCalendar data={data} theme={minimalTheme} maxLevel={5} />;
}

export default Calendar;