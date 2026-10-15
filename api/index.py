import sys
from pathlib import Path

# Add project root to Python search path
root = Path(__file__).parent.parent
sys.path.insert(0, str(root))

from backend.app.main import app
