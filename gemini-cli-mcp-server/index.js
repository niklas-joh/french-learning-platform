const { exec } = require('child_process');
const readline = require('readline');
const path = require('path');
const os = require('os');

// Load environment variables from the .gemini/.env file in the home directory
require('dotenv').config({ path: path.join(os.homedir(), '.gemini', '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const toolSchema = {
  name: 'run_gemini',
  description: 'Executes a command using the Gemini CLI.',
  input_schema: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'The command to execute with the Gemini CLI (e.g., "c "Hello World"").',
      },
    },
    required: ['command'],
  },
};

function sendResponse(response) {
  const responseStr = JSON.stringify(response);
  process.stdout.write(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
}

function runGemini(command) {
  return new Promise((resolve) => {
    // Pass the current environment variables to the child process
    exec(`gemini ${command}`, { env: process.env }, (error, stdout, stderr) => {
      if (error) {
        resolve({
          is_error: true,
          content: stderr || `exec error: ${error.message}`,
        });
        return;
      }
      resolve({ content: stdout });
    });
  });
}

// Send the schema as the first message
sendResponse({ tools: [toolSchema] });

rl.on('line', async (line) => {
  if (line.startsWith('Content-Length:')) {
    // This is a simple parser, a real implementation would be more robust
    const bodyIndex = line.indexOf('\r\n\r\n') + 4;
    if (bodyIndex > 4) {
        const body = line.substring(bodyIndex);
        try {
            const request = JSON.parse(body);
            if (request.tool_name === 'run_gemini') {
                const result = await runGemini(request.input.command);
                sendResponse({
                    tool_name: 'run_gemini',
                    tool_result: result,
                });
            }
        } catch (e) {
            // ignore parse error
        }
    }
  }
});
