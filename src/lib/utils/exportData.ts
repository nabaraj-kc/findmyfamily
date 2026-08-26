export function exportToJson(data: any[], filename = 'findmyfamily-cases.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename);
}

export function exportToCsv(cases: any[], filename = 'findmyfamily-cases.csv') {
  if (!cases || cases.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = [
    'Case ID',
    'Type',
    'Status',
    'Full Name',
    'Age',
    'Gender',
    'District ID',
    'Last Known Location',
    'Date',
    'Features',
    'Clothing',
    'Reporter Name',
    'Reporter Phone',
    'Relationship',
    'Trust Tier',
    'Created At'
  ];

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = cases.map(c => [
    escapeCsv(c.caseId),
    escapeCsv(c.type),
    escapeCsv(c.status),
    escapeCsv(c.fullName),
    escapeCsv(c.age),
    escapeCsv(c.gender),
    escapeCsv(c.districtId || c.district),
    escapeCsv(c.lastKnownLocation || c.lastSeenLocation || c.foundLocation),
    escapeCsv(c.dateStr || c.lastSeenDate || c.foundDate),
    escapeCsv(c.features),
    escapeCsv(c.clothing),
    escapeCsv(c.reporterName),
    escapeCsv(c.reporterPhone),
    escapeCsv(c.relationship),
    escapeCsv(c.trustTier),
    escapeCsv(c.createdAt)
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

export function printOrSavePdf(cases: any[], title = 'Find My Family — Disaster Relief Report') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the printable PDF report.');
    return;
  }

  const dateGenerated = new Date().toLocaleString();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #000000; background: #ffffff; }
          h1 { color: #000000; margin-bottom: 4px; font-size: 22px; font-weight: 700; }
          .header { border-bottom: 2px solid #000000; padding-bottom: 12px; margin-bottom: 20px; }
          .meta { font-size: 11px; color: #52525b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th { background: #f4f4f5; text-align: left; padding: 8px 10px; border: 1px solid #d4d4d8; font-weight: 700; color: #000000; }
          td { padding: 8px 10px; border: 1px solid #e4e4e7; vertical-align: top; }
          tr:nth-child(even) { background-color: #fafafa; }
          .badge { display: inline-block; padding: 2px 6px; border: 1px solid #000000; border-radius: 3px; font-size: 10px; font-weight: bold; background: #ffffff; color: #000000; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="meta">Generated: ${dateGenerated} | Total Records: ${cases.length} | Emergency Hotlines: 100 / 1149</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Status</th>
              <th>Full Name</th>
              <th>Age/Gender</th>
              <th>Last Known Location / District</th>
              <th>Physical Features & Clothing</th>
              <th>Contact Info</th>
            </tr>
          </thead>
          <tbody>
            ${cases.map(c => `
              <tr>
                <td><strong>${c.caseId}</strong></td>
                <td><span class="badge">${(c.status || '').toUpperCase()}</span></td>
                <td><strong>${c.fullName || 'Unknown'}</strong></td>
                <td>${c.age || 'N/A'} yrs / ${c.gender || 'N/A'}</td>
                <td>${c.lastKnownLocation || c.lastSeenLocation || c.foundLocation || 'N/A'}</td>
                <td>${c.features ? c.features + '<br/>' : ''}${c.clothing ? '<em>Clothing: ' + c.clothing + '</em>' : ''}</td>
                <td>${c.reporterName ? c.reporterName + '<br/>' : ''}${c.reporterPhone || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
