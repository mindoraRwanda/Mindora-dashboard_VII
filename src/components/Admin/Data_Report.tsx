import { useState } from 'react';
import { FaFileAlt, FaDownload, FaChartBar } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

// Define the Report type
const reports = [
  { id: 1, title: "Monthly Patient Progress", date: "2024-07-01", type: "progress" },
  { id: 2, title: "Therapy Session Summary", date: "2024-07-15", type: "summary" },
  { id: 3, title: "Treatment Effectiveness Analysis", date: "2024-07-30", type: "analysis" },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReports, setFilteredReports] = useState(reports);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.type.toLowerCase().includes(query)
    );
    setFilteredReports(filtered);
  };

  const renderReportDetails = (report) => {
    switch (report.type) {
      case 'progress':
        return (
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <h3 className="font-semibold">Monthly Patient Progress</h3>
            <p>This report shows the progress of patients over the last month.</p>
            <div className="mt-2">
              <FaChartBar className="inline mr-2" />
              Progress Chart would be displayed here
            </div>
          </div>
        );
      case 'summary':
        return (
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <h3 className="font-semibold">Therapy Session Summary</h3>
            <p>A summary of all therapy sessions conducted this month.</p>
            <ul className="list-disc list-inside mt-2">
              <li>Total sessions: 45</li>
              <li>Average session duration: 50 minutes</li>
              <li>Most common topics: Anxiety, Depression, Stress Management</li>
            </ul>
          </div>
        );
      case 'analysis':
        return (
          <div className="mt-4 p-4 bg-purple-100 rounded-lg">
            <h3 className="font-semibold">Treatment Effectiveness Analysis</h3>
            <p>An analysis of the effectiveness of different treatment methods.</p>
            <div className="mt-2">
              <FaChartBar className="inline mr-2" />
              Effectiveness comparison chart would be displayed here
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">Reports</h2>
        <div className="items-center border rounded bg-white flex float-right">
          <input
            type="text"
            name="query"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="rounded-l outline-none text-black m-3"
          />
          <button type="submit" className="p-2 text-xl text-black bg-white rounded-r">
            <FiSearch />
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <ul className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <li key={report.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaFileAlt className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.title}
                    </p>
                    <p className="text-sm text-gray-500">{report.date}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selectedReport && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{selectedReport.title}</h3>
              {renderReportDetails(selectedReport)}
              <button className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <FaDownload className="mr-2" />
                Download Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
