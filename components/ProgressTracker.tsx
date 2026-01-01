'use client';

import { DailyCheckIn } from '@/types';

interface ProgressTrackerProps {
  checkIns: DailyCheckIn[];
  currentDay: number;
}

export default function ProgressTracker({ checkIns, currentDay }: ProgressTrackerProps) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const getStatusForDay = (day: number) => {
    const checkIn = checkIns.find(c => c.dayNumber === day);
    return checkIn?.status;
  };

  const getColorForStatus = (status?: string) => {
    switch (status) {
      case 'strong':
        return 'bg-success';
      case 'struggled':
        return 'bg-warning';
      case 'relapsed':
        return 'bg-error';
      default:
        return 'bg-base-300';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border-4 border-base-300 rounded-3xl">
      <div className="card-body p-6 sm:p-8">
        <h2 className="card-title text-sm sm:text-base mb-4">
          📅 30-Day Progress
        </h2>

        <div className="grid grid-cols-10 gap-1.5 mb-4">
          {days.map((day) => {
            const status = getStatusForDay(day);
            return (
              <div
                key={day}
                className={`tooltip ${status ? 'tooltip-top' : ''}`}
                data-tip={
                  status === 'strong' ? 'Strong day! 💪' :
                  status === 'struggled' ? 'Struggled but held on 👊' :
                  status === 'relapsed' ? 'Relapsed 🔄' :
                  day <= currentDay ? 'No check-in' : 'Future day'
                }
              >
                <div
                  className={`aspect-square rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all cursor-pointer transform
                    ${day <= currentDay ? getColorForStatus(status) : 'bg-base-200 opacity-40'}
                    ${day === currentDay ? 'ring-2 ring-primary ring-offset-1 ring-offset-base-100' : ''}
                    ${status ? 'text-white shadow-md hover:scale-110' : 'opacity-60'}
                  `}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="badge badge-success badge-outline gap-2 py-3">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span>Strong</span>
          </div>
          <div className="badge badge-warning badge-outline gap-2 py-3">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <span>Struggled</span>
          </div>
          <div className="badge badge-error badge-outline gap-2 py-3">
            <div className="w-2 h-2 rounded-full bg-error"></div>
            <span>Relapsed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
