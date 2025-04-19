// import React, { useState, useEffect } from 'react';
// import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
// import get_api_call from '../services/GetAPI';

// const SidebarComponent: React.FC = () => {
//   const [nseStocks, setNseStocks] = useState([
//     { name: 'RELIANCE', points: 12.34, percentage: 1.23 },
//     { name: 'TCS', points: -8.56, percentage: -0.87 },
//     { name: 'INFY', points: 5.21, percentage: 0.45 },
//     { name: 'HDFC', points: -3.87, percentage: -1.12 },
//     { name: 'SBIN', points: 0.45, percentage: 0.18 },
//   ]);

//   const [optionsStocks, setOptionsStocks] = useState([
//     { name: 'NIFTY 50', points: 15.22, percentage: 1.45 },
//     { name: 'BANKNIFTY', points: -7.14, percentage: -0.56 },
//     { name: 'FINNIFTY', points: 4.67, percentage: 0.72 },
//   ]);

//   const [selectedTab, setSelectedTab] = useState<'NSE' | 'Options'>('NSE');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [nseFavs, setNseFavs] = useState<string[]>([]);
//   const [optionFavs, setOptionFavs] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log('Fetching stock data...');
//         const nseData = await get_api_call('http://127.0.0.1:8000/common/get/stock/tocken');
//         const optionsData = await get_api_call('http://127.0.0.1:8000/common/get/stock/tocken');

//         console.log('NSE Stocks:', nseData);
//         console.log('Options Stocks:', optionsData);

//         if (Array.isArray(nseData.data)) {
//           setNseStocks(nseData.data);
//         }

//         if (Array.isArray(optionsData.data)) {
//           setOptionsStocks(optionsData.data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch stock data', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const stocks = selectedTab === 'NSE' ? nseStocks : optionsStocks;
//   const favs = selectedTab === 'NSE' ? nseFavs : optionFavs;
//   const setFavs = selectedTab === 'NSE' ? setNseFavs : setOptionFavs;

//   // Filter the stocks based on the search term
//   const filteredStocks = stocks.filter(stock =>
//     stock.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddFav = (stock: string) => {
//     if (!favs.includes(stock)) {
//       setFavs([...favs, stock]);
//       setSearchTerm('');
//     }
//   };

//   const handleRemoveFav = (stock: string) => {
//     setFavs(favs.filter(f => f !== stock));
//     setSearchTerm('');
//   };

//   const getArrowIcon = (points: number) =>
//     points >= 0 ? (
//       <FaArrowUp className="text-green-600 text-xs ml-1" />
//     ) : (
//       <FaArrowDown className="text-red-600 text-xs ml-1" />
//     );

//   return (
//     <div className="bg-white rounded-xl shadow p-4 h-full">
//       {/* Tab buttons */}
//       <div className="flex space-x-2 mb-4">
//         {['NSE', 'Options'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => {
//               setSelectedTab(tab as 'NSE' | 'Options');
//               setSearchTerm('');
//             }}
//             className={`px-4 py-2 rounded-lg font-medium ${
//               selectedTab === tab
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Search bar */}
//       <div className="mb-2 relative">
//         <input
//           type="text"
//           value={searchTerm}
//           placeholder={`Search ${selectedTab}...`}
//           onChange={e => setSearchTerm(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
//         />

//         {searchTerm && filteredStocks.length > 0 && (
//           <div className="absolute bg-white border rounded w-full shadow mt-1 z-10">
//             {filteredStocks.map(stock => {
//               // Check if stock data is valid
//               if (!stock || stock.points === undefined || stock.percentage === undefined) {
//                 return null; // Skip if invalid
//               }
//               return (
//                 <div
//                   key={stock.name}
//                   className="flex justify-between items-center px-3 py-2 hover:bg-gray-100"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">{stock.name}</span>
//                     <span
//                       className={`text-sm ${
//                         stock.points >= 0 ? 'text-green-600' : 'text-red-600'
//                       } flex items-center`}
//                     >
//                       {stock.points?.toFixed(2)}
//                       {getArrowIcon(stock.points)}
//                       <span className="ml-1">
//                         ({stock.percentage?.toFixed(2)}%)
//                       </span>
//                     </span>
//                   </div>
//                   {favs.includes(stock.name) ? (
//                     <button
//                       className="text-red-500 text-xs"
//                       onClick={() => handleRemoveFav(stock.name)}
//                     >
//                       Remove
//                     </button>
//                   ) : (
//                     <button
//                       className="text-blue-500 text-xs"
//                       onClick={() => handleAddFav(stock.name)}
//                     >
//                       Add
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {searchTerm && filteredStocks.length === 0 && (
//           <div className="absolute bg-white border rounded w-full shadow mt-1 z-10">
//             <div className="px-3 py-2 text-gray-600">No matching stocks found</div>
//           </div>
//         )}
//       </div>

//       {/* Favorites list */}
//       {favs.length > 0 && (
//         <div className="mt-4">
//           <h4 className="text-sm font-semibold text-gray-800 mb-2">
//             Favorite {selectedTab} Stocks
//           </h4>
//           <ul className="space-y-1 text-sm">
//             {favs.map(favName => {
//               const stock = stocks.find(s => s.name === favName);
//               if (!stock) return null; // Skip if stock data is missing
//               return (
//                 <li
//                   key={favName}
//                   className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">{stock.name}</span>
//                     <span
//                       className={`text-sm ${
//                         stock.points >= 0 ? 'text-green-600' : 'text-red-600'
//                       } flex items-center`}
//                     >
//                       {stock.points?.toFixed(2)}
//                       {getArrowIcon(stock.points)}
//                       <span className="ml-1">
//                         ({stock.percentage?.toFixed(2)}%)
//                       </span>
//                     </span>
//                   </div>
//                   <button
//                     className="text-red-500 text-xs"
//                     onClick={() => handleRemoveFav(stock.name)}
//                   >
//                     Remove
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SidebarComponent;
