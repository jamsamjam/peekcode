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

    const currentYear = year || new Date().getFullYear();
<<<<<<< HEAD
    const totalCount = data.reduce((sum, activity) => sum + activity.count, 0);
    
    return (
      <>
        <ActivityCalendar 
          data={data} 
          theme={minimalTheme} 
          maxLevel={5}
        />
        <p className="text-center mt-2" style={{ fontSize: '14px', color: '#666' }}>
          {totalCount} activities in {currentYear}
        </p>
      </>
    );
=======
    
    return <ActivityCalendar 
      data={data} 
      theme={minimalTheme} 
      maxLevel={5}
      labels={{
        totalCount: `{{count}} activities in ${currentYear}`
      }}
    />;
>>>>>>> 70e9136620921520ae124879f31d9c02e20d1627
}

export default Calendar;