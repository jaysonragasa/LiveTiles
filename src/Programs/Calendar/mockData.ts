export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  color: string;
  time?: string;
  duration?: number; // hours
}

export function generateMockEvents(): CalendarEvent[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  return [
    {
      id: '1',
      date: new Date(year, month, 5),
      title: 'Design meeting',
      time: '10a',
      color: 'bg-[#008A00]'
    },
    {
      id: '2',
      date: new Date(year, month, 7),
      title: 'Client meeting',
      time: '9a',
      color: 'bg-[#008A00]'
    },
    {
      id: '3',
      date: new Date(year, month, 12),
      title: 'Project due',
      time: '9a',
      color: 'bg-[#008A00]'
    },
    {
      id: '4',
      date: new Date(year, month, 12),
      title: 'Lunch with Jim',
      time: '12p',
      color: 'bg-[#008A00]'
    },
    {
      id: '5',
      date: new Date(year, month, 14),
      title: 'Flag Day',
      color: 'bg-[#00A4EF]'
    },
    {
      id: '6',
      date: new Date(year, month, 15),
      title: 'Team meeting',
      time: '9a',
      color: 'bg-[#008A00]'
    },
    {
      id: '7',
      date: new Date(year, month, 15),
      title: 'Conference call',
      time: '10a',
      color: 'bg-[#008A00]'
    },
    {
      id: '8',
      date: new Date(year, month, 16),
      title: 'Softball game',
      time: '3p',
      color: 'bg-[#008A00]'
    },
    {
      id: '9',
      date: new Date(year, month, 17),
      title: "Father's Day",
      color: 'bg-[#00A4EF]'
    },
    {
      id: '10',
      date: new Date(year, month, 18),
      title: 'Design conference',
      color: 'bg-[#008A00]',
      duration: 5 // spans 5 days in UI if we want to implement multi-day
    }
  ];
}
