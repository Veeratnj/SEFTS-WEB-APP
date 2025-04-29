import React, { useState } from 'react';
import { motion } from 'framer-motion';

type DataRow = {
  [key: string]: string | number;
};

type Props = {
  data: DataRow[];
  caption: string;
};

export default function History({ data, caption }: Props) {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [searchText, setSearchText] = useState<string>('');

  const columns = Object.keys(data[0] || {});

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = data.filter(row => {
    const matchesFilters = Object.entries(filters).every(([key, value]) =>
      value === '' || String(row[key]) === value
    );

    const matchesSearch =
      searchText === '' ||
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );

    return matchesFilters && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full text-sm border-t">
          <caption className="caption-top text-lg font-semibold text-gray-800 p-4 bg-gray-100">
            {caption}
          </caption>

          {/* Table Header */}
          <motion.thead
            className="bg-indigo-600 text-white sticky top-0 z-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  className="text-left px-6 py-3 font-medium text-gray-800 hover:bg-indigo-50"
                >
                  <div className="flex flex-col">
                    <span className="capitalize">{col}</span>

                    <select
                      className="mt-2 text-xs rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                      value={filters[col] || ''}
                      onChange={e => handleFilterChange(col, e.target.value)}
                    >
                      <option value="">All</option>
                      {[...new Set(data.map(row => row[col]))].map(val => (
                        <option key={val as string} value={val as string}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>
              ))}
            </tr>
          </motion.thead>

          {/* Table Body */}
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="transition-all border-b even:bg-gradient-to-r even:from-gray-50 even:to-white hover:bg-gradient-to-r hover:from-indigo-100 hover:to-indigo-200 hover:scale-103 "
                >
                  {columns.map(col => (
                    <td
                      key={col}
                      className="px-6 py-4 text-gray-800 whitespace-nowrap hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-6 py-6 text-gray-400 italic"
                >
                  No matching data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
