import { useState } from 'react';
import Navbar from '../src/ui/components/Navbar'


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
  return (
  <>
  <div>
    <Navbar />
</div>
<div>
<table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>First Name</th>
            <th>Surname</th>
            <th>Athlete ID</th>
            <th>Finish Time</th>
            <th>Race Progress</th>
            <th>Team Name</th>
            <th>Bib Number</th>
            <th>Flag</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
        {sortedAthletes.map(athlete => (
            <tr key={athlete.bibNumber}>
              <td>{athlete.rank}</td>
              <td>{athlete.firstName}</td>
              <td>{athlete.surname}</td>
              <td>{athlete.athleteId}</td>
              <td>{athlete.finishTime}</td>
              <td>{athlete.raceProgress}</td>
              <td>{athlete.teamName}</td>
              <td>{athlete.bibNumber}</td>
              <td>{athlete.countryName}</td>
              <td>{athlete.country}</td>
            </tr>
        ))}
        </tbody>
      </table>
</div>
  </>
  )
}

export default App;
