'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'Count',
    color: '#2563eb',
  },
} satisfies ChartConfig;

type ChartPropsType = {
  data: {
    date: string;
    count: number;
  }[];
};

const Chart = ({ data }: ChartPropsType) => {
  return (
    <section className='mt-24'>
      <h1 className='text-4xl font-semibold text-center'>Monthly Bookings</h1>
      <ChartContainer config={chartConfig} className=' h-[300px] w-full'>
        <BarChart accessibilityLayer data={data} margin={{ top: 50 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey='date' tickLine={false} tickMargin={10} />
          <YAxis dataKey='count' allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar
            dataKey='count'
            fill='var(--color-count)'
            radius={4}
            maxBarSize={75}
          />
        </BarChart>
      </ChartContainer>
    </section>
  );
};

export default Chart;
