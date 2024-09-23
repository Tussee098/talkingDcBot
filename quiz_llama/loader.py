import json
import os


class Loader:
    def __init__(self):
        self.keys = ""
        self.load_keys()  # Initialize keys to None in the constructor

    def load_keys(self):
        """Load the JSON file and store its content in the keys attribute."""

        keys_file_path = os.path.join(os.path.dirname(__file__), '..', 'keys.json')
        with open(keys_file_path, 'r') as file:
            self.keys = json.load(file)  # Load the file content as a file

    def get_key(self, key_name):
        """Return the value for the given key name."""
        if self.keys is None:
            raise ValueError("Keys not loaded. Call load_keys() first.")
        
        return self.keys[key_name]  # Use get to avoid KeyError
