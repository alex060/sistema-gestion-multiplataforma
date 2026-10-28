/**
 * Servicio: ExportService
 * Fase 3 - Paso 3.3: Exportación de datos en formatos estándar (CSV y PDF) (RA 5)
 */

import { EnterpriseRecord } from '../models/record.model';

export interface ExportColumn<T> {
  key: keyof T | string;
  header: string;
}

class ExportService {
  /**
   * Exporta un conjunto de datos a formato CSV con codificación UTF-8 (BOM para Excel)
   */
  public exportToCSV<T extends Record<string, any>>(
    filename: string,
    data: T[],
    columns: ExportColumn<T>[]
  ): void {
    if (!data || data.length === 0) {
      alert('No hay datos disponibles para exportar.');
      return;
    }

    // Cabeceras
    const headerRow = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(';');

    // Filas de datos
    const rows = data.map((item) => {
      return columns
        .map((c) => {
          const val = item[c.key as keyof T];
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(';');
    });

    const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename.replace(/\.csv$/i, '')}_${this.getTimestamp()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Genera y abre una vista de informe ejecutivo tabulado con diseño corporativo optimizado para PDF
   * (mediante ventana emergente formateada lista para guardar como PDF en un clic).
   */
  public exportRecordsToPDF(
    title: string,
    records: EnterpriseRecord[],
    user: { name: string; role: string }
  ): void {
    if (!records || records.length === 0) {
      alert('No hay expedientes para generar el informe PDF.');
      return;
    }

    const totalBudget = records.reduce((acc, r) => acc + r.budget, 0);
    const approvedCount = records.filter((r) => r.status === 'APROBADO').length;
    const reviewCount = records.filter((r) => r.status === 'EN_REVISION').length;
    const rejectedCount = records.filter((r) => r.status === 'RECHAZADO').length;

    const printWindow = window.open('', '_blank', 'width=1000,height=750');
    if (!printWindow) {
      alert('Por favor, permite ventanas emergentes para generar el informe PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${title} — Nexus ERP</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 20px;
            background: #ffffff;
            font-size: 12px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .logo-title h1 {
            margin: 0;
            color: #1e3a8a;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .logo-title p {
            margin: 2px 0 0 0;
            color: #64748b;
            font-size: 11px;
          }
          .meta-box {
            text-align: right;
            font-size: 10px;
            color: #475569;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .summary-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
          }
          .summary-card .val {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 4px;
          }
          .summary-card .lbl {
            font-size: 9px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #1e293b;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
            font-size: 10.5px;
          }
          td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 10.5px;
          }
          tr:nth-child(even) td {
            background: #f8fafc;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .badge-aprobado { background: #dcfce7; color: #15803d; }
          .badge-revision { background: #fef3c7; color: #b45309; }
          .badge-rechazado { background: #fee2e2; color: #b91c1c; }
          .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #64748b;
          }
          .print-toolbar {
            background: #1e293b;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .btn-print {
            background: #2563eb;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
          }
          @media print {
            .print-toolbar { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-toolbar">
          <span>Vista previa de impresión de informe PDF corporativo</span>
          <button class="btn-print" onclick="window.print()">Imprimir / Guardar como PDF</button>
        </div>

        <div class="header">
          <div class="logo-title">
            <h1>NEXUS ERP · GESTIÓN MULTIPLATAFORMA</h1>
            <p>Módulo de Desarrollo de Interfaces (0488) — Reporte Tabulado Oficial</p>
          </div>
          <div class="meta-box">
            <strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-ES')}<br>
            <strong>Generado por:</strong> ${user.name} (${user.role})<br>
            <strong>ID Informe:</strong> RPT-${Date.now().toString(36).toUpperCase()}
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <div class="lbl">Expedientes Totales</div>
            <div class="val">${records.length}</div>
          </div>
          <div class="summary-card">
            <div class="lbl">Presupuesto Consolidado</div>
            <div class="val" style="color: #15803d;">${totalBudget.toLocaleString('es-ES')} €</div>
          </div>
          <div class="summary-card">
            <div class="lbl">Aprobados / Revisión</div>
            <div class="val">${approvedCount} / ${reviewCount}</div>
          </div>
          <div class="summary-card">
            <div class="lbl">Rechazados</div>
            <div class="val" style="color: #b91c1c;">${rejectedCount}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Título del Expediente</th>
              <th>Categoría</th>
              <th>Presupuesto</th>
              <th>Estado</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${records
              .map(
                (r) => `
              <tr>
                <td><strong>${r.code}</strong></td>
                <td>${r.title}</td>
                <td>${r.category}</td>
                <td style="font-weight:600; color:#15803d;">${r.budget.toLocaleString('es-ES')} €</td>
                <td>
                  <span class="badge ${
                    r.status === 'APROBADO'
                      ? 'badge-aprobado'
                      : r.status === 'EN_REVISION'
                      ? 'badge-revision'
                      : 'badge-rechazado'
                  }">
                    ${r.status.replace('_', ' ')}
                  </span>
                </td>
                <td>${r.createdByName}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <span>Nexus ERP Platform · Sistema de Gestión Multiplataforma Certificado (WCAG 2.1 AA)</span>
          <span>Página 1 de 1 · Documento oficial inmutable</span>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  private getTimestamp(): string {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  }
}

export const exportService = new ExportService();
export default exportService;
