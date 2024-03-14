import { useState } from 'react';

export default function Home() {
  const [subreddit, setSubreddit] = useState('');
  const [topCommenters, setTopCommenters] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTopCommenters = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setLoading(true);

    try {
      const res = await fetch(`/api/top_commenters?subreddit=${subreddit}`);
      const data = await res.json();

      if (data.error) {
        alert('Failed to fetch top commenters.');
        console.error(data.error);
      } else {
        setTopCommenters(data);
      }
    } catch (error) {
      console.error('Error fetching top commenters:', error);
      alert('Error fetching data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find Top Commenters in a Subreddit</h1>
      <form onSubmit={fetchTopCommenters}>
        <input
          type="text"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          placeholder="Enter subreddit name"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Top Commenters'}
        </button>
      </form>
      {topCommenters.length > 0 && (
        <div>
          <h2>Top Commenters</h2>
          <ul>
            {topCommenters.map((commenter, index) => (
              <li key={index}>{commenter[0]}: {commenter[1]} comments</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}