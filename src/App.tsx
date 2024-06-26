import { useState, useEffect, useMemo } from 'react';
import Navbar from '../src/ui/components/Navbar';
import MarathonResults from '../constants/MarathonResults.json';
import Footer from './ui/components/Footer';

interface Athlete {
  rank: number;
  firstname: string;
  surname: string;
  athleteid: string;
  finishtime: string;
  raceprogress: string;
  teamname: string;
  bibnumber: string;
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
    return [...athletes].sort((a, b) => {
      if (sortField === 'rank') {
        return a.rank - b.rank;
      } else {
        return parseInt(a.bibnumber) - parseInt(b.bibnumber);
      }
    });
  }, [athletes, sortField]);

  const handleExport = () => {
    const csvData = sortedAthletes.map((athlete) => {
      return `${athlete.rank},${athlete.firstname} ${athlete.surname},${athlete.finishtime},${athlete.countryname}`;
    });
    const csvHeader = 'Rank, Full Name, Finish Time, Country Code';
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
      <div className="flex flex-row justify-between px-12 pt-8">
        <div className="dropdown flex flex-row">
          <button className="dropbtn border border-light_grey px-16 py-4 text-center text-light_grey transition duration-700 hover:bg-yellow_hover hover:text-brilliant_white">
            Sort by
          </button>
          <div className="dropdown-content transition duration-700 hover:bg-yellow_hover">
            <a href="#" onClick={() => setSortField('rank')}>
              Rank
            </a>
            <a href="#" onClick={() => setSortField('bibnumber')}>
              Bib Number
            </a>
          </div>
        </div>
        <div className="ml-auto flex justify-end">
          <button
            onClick={handleExport}
            className="border border-light_grey px-8 py-4 text-light_grey transition duration-700 hover:bg-yellow_hover hover:text-brilliant_white"
          >
            Export to CSV
          </button>
        </div>
      </div>
      <div className="px-12 pt-8 text-center">
        {error && <p className="text-red-500">{error}</p>}
        <table className="w-full table-auto">
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
      <Footer />
    </>
  );
}

export default App;
