import React, { useState, useRef, useEffect } from 'react';

const DateTimeInput = () => {
  const [value, setValue] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const inputRef = useRef(null);

  // Format: DD/MM/YYYY HH:MM:SS
  // Position map (index dalam formatted string):
  // 0-1: DD, 2: /, 3-4: MM, 5: /, 6-9: YYYY, 10: spasi, 
  // 11-12: HH, 13: :, 14-15: MM, 16: :, 17-18: SS
  
  const formatDateTime = (numbers) => {
    let formatted = '';
    
    if (numbers.length > 0) formatted += numbers.slice(0, 2);
    if (numbers.length > 2) formatted += '/' + numbers.slice(2, 4);
    if (numbers.length > 4) formatted += '/' + numbers.slice(4, 8);
    if (numbers.length > 8) formatted += ' ' + numbers.slice(8, 10);
    if (numbers.length > 10) formatted += ':' + numbers.slice(10, 12);
    if (numbers.length > 12) formatted += ':' + numbers.slice(12, 14);
    
    return formatted;
  };

  // Menghitung posisi kursor yang ideal berdasarkan jumlah angka
  const getCursorPos = (numLength) => {
    if (numLength <= 2) return numLength;
    if (numLength <= 4) return numLength + 1; // +1 untuk slash pertama
    if (numLength <= 8) return numLength + 2; // +2 untuk 2 slash
    if (numLength <= 10) return numLength + 3; // +3 untuk 2 slash + spasi
    if (numLength <= 12) return numLength + 4; // +4 untuk separator waktu
    if (numLength <= 14) return numLength + 5; // +5 untuk semua separator
    return 19; // Max length
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    const prevCursorPos = inputRef.current?.selectionStart || 0;
    
    // Ambil hanya angka
    const numbersOnly = inputValue.replace(/\D/g, '').slice(0, 14);
    const prevNumbersOnly = prevValue.replace(/\D/g, '');
    
    // Deteksi apakah user menekan backspace/delete
    const isDeleting = numbersOnly.length < prevNumbersOnly.length;
    
    // Format ulang
    const formattedValue = formatDateTime(numbersOnly);
    setValue(formattedValue);
    setPrevValue(formattedValue);

    // Hitung posisi kursor baru
    let newCursorPos;
    
    if (isDeleting) {
      // Jika menghapus, kursor mundur sesuai jumlah angka yang hilang
      const deletedCount = prevNumbersOnly.length - numbersOnly.length;
      newCursorPos = Math.max(0, prevCursorPos - deletedCount);
      
      // Jika menghapus di posisi separator, loncat mundur lagi
      if (['/', ' ', ':'].includes(formattedValue[newCursorPos - 1] || '')) {
        newCursorPos = Math.max(0, newCursorPos - 1);
      }
    } else {
      // Jika menambah, cek apakah baru saja melengkapi segmen
      const numLen = numbersOnly.length;
      
      // Checkpoints dimana kursor harus loncat (setelah lengkap 2 digit untuk DD, MM, HH, MM, SS atau 4 digit untuk YYYY)
      const shouldJump = [2, 4, 8, 10, 12, 14].includes(numLen);
      
      if (shouldJump && cursorPos >= getCursorPos(numLen - 1)) {
        // User mengetik di akhir segmen, loncatkan kursor
        newCursorPos = getCursorPos(numLen);
      } else {
        // User mengetik di tengah, pertahankan posisi relatif
        newCursorPos = cursorPos;
        
        // Kompensasi jika ada separator yang bergeser
        const prevFormatted = formatDateTime(prevNumbersOnly);
        const addedSeparators = formattedValue.length - prevFormatted.length;
        if (addedSeparators > 0 && cursorPos > prevFormatted.length) {
          newCursorPos = cursorPos + addedSeparators;
        }
      }
    }
    
    // Set kursor setelah render selesai
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Izinkan navigasi arrow key normal
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      return;
    }
    
    // Blokir input non-angka kecuali backspace/delete
    if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Masukkan Tanggal & Waktu:
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="DD/MM/YYYY HH:MM:SS"
        maxLength={19}
        style={{
          padding: '10px',
          fontSize: '18px',
          width: '280px',
          letterSpacing: '1px',
          fontFamily: 'monospace',
          border: '2px solid #007bff',
          borderRadius: '6px',
          outline: 'none'
        }}
      />
      
      {/* Info Helper */}
      <div style={{ marginTop: '15px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tips:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px' }}>
          <li>Ketik angka, kursor otomatis loncat</li>
          <li>Tekan <code>Backspace</code> untuk hapus dan loncat mundur</li>
          <li>Klik di tengah untuk edit bagian spesifik</li>
        </ul>
      </div>
      
      {/* Debug Info */}
      <div style={{ marginTop: '20px', color: '#555', fontSize: '14px' }}>
        <div>Formatted: <code>{value || '(kosong)'}</code></div>
        <div>Raw Numbers: <code>{value.replace(/\D/g, '') || '(kosong)'}</code></div>
        <div>Length: <code>{value.replace(/\D/g, '').length}</code> / 14</div>
      </div>
    </div>
  );
};

export default DateTimeInput;