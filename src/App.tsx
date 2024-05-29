import { useState, useEffect, useMemo } from 'react';
import Navbar from '../src/ui/components/Navbar';
import MarathonResults from '../constants/MarathonResults.json';

interface Athlete {
  rank: number;
  firstname: string;
  surname: string;
  athleteid: number;
  finishtime: string;
  raceprogress: string;
  teamname: string;
  bibnumber: number;
  flag: string;
  countryname: string;
}

interface JsonResult {
  results: {
    athletes: Athlete[];
    gender: string;
    lastupdated: string;
    raceStatus: string;
    racelength: number;
    racename: string;
    tod: string;
  };
}

function App() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sortField, setSortField] = useState<'rank' | 'bibnumber'>('rank');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data: JsonResult = MarathonResults;
      setAthletes(data.results.athletes);
    } catch (error) {
      setError('Error loading data');
      console.error(error);
    }
  }, []);

  const sortedAthletes = useMemo(() => {
    return [...athletes].sort((a, b) => a[sortField] - b[sortField]);
  }, [athletes, sortField]);

  const handleExport = () => {
    const csvData = sortedAthletes.map((athlete) => {
      return `${athlete.rank},${athlete.firstname} ${athlete.surname},${athlete.finishtime},${athlete.countryname}`;
    });
    const csvHeader = 'Rank,Full Name,Finish Time,Country Code';
    const csvContent = [csvHeader, ...csvData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'race_results.csv';
    a.click();
  };

  return (
    <>
      <Navbar />
      <div className='pt-8 px-12 flex flex-row'>
        <button
          onClick={() => setSortField('rank')}
          className='border border-light_grey text-light_grey px-12 py-4 hover:bg-yellow_hover hover:text-brilliant_white transition duration-700 mr-2'
        >
          Sort by Rank
        </button>
        <button
          onClick={() => setSortField('bibnumber')}
          className='border border-light_grey text-light_grey px-8 hover:bg-yellow_hover hover:text-brilliant_white transition duration-700'
        >
          Sort by Bib Number
        </button>
        <div className='flex justify-end ml-auto'>
          <button
            onClick={handleExport}
            className='border border-light_grey text-light_grey px-8 py-4 transition duration-700 hover:bg-yellow_hover hover:text-brilliant_white'
          >
            Export to CSV
          </button>
        </div>
      </div>
      <div className='px-12 pt-8 text-center'>
        {error && <p className='text-red-500'>{error}</p>}
        <table className='table-auto w-full'>
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
            {sortedAthletes.map((athlete) => (
              <tr key={athlete.bibnumber}>
                <td>{athlete.rank}</td>
                <td>{athlete.firstname}</td>
                <td>{athlete.surname}</td>
                <td>{athlete.bibnumber}</td>
                <td>{athlete.athleteid}</td>
                <td>{athlete.finishtime}</td>
                <td>{athlete.raceprogress}</td>
                <td>{athlete.teamname}</td>
                <td>{athlete.flag}</td>
                <td>{athlete.countryname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;

