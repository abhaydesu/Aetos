from datetime import datetime
import os

# ANSI color codes
BLUE = "\033[34m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
BOLD = "\033[1m"
RESET = "\033[0m"

def hr(char="─", length=80):
    """Print a horizontal rule"""
    print(f"{BLUE}{char * length}{RESET}")

def format_table(headers, rows, title=None):
    """Print a pretty table with optional title"""
    # Calculate column widths
    widths = [len(h) for h in headers]
    for row in rows:
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(str(cell)))
    
    # Build format string for rows
    fmt = "│ " + " │ ".join(f"{{:<{w}}}" for w in widths) + " │"
    width = sum(widths) + len(headers) * 3 + 1
    
    if title:
        hr("═", width)
        print(f"║ {BOLD}{title.center(width-4)}{RESET} ║")
    
    hr("─", width)
    print(fmt.format(*[f"{BOLD}{h}{RESET}" for h in headers]))
    hr("─", width)
    
    for row in rows:
        print(fmt.format(*[str(cell) for cell in row]))
    hr("─", width)

def log_step(msg, step_type="INFO"):
    """Print a formatted log message"""
    colors = {
        "INFO": BLUE,
        "SUCCESS": GREEN,
        "WARN": YELLOW,
        "ERROR": RED
    }
    color = colors.get(step_type, BLUE)
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    print(f"{color}[{ts}] {step_type:<7}{RESET} {msg}")

def suppress_alts_warnings():
    """Redirect stderr briefly to suppress ALTS warnings"""
    import sys
    import tempfile
    
    # Only redirect stderr for import operations
    stderr = sys.stderr
    with tempfile.NamedTemporaryFile() as tf:
        sys.stderr = open(tf.name, 'w')
        # Here the caller can do imports that generate ALTS warnings
        sys.stderr = stderr