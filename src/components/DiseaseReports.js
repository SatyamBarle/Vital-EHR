import React, { useState } from 'react';
import { getDiseaseReports } from '../services/firebaseService'; // Service to fetch data
import './DiseaseReports.css'; // Styling for report generation

function DiseaseReports() {
  const [diseaseTitle, setDiseaseTitle] = useState(''); // Use title instead of diseaseType
  const [startDate, setStartDate] = useState(''); // Ensure correct date format is used
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState('');

  // Handle generating the report
  const handleGenerateReport = async () => {
    console.log('Generating report for:', diseaseTitle, startDate, endDate); // Debug log
    try {
      const data = await getDiseaseReports(diseaseTitle, startDate, endDate);
      console.log('Fetched data:', data); // Debug log
      if (data.length === 0) {
        setError('No data found for the given disease and date range.');
      } else {
        setReportData(data);
        setError('');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Error generating report.');
    }
  };

  // Handle downloading the CSV
  const handleDownloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Date,Title,Description\n' + // CSV Header
      reportData.map(record => `${record.date},${record.title},${record.description}`).join('\n'); // CSV rows
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `disease_report_${diseaseTitle}_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="disease-report-container">
      <h2>Generate Communicable Disease Report</h2>

      {/* Form to select disease title, start date, and end date */}
      <div className="form-group">
        <label>Disease Title:</label>
        <select value={diseaseTitle} onChange={(e) => setDiseaseTitle(e.target.value)}>
          <option value="">Select Disease</option>
          <option value="TB Diagnosis">TB</option>
          <option value="MMR Vaccination">MMR</option>
          <option value="IMR Report">IMR</option>
          <option value="Tubectomy Surgery">Tubectomy</option>
          <option value="Cataract Surgery">Cataract</option>
          <option value="Spine Flu">Spine Flu</option>
        </select>
      </div>

      {/* Date range selection */}
      <div className="form-group">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <button onClick={handleGenerateReport}>Generate Report</button>

      {/* Error message display */}
      {error && <p className="error-message">{error}</p>}

      {/* Report data display and download option */}
      {reportData.length > 0 && (
        <div className="report-results">
          <h3>Report for {diseaseTitle}</h3>
          <ul>
            {reportData.map((record, index) => (
              <li key={index}>{record.date} - {record.description}</li>
            ))}
          </ul>
          <button onClick={handleDownloadCSV}>Download as CSV</button>
        </div>
      )}
    </div>
  );
}

export default DiseaseReports;
