import * as TabsPrimitive from '@radix-ui/react-tabs';
import React from 'react';

interface TabItem {
  id: string;
  label: string;
  count?: number;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ tabs, defaultValue, onValueChange }: TabsProps) {
  const defaultVal = defaultValue || tabs[0]?.id;

  return (
    <TabsPrimitive.Root defaultValue={defaultVal} onValueChange={onValueChange} className="w-full flex flex-col gap-6">
      <TabsPrimitive.List className="flex border-b border-[#C3C6D7]/40 gap-8">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            className="group relative pb-4 text-base font-semibold text-[#434655] hover:text-[#131B2E] transition-all duration-200 data-[state=active]:text-[#2563EB] outline-none"
          >
            <div className="flex items-center gap-2">
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#F0F4FF] text-[#2563EB] group-data-[state=active]:bg-[#2563EB] group-data-[state=active]:text-white transition-all duration-200">
                  {tab.count}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-transparent group-data-[state=active]:bg-[#2563EB] transition-all duration-200 rounded-t-full" />
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.id} value={tab.id} className="outline-none">
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
