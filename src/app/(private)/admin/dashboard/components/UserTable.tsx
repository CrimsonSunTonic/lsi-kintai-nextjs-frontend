"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  TableSortLabel,
  Box,
  Typography,
} from "@mui/material";

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

  // --- Filter data by search keyword ---
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // --- Sort data by column ---
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

  // --- Pagination ---
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // --- Handle sorting click ---
  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  return (
    <Paper className="p-6 rounded-2xl shadow-lg bg-white">
      {/* Search box */}
      <Box mb={3} className="flex justify-end">
        <TextField
          size="small"
          placeholder="検査..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg"
          variant="outlined"
        />
      </Box>

      {/* Table */}
      <TableContainer className="border border-gray-200 rounded-lg">
        <Table>
          <TableHead className="bg-gray-200">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id as string}
                  className="font-semibold text-gray-700"
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => handleSort(col.id as string)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, i) => (
              <TableRow
                key={i}
                hover
                className="cursor-pointer transition-all hover:bg-gray-100"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <TableCell key={col.id as string}>
                    {col.render ? col.render(row) : (row[col.id] as any)}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {/* Empty state */}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="textSecondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={sortedData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={rowsPerPageOptions}
        className="mt-3"
      />
    </Paper>
  );
}
