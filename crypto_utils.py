from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Read key from environment
FERNET_KEY = os.environ.get("FERNET_KEY")

if not FERNET_KEY:
    # If no key exists, generate one (run once)
    FERNET_KEY = Fernet.generate_key().decode()
    print("SAVE THIS KEY SECURELY:", FERNET_KEY)
    raise SystemExit("FERNET_KEY not found. Set it in .env and restart the app.")

# Initialize Fernet
fernet = Fernet(FERNET_KEY.encode())

# Encrypt/decrypt functions
def encrypt_vote(vote: str) -> str:
    return fernet.encrypt(vote.encode()).decode()

def decrypt_vote(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()
