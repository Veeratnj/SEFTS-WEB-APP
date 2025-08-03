import { useState } from 'react';
import History from './History'; // your existing equity trade history component
import OptionHistory from './OptionsHistory'; // the component you built earlier for options

export default function TradeTabs() {
  const [tradeSource, setTradeSource] = useState<'Equity' | 'Options'>('Equity');

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {['Equity', 'Options'].map((tab) => (
          <button
            key={tab}
            onClick={() => setTradeSource(tab as 'Equity' | 'Options')}
            className={`py-2 px-[0.4rem] font-semibold ${
              tradeSource === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {tradeSource === 'Equity' ? <History /> : <OptionHistory />}
    </div>
  );
}
