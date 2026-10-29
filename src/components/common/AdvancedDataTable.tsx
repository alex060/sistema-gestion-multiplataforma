/**
 * Componente: AdvancedDataTable
 * Fase 2 - Paso 2.1 y 2.2: Componente Reutilizable Avanzado de Tabla de Datos (RA 3)
 * Totalmente agnóstico, parametrizable mediante Props y con emisión de Callbacks (Outputs).
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react';
import {
  chevronUpOutline,
  chevronDownOutline,
  swapVerticalOutline,
  chevronBackOutline,
  chevronForwardOutline,
  downloadOutline,
  documentTextOutline,
  funnelOutline
} from 'ionicons/icons';

export interface ColumnConfig<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface AdvancedDataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  keyExtractor?: (item: T) => string | number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filterCategoryKey?: keyof T;
  filterCategories?: { label: string; value: string }[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  onExportCSV?: (filteredData: T[]) => void;
  onExportPDF?: (filteredData: T[]) => void;
  onSearchChange?: (term: string) => void;
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
}

export function AdvancedDataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchPlaceholder = 'Buscar en los registros...',
  searchFields,
  filterCategoryKey,
  filterCategories,
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 25],
  actions,
  onRowClick,
  emptyMessage = 'No se encontraron registros coincidentes.',
  onExportCSV,
  onExportPDF,
  onSearchChange,
  onSortChange,
  onPageChange
}: AdvancedDataTableProps<T>) {
  // Estado local del componente
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // 1. Filtrado por búsqueda en tiempo real
  const searchFilteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim() !== '') {
      const termLower = searchTerm.toLowerCase();
      result = result.filter((item) => {
        if (searchFields && searchFields.length > 0) {
          return searchFields.some((field) => {
            const val = item[field];
            return val !== undefined && val !== null && String(val).toLowerCase().includes(termLower);
          });
        }
        // Búsqueda en todas las propiedades del objeto si no se especifican searchFields
        return Object.values(item).some((val) =>
          val !== undefined && val !== null && String(val).toLowerCase().includes(termLower)
        );
      });
    }

    if (filterCategoryKey && selectedCategory !== 'ALL') {
      result = result.filter((item) => String(item[filterCategoryKey]) === selectedCategory);
    }

    return result;
  }, [data, searchTerm, selectedCategory, filterCategoryKey, searchFields]);

  // 2. Ordenación
  const sortedData = useMemo(() => {
    if (!sortField) return searchFilteredData;

    return [...searchFilteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB), 'es', { numeric: true });
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [searchFilteredData, sortField, sortDirection]);

  // 3. Paginación
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);

  // Manejadores con notificación al padre (Callbacks / Outputs)
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (onSearchChange) onSearchChange(term);
  }, [onSearchChange]);

  const handleSort = useCallback((columnKey: string, sortable?: boolean) => {
    if (!sortable) return;

    let nextDir: 'asc' | 'desc' = 'asc';
    if (sortField === columnKey) {
      nextDir = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(nextDir);
    } else {
      setSortField(columnKey);
      setSortDirection('asc');
    }

    if (onSortChange) onSortChange(columnKey, nextDir);
  }, [sortField, sortDirection, onSortChange]);

  const handlePageChange = useCallback((newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    if (onPageChange) onPageChange(clamped);
  }, [totalPages, onPageChange]);

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
      role="region"
      aria-label="Tabla de datos interactiva"
    >
      {/* Barra superior de herramientas: Filtros, Búsqueda y Exportación */}
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {searchable && (
          <div style={{ flex: '1 1 260px', maxWidth: '420px' }}>
            <IonSearchbar
              value={searchTerm}
              onIonInput={(e) => handleSearch(e.detail.value || '')}
              placeholder={searchPlaceholder}
              debounce={250}
              style={{ padding: 0 }}
              aria-label={searchPlaceholder}
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Botones de Exportación opcionales */}
          {onExportCSV && (
            <IonButton
              size="small"
              fill="outline"
              color="medium"
              onClick={() => onExportCSV(sortedData)}
              aria-label="Descargar informe en formato CSV"
              style={{ fontWeight: 600 }}
            >
              <IonIcon slot="start" icon={downloadOutline} />
              CSV
            </IonButton>
          )}

          {onExportPDF && (
            <IonButton
              size="small"
              fill="outline"
              color="danger"
              onClick={() => onExportPDF(sortedData)}
              aria-label="Descargar informe ejecutivo en formato PDF"
              style={{ fontWeight: 600 }}
            >
              <IonIcon slot="start" icon={documentTextOutline} />
              PDF
            </IonButton>
          )}

          {/* Selector de registros por página */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Mostrar:</span>
            <IonSelect
              value={pageSize}
              onIonChange={(e) => {
                setPageSize(Number(e.detail.value));
                setCurrentPage(1);
              }}
              interface="popover"
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '0.85rem'
              }}
              aria-label="Filas por página"
            >
              {pageSizeOptions.map((opt) => (
                <IonSelectOption key={opt} value={opt}>
                  {opt}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>
      </div>

      {/* Segmento de categorías / estados opcional */}
      {filterCategories && filterCategories.length > 0 && (
        <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <IonSegment
            value={selectedCategory}
            onIonChange={(e) => {
              setSelectedCategory(String(e.detail.value));
              setCurrentPage(1);
            }}
            scrollable
            style={{ maxWidth: '650px' }}
          >
            <IonSegmentButton value="ALL">
              <IonLabel>Todos ({data.length})</IonLabel>
            </IonSegmentButton>
            {filterCategories.map((cat) => {
              const count = data.filter((item) => String(item[filterCategoryKey!]) === cat.value).length;
              return (
                <IonSegmentButton key={cat.value} value={cat.value}>
                  <IonLabel>{cat.label} ({count})</IonLabel>
                </IonSegmentButton>
              );
            })}
          </IonSegment>
        </div>
      )}

      {/* Contenedor con scroll horizontal para soporte Responsive estricto */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.875rem'
          }}
          role="table"
          aria-label="Datos tabulados"
        >
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              {columns.map((col) => {
                const isSorted = sortField === col.key;
                const align = col.align || 'left';
                return (
                  <th
                    key={String(col.key)}
                    style={{
                      padding: '0.85rem 1rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      width: col.width,
                      textAlign: align,
                      cursor: col.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => handleSort(String(col.key), col.sortable)}
                    role={col.sortable ? 'button' : 'columnheader'}
                    tabIndex={col.sortable ? 0 : undefined}
                    aria-sort={
                      isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'
                    }
                    onKeyDown={(e) => {
                      if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleSort(String(col.key), col.sortable);
                      }
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
                      }}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <IonIcon
                          icon={
                            isSorted
                              ? sortDirection === 'asc'
                                ? chevronUpOutline
                                : chevronDownOutline
                              : swapVerticalOutline
                          }
                          style={{
                            fontSize: '14px',
                            color: isSorted ? '#2563eb' : '#94a3b8'
                          }}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
              {actions && (
                <th
                  style={{
                    padding: '0.85rem 1rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    textAlign: 'right',
                    width: '120px'
                  }}
                >
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  style={{
                    padding: '2.5rem',
                    textAlign: 'center',
                    color: '#64748b'
                  }}
                >
                  <IonIcon icon={funnelOutline} style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => {
                const key = keyExtractor ? keyExtractor(item) : item.id || rowIdx;
                return (
                  <tr
                    key={key}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'background-color 0.15s ease'
                    }}
                    onClick={() => onRowClick && onRowClick(item)}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(item);
                      }
                    }}
                  >
                    {columns.map((col) => {
                      const align = col.align || 'left';
                      return (
                        <td
                          key={String(col.key)}
                          style={{
                            padding: '0.85rem 1rem',
                            textAlign: align,
                            color: '#334155'
                          }}
                        >
                          {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                        </td>
                      );
                    })}
                    {actions && (
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        {actions(item)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Barra de Paginación */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: '#64748b',
          background: '#ffffff'
        }}
      >
        <div>
          Mostrando{' '}
          <strong style={{ color: '#0f172a' }}>
            {totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
          </strong>{' '}
          a{' '}
          <strong style={{ color: '#0f172a' }}>
            {Math.min(safeCurrentPage * pageSize, totalItems)}
          </strong>{' '}
          de <strong style={{ color: '#0f172a' }}>{totalItems}</strong> registros
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <IonButton
            size="small"
            fill="clear"
            color="dark"
            disabled={safeCurrentPage <= 1}
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            aria-label="Página anterior"
          >
            <IonIcon slot="icon-only" icon={chevronBackOutline} />
          </IonButton>

          <span style={{ padding: '0 0.5rem', fontWeight: 600, color: '#1e293b' }}>
            Página {safeCurrentPage} de {totalPages}
          </span>

          <IonButton
            size="small"
            fill="clear"
            color="dark"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            aria-label="Página siguiente"
          >
            <IonIcon slot="icon-only" icon={chevronForwardOutline} />
          </IonButton>
        </div>
      </div>
    </div>
  );
}

export default AdvancedDataTable;
