"use client";

import { useMemo, useState } from "react";

interface Column<T> {
  id: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  rowsPerPageOptions?: number[];
}

export default function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  onRowClick,
  rowsPerPageOptions = [5, 10, 20],
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<string>("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // Filter data by search keyword
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // Sort data by column
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[orderBy];
      const valB = b[orderBy];
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  // Pagination
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle sorting click
  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-lg"></div>
      
      <div className="relative">
        {/* Search box */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
              従業員一覧
            </h3>
            <p className="text-gray-600 text-sm mt-2 backdrop-blur-sm bg-white/50 rounded-lg px-3 py-1 inline-block">
              {filteredData.length} 件のレコードが見つかりました
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="名前、メールアドレスなどで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 border border-white/30 bg-white/80 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 transition-all duration-200 text-gray-900 placeholder-gray-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-white/30 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
                  {columns.map((col) => (
                    <th
                      key={col.id as string}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-800 cursor-pointer hover:bg-white/30 transition-all duration-200 group"
                      onClick={() => handleSort(col.id as string)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="group-hover:text-blue-700 transition-colors duration-200">
                          {col.label}
                        </span>
                        <div className="flex flex-col">
                          <svg className={`w-3 h-3 transition-colors duration-200 ${
                            orderBy === col.id && order === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <svg className={`w-3 h-3 transition-colors duration-200 ${
                            orderBy === col.id && order === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/30">
                {paginatedData.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => onRowClick?.(row)}
                    className="hover:bg-white/50 cursor-pointer transition-all duration-200 group border-b border-white/20"
                  >
                    {columns.map((col) => (
                      <td 
                        key={col.id as string} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 group-hover:text-gray-900 transition-colors duration-200"
                      >
                        {col.render ? col.render(row) : (
                          col.id === 'role' ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                              row[col.id] === 'ADMIN' 
                                ? 'bg-purple-100/80 text-purple-800 border-purple-200/50'
                                : 'bg-green-100/80 text-green-800 border-green-200/50'
                            }`}>
                              {row[col.id]}
                            </span>
                          ) : (
                            <span className="text-gray-700 group-hover:text-gray-900">{row[col.id]}</span>
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Empty state */}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="backdrop-blur-sm bg-white/50 rounded-xl p-4 border border-white/30">
                          <p className="text-gray-700 text-lg font-medium">データが見つかりません</p>
                          <p className="text-gray-600 text-sm mt-1">検索条件を変更するか、別のキーワードをお試しください</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 px-2">
          <div className="text-sm text-gray-700 backdrop-blur-sm bg-white/50 rounded-lg px-3 py-2 border border-white/30">
            全 <span className="font-semibold text-gray-800">{sortedData.length}</span> 件中 
            <span className="font-semibold text-gray-800 mx-1">{page * rowsPerPage + 1}</span> - 
            <span className="font-semibold text-gray-800 mx-1">{Math.min((page + 1) * rowsPerPage, sortedData.length)}</span> 件を表示
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 backdrop-blur-sm bg-white/50 rounded-lg px-3 py-2 border border-white/30">
              <span className="text-sm text-gray-700">表示件数:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                className="border border-white/30 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                {rowsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} 件
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1 backdrop-blur-sm bg-white/50 rounded-xl p-1 border border-white/30">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="p-2 rounded-lg border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500/20 hover:border-blue-300/50 transition-all duration-200 text-gray-700 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-lg border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500/20 hover:border-blue-300/50 transition-all duration-200 text-gray-700 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.ceil(sortedData.length / rowsPerPage))].slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 font-medium text-sm backdrop-blur-sm ${
                      page === index
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-white/30 text-gray-700 hover:bg-blue-500/20 hover:border-blue-300/50 hover:text-blue-700 bg-white/50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(sortedData.length / rowsPerPage) - 1}
                className="p-2 rounded-lg border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500/20 hover:border-blue-300/50 transition-all duration-200 text-gray-700 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setPage(Math.ceil(sortedData.length / rowsPerPage) - 1)}
                disabled={page >= Math.ceil(sortedData.length / rowsPerPage) - 1}
                className="p-2 rounded-lg border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500/20 hover:border-blue-300/50 transition-all duration-200 text-gray-700 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}