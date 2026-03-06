import { ActivityCalendar, type ThemeInput } from 'react-activity-calendar'

const minimalTheme: ThemeInput = {
  light: ['#e6f7ff', '#cfeeff', '#b7e3ff', '#8fceff', '#64b5ff', '#3a99ff'],
  dark: ['#0a1f33', '#0e3a4d', '#106a7c', '#12a4a6', '#16d7c5', '#17d7c5'],
};

interface CalendarProps {
  data: Array<{ date: string; count: number; level: number }>;
  loading?: boolean;
  year?: number;
  availableYears?: number[];
  onYearChange?: (year: number) => void;
}

const Calendar = ({ data, loading, year, availableYears, onYearChange }: CalendarProps) => {
    if (loading) {
      return <ActivityCalendar data={[]} theme={minimalTheme} maxLevel={5} loading />;
    }

    if (!data || data.length === 0) {
      return <ActivityCalendar data={[]} theme={minimalTheme} maxLevel={5} loading />;
    }

    const currentYear = year || new Date().getFullYear();
    
    return (
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div></div>
          {availableYears && availableYears.length > 0 && onYearChange && (
            <select 
              className="form-select form-select-sm" 
              style={{ width: 'auto', fontSize: '14px' }}
              value={currentYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>
        <ActivityCalendar 
          data={data} 
          theme={minimalTheme} 
          maxLevel={5}
        />
      </div>
    );
}

export default Calendar;