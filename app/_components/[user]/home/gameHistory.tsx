import clsx from 'clsx';

const GameHistory = () => {
  const history = [
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferree309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    },
    {
      op: 'ferry (2309)',
      out: 'W',
      mode: 'rapid',
      date: 'Sept 6, 2025 - 10:45'
    }
  ]

  return (
    <table className='w-full text-center border-collapse min-w-max'>
      <thead className='bg-brown2 h-12 font-bold text-fore sticky top-0 z-10'>
        <tr>
          <th>Opponent</th>
          <th>Outcome</th>
          <th>Mode</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody className='font-semibold text-fore1 bg-back4'>
        {
          history.map((his, i) => (
            <tr className='group h-12 cursor-pointer' key={i}>
              <td>{his.op}</td>
              <td className={clsx({
                'text-error1': his.out === 'L',
                'text-green2': his.out === 'W',
              })}>{his.out}</td>
              <td>{his.mode}</td>
              <td>{his.date}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default GameHistory;