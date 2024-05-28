import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../src/ui/components/Navbar'
import JSON2CSVNodeTransform from '@json2csv/node/Transform.js';
import JSON2CSVNodeAsyncParser from '@json2csv/node/AsyncParser.js';
import RESULTS from '../MarathonResults.json';


interface Athlete {
  rank: number;
  firstName: string;
  surname: string;
  athleteId: number;
  finishTime: string;
  raceProgress: string;
  teamName: string;
  bibNumber: number;
  countryName: string;
  country: string
}

function App() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sortField, setSortField] = useState<'rank' | 'bibNumber'>('rank');
  const sortedAthletes = [...athletes].sort((a, b) => a[sortField] - b[sortField]);

  useEffect(() => {
    axios.get('/api/results')
      .then(response => setAthletes(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleExport = () => {
    axios.get('/api/export-csv')
      .then(response => {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'race_results.csv';
        a.click();
      })
      .catch(error => console.error('Error exporting CSV:', error));
  };

  return (
  <>
  <div>
    <Navbar />
</div>
<div className='pt-8 px-12 flex flex-row'>
<button onClick={() => setSortField('rank')} className='border border-white px-8 py-4 hover:bg-yellow_hover transition duration-200'>Sort by Rank</button>
        <button onClick={() => setSortField('bibNumber')} className='border border-white px-8 py-4 hover:bg-yellow_hover transition duration-200'>Sort by Bib Number</button>
        <div className='flex flex-row justify-end'>
        <button onClick={handleExport} className='border border-white px-8 py-4 hover:bg-yellow_hover transition duration-200'>Export to CSV</button>
        </div>
</div>
<div className='px-12 pt-8'>
<table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>First Name</th>
            <th>Surname</th>
            <th>Bib Number</th>
            <th>Athlete ID</th>
            <th>Finish Time</th>
            <th>Race Progress</th>
            <th>Team Name</th>
            <th>Flag</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
        {sortedAthletes.map(RESULTS => (
            <tr key={RESULTS.bibNumber}>
              <td>{RESULTS.rank}</td>
              <td>{RESULTS.firstName}</td>
              <td>{RESULTS.surname}</td>
              <td>{RESULTS.athleteId}</td>
              <td>{RESULTS.finishTime}</td>
              <td>{RESULTS.raceProgress}</td>
              <td>{RESULTS.teamName}</td>
              <td>{RESULTS.bibNumber}</td>
              <td>{RESULTS.countryName}</td>
              <td>{RESULTS.country}</td>
            </tr>
        ))}
        </tbody>
      </table>
</div>
  </>
  )
}

export default App;
