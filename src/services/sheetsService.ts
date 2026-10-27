import type { LetterRecord } from '../types';

export const SHEET_HEADERS = [
  'No. Urut',
  'Tanggal Surat',
  'Nomor Surat',
  'Jenis Surat',
  'Perihal / Hal',
  'Nama Terkait (Siswa / Guru)',
  'NISN / NIP',
  'Kelas / Jabatan',
  'Tujuan / Penerima',
  'Keperluan / Agenda',
  'Status',
  'Waktu Input Sistem',
];

export interface CreatedSpreadsheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

/**
 * Creates a brand-new Google Spreadsheet formatted specifically for SMP letter administration records
 */
export async function createSchoolLetterSpreadsheet(
  accessToken: string,
  schoolName: string
): Promise<CreatedSpreadsheetResult> {
  const currentYear = new Date().getFullYear();
  const title = `Buku Agenda Surat Keluar - ${schoolName} (${currentYear})`;

  const requestBody = {
    properties: {
      title,
      timeZone: 'Asia/Jakarta',
    },
    sheets: [
      {
        properties: {
          title: 'Arsip Surat Keluar',
          gridProperties: {
            rowCount: 1000,
            columnCount: SHEET_HEADERS.length + 2,
            frozenRowCount: 1,
          },
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: SHEET_HEADERS.map((header) => ({
                  userEnteredValue: { stringValue: header },
                  userEnteredFormat: {
                    backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, // Navy blue official header
                    textFormat: {
                      bold: true,
                      foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                      fontSize: 10,
                    },
                    horizontalAlignment: 'CENTER',
                  },
                })),
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson?.error?.message || errorDetail;
    } catch {
      const errorText = await response.text();
      errorDetail = errorText || errorDetail;
    }
    console.error('Failed to create spreadsheet:', errorDetail);
    throw new Error(`Gagal membuat Spreadsheet: ${errorDetail}`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
    title: data.properties?.title || title,
  };
}

/**
 * Format LetterRecord into an array of cell values matching SHEET_HEADERS
 */
export function formatLetterToRowValues(letter: LetterRecord): (string | number)[] {
  let namaTerkait = '-';
  let identitas = '-';
  let keteranganTerkait = '-';

  if (letter.dataSiswa) {
    namaTerkait = letter.dataSiswa.nama;
    identitas = letter.dataSiswa.nisn ? `NISN: ${letter.dataSiswa.nisn}` : `NIS: ${letter.dataSiswa.nis}`;
    keteranganTerkait = `Kelas: ${letter.dataSiswa.kelas}`;
  } else if (letter.dataGuru) {
    namaTerkait = letter.dataGuru.nama;
    identitas = letter.dataGuru.nip ? `NIP: ${letter.dataGuru.nip}` : '-';
    keteranganTerkait = letter.dataGuru.jabatan || 'Guru';
  }

  const jenisLabel: Record<string, string> = {
    keterangan_aktif: 'Surat Ket. Siswa Aktif',
    berkelakuan_baik: 'Surat Ket. Berkelakuan Baik',
    dispensasi_kegiatan: 'Surat Dispensasi Siswa',
    mutasi_keluar: 'Surat Ket. Pindah Sekolah',
    surat_tugas: 'Surat Tugas Guru/Tendik',
    undangan_ortu: 'Surat Undangan Wali Murid',
    panggilan_bk: 'Surat Panggilan Orang Tua BK',
    surat_pengantar: 'Surat Pengantar Dinas',
  };

  return [
    letter.noUrut,
    letter.tanggalSurat,
    letter.nomorSurat,
    jenisLabel[letter.jenis] || letter.jenis,
    letter.perihal,
    namaTerkait,
    identitas,
    keteranganTerkait,
    letter.tujuanPenerima || 'Pihak Terkait / Yang Berkepentingan',
    letter.keperluan || letter.dataUndangan?.agenda || letter.dataBK?.masalah || '-',
    'Tercatat & Diterbitkan',
    letter.createdAt,
  ];
}

/**
 * Appends a single letter record as a new row in Google Sheets
 */
export async function appendLetterToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  letter: LetterRecord
): Promise<boolean> {
  const values = [formatLetterToRowValues(letter)];
  const range = 'Arsip Surat Keluar!A:L';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    // If sheet name 'Arsip Surat Keluar' does not exist in an existing imported sheet, try Sheet1
    const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const fallbackRes = await fetch(fallbackUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    if (!fallbackRes.ok) {
      const err = await fallbackRes.text();
      console.error('Append to sheet failed:', err);
      throw new Error('Gagal menambahkan baris surat ke Google Sheets');
    }
  }

  return true;
}

/**
 * Batch append multiple letters to Google Sheets
 */
export async function batchAppendLettersToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  letters: LetterRecord[]
): Promise<number> {
  if (letters.length === 0) return 0;
  const values = letters.map((l) => formatLetterToRowValues(l));
  const range = 'Arsip Surat Keluar!A:L';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const fallbackRes = await fetch(fallbackUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    if (!fallbackRes.ok) {
      throw new Error('Gagal melakukan sinkronisasi massal ke Google Sheets');
    }
  }

  return letters.length;
}

/**
 * Fetch rows from Google Sheets
 */
export async function fetchSpreadsheetRows(
  accessToken: string,
  spreadsheetId: string
): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:L200`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data dari Google Spreadsheet');
  }

  const data = await response.json();
  return data.values || [];
}

/**
 * Search user's Google Drive for existing spreadsheets to connect
 */
export async function searchSpreadsheetsInDrive(accessToken: string): Promise<
  Array<{ id: string; name: string; modifiedTime?: string }>
> {
  const query = "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,modifiedTime)&pageSize=15&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.warn('Drive search returned error or no files:', response.status);
    return [];
  }

  const data = await response.json();
  return data.files || [];
}
