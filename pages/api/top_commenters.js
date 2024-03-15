import { exec } from 'child_process';
import util from 'util';

// Convert exec into a Promise-based function
const execAsync = util.promisify(exec);

export default async function handler(req, res) {
  const { subreddit } = req.query;
  
  console.log(`Fetching top commenters for subreddit: ${subreddit}`);

  try {
    const { stdout, stderr } = await execAsync(`python3 reddit_analyzer.py ${subreddit}`);

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Error executing Python script', details: stderr });
    }

    // Debugging: Log the raw stdout before attempting to parse it
    console.log(`Raw stdout: ${stdout}`);

    // Check if stdout is not empty and is a valid JSON string
    if (!stdout) {
      throw new Error('Python script did not return any output.');
    }

    const data = JSON.parse(stdout); // Attempt to parse stdout as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Determine if the error is from JSON parsing or exec
    if (error.message.includes('Unexpected end of JSON input')) {
      res.status(500).json({ error: 'Error parsing Python script output', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
}
