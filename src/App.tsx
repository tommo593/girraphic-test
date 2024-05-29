import { useState, useCallback, useEffect } from 'react';
import Navbar from '../src/ui/components/Navbar'
import axios from 'axios';
import MarathonResults from '../constants/MarathonResults.json';

type Athlete = {
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

type JsonResult = {
  results: JsonData;
}

type JsonData = {
  athletes: Athlete[];
  gender: string;
  lastupdated: Date;
  raceStatus: string;
  raceLength: number;
  racename: string;
  tod: Date;
}

function App() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sortField, setSortField] = useState<'rank' | 'bibnumber'>('rank');

  const getAthletes = useCallback(async () => {
    try {
      const result = await axios.get<JsonResult>('../constants/MarathonResults.json');
      console.log(result);
      setAthletes(result.data.results.athletes.sort((a, b) => a[sortField] - b[sortField]));
    } catch (error: unknown) {
      console.log(error);
    }
  }, [sortField]);

  useEffect(() => {
    getAthletes();
  }, [getAthletes]);

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
<button onClick={() => setSortField('rank')} className='border border-white px-8 py-4 hover:bg-yellow_hover transition duration-200 button_swipe'>Sort by Rank</button>
        <button onClick={() => setSortField('bibnumber')} className='border border-white px-8 py-4 hover:bg-yellow_hover transition duration-200 button_swipe'>Sort by Bib Number</button>
        <div className='flex justify-end ml-auto'>
        <button onClick={handleExport} className='border border-white px-8 py-4 transition duration-200 hover:bg-yellow_hover button_swipe'>Export to CSV</button>
        </div>
</div>
<div className='px-12 pt-8 text-center'>
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
            {athletes.map((results) => (
              <tr key={results.bibnumber}>
                <td>{results.rank}</td>
                <td>{results.firstname}</td>
                <td>{results.surname}</td>
                <td>{results.bibnumber}</td>
                <td>{results.athleteid}</td>
                <td>{results.raceprogress}</td>
                <td>{results.finishtime}</td>
                <td>{results.teamname}</td>
                <td>{results.flag}</td>
                <td>{results.countryname}</td>
              </tr>
            ))}
          </tbody>
        </table>
</div>
  </>
  )
  }

export default App;
