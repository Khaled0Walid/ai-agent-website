import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Echo a message back to the console.")
    parser.add_argument("--message", type=str, required=True, help="The message to echo")
    
    args = parser.parse_args()
    
    try:
        # Deterministic logic: simple echo
        echoed_message = f"ECHO: {args.message}"
        print(echoed_message)
        
        # In a real tool, we might write to a file in .tmp/ here
        # with open(".tmp/last_echo.txt", "w") as f:
        #     f.write(echoed_message)
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
