const { exec } = require('child_process');

class PythonRunner {
  // Method to run the Python script and return a Promise
  async runPythonScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
      // Path to the batch file you created
      
      const batchFilePath = '.\\run_conda.bat'; 
      const argsFormatted = ` "${args.join('" "')}"`
      console.log(argsFormatted)
      const command = `"${batchFilePath}" "${scriptPath}" ${ argsFormatted} `;
      console.log(command)
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Python script error: ${stderr}`);
          reject(new Error(`Python script exited with code ${error.code}`)); // Reject the Promise on error
          return;
        }

        console.log(`Python script finished with exit code 0`);
        resolve(stdout); // Resolve the Promise with the output
      });
    });
  }
}

module.exports = PythonRunner;