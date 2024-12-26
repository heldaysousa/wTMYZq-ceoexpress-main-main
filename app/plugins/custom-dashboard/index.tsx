import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChartProps {
  titleKey: string;
  data: any;
}

interface DashboardGridProps {
  charts: ChartProps[];
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ charts }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {charts.map((chart, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t(chart.titleKey)}</h3>
          {/* Chart content rendering goes here */}
        </div>
      ))}
    </div>
  );
};
