import praw
from collections import Counter
import json
import sys  # Import the sys module to access command-line arguments

# Initialize praw with your Reddit API credentials
reddit = praw.Reddit(
    client_id='vz0rmy7VhdJDWA',
    client_secret='rD68hevlbd1IDnX3t37ImCu18TX5SA',
    user_agent='redditAppTopComments'
)

def get_top_commenters(subreddit_name):
    try:
        subreddit = reddit.subreddit(subreddit_name)
        commenters = [comment.author.name for comment in subreddit.comments(limit=1000) if comment.author]
        top_commenters = Counter(commenters).most_common(20)
        return top_commenters
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == "__main__":
    # Check if a subreddit name was passed as a command-line argument
    if len(sys.argv) > 1:
        subreddit_name = sys.argv[1]  # Get the subreddit name from command-line arguments
    else:
        print("No subreddit name provided.")
        sys.exit(1)  # Exit the script with an error code
    
    top_commenters = get_top_commenters(subreddit_name)
    print(json.dumps(top_commenters))  # Print the result as a JSON string
