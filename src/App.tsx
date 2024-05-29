import { useState, useCallback, useEffect, useMemo } from 'react';
import Navbar from '../src/ui/components/Navbar';
import axios from 'axios';
import MarathonResults from '../constants/MarathonResults.json'

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
    lastupdated: Date;
    raceStatus: string;
    raceLength: number;
    racename: string;
    tod: Date;
  };
}

function App() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sortField, setSortField] = useState<'rank' | 'bibnumber'>('rank');
  const [error, setError] = useState<string | null>(null);

  const getAthletes = useCallback(async () => {
    try {
      const result = await axios.get<JsonResult>('../constants/MarathonResults.json');
      setAthletes(result.data.results.athletes);
    } catch (error: unknown) {
      setError('Error fetching data');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAthletes();
  }, [getAthletes]);

  const sortedAthletes = useMemo(() => {
    return [...athletes].sort((a, b) => a[sortField] - b[sortField]);
  }, [athletes, sortField]);

  const handleExport = () => {
    axios
      .get('/api/export-csv')
      .then((response) => {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'race_results.csv';
        a.click();
      })
      .catch((error) => console.error('Error exporting CSV:', error));
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className='pt-8 px-12 flex flex-row'>
        <button onClick={() => setSortField('rank')} className='border border-light_grey text-light_grey px-12 py-4 hover:bg-yellow_hover hover:text-brilliant_white transition duration-400 mr-2'>
          Sort by Rank
        </button>
        <button onClick={() => setSortField('bibnumber')} className='border border-light_grey text-light_grey px-8 hover:bg-yellow_hover hover:text-brilliant_white transition duration-400'>
          Sort by Bib Number
        </button>
        <div className='flex justify-end ml-auto'>
          <button onClick={handleExport} className='border border-light_grey text-light_grey px-8 py-4 transition duration-400 hover:bg-yellow_hover hover:text-brilliant_white'>
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
