import { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, ArrowUpDown } from 'lucide-react';
import { cn } from './ui/utils';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface SmartTableProps {
  title?: string;
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export function SmartTable({ 
  columns, 
  data, 
  onRowClick,
  searchable = true,
  searchPlaceholder = "Search..."
}: SmartTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
          />
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={cn(
                    "text-[#6F83A7]",
                    column.sortable && "cursor-pointer select-none hover:text-[#EAB308]"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && <ArrowUpDown className="w-3.5 h-3.5" />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-white/5 hover:bg-white/5 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-white">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12 text-[#6F83A7]">
          No data found
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status, variant }: { status: string; variant?: 'default' | 'success' | 'warning' | 'error' }) {
  const variantStyles = {
    default: 'bg-[#6F83A7]/20 text-[#6F83A7]',
    success: 'bg-[#57ACAF]/20 text-[#57ACAF]',
    warning: 'bg-[#EAB308]/20 text-[#EAB308]',
    error: 'bg-[#D0342C]/20 text-[#D0342C]',
  };

  return (
    <Badge className={cn("rounded-lg", variantStyles[variant || 'default'])}>
      {status}
    </Badge>
  );
}
