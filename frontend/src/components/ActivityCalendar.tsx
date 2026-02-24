import { ActivityCalendar, type ThemeInput } from 'react-activity-calendar'

const minimalTheme: ThemeInput = {
  light: ['#e6f7ff', '#cfeeff', '#b7e3ff', '#8fceff', '#64b5ff', '#3a99ff'],
  dark: ['#0a1f33', '#0e3a4d', '#106a7c', '#12a4a6', '#16d7c5', '#17d7c5'],
};

interface CalendarProps {
  data: Array<{ date: string; count: number; level: number }>;
  loading?: boolean;
  year?: number;
}

const Calendar = ({ data, loading, year }: CalendarProps) => {
    if (loading) {
      return <ActivityCalendar data={[]} theme={minimalTheme} maxLevel={5} loading />;
    }

    if (!data || data.length === 0) {
      return <ActivityCalendar data={[]} theme={minimalTheme} maxLevel={5} loading />;
    }

    const currentYear = year || new Date().getFullYear();
    const totalCount = data.reduce((sum, activity) => sum + activity.count, 0);
    
    console.log('📅 ActivityCalendar Component:');
    console.log('year prop:', year);
    console.log('currentYear:', currentYear);
    console.log('data[0]:', data[0]);
    console.log('totalCount:', totalCount);
    
    return (
      <div>
        <ActivityCalendar 
          data={data} 
          theme={minimalTheme} 
          maxLevel={5}
          hideTotalCount={true}
        />
        <p className="text-center mt-2" style={{ fontSize: '14px', color: '#9ca3af' }}>
          {totalCount} activities in {currentYear}
        </p>
      </div>
    );
}

export default Calendar;