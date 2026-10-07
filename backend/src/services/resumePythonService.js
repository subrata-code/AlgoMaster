import http from 'http';

const PYTHON_SERVICE_PORT = process.env.PYTHON_RESUME_SERVICE_PORT || 8001;
const PYTHON_SERVICE_HOST = process.env.PYTHON_RESUME_SERVICE_HOST || '127.0.0.1';

/**
 * Sends structured resume payload to the local offline Python service
 * Returns ATS evaluation, optimization data and generated PDF base64
 */
export async function generateResumeWithPython(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);

    const options = {
      hostname: PYTHON_SERVICE_HOST,
      port: PYTHON_SERVICE_PORT,
      path: '/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 30000,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(new Error(`Failed to parse Python service response: ${err.message}`));
          }
        } else {
          reject(new Error(`Python service failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(
        new Error(
          `Unable to connect to AlgoMaster Python Resume Service on port ${PYTHON_SERVICE_PORT}. Make sure the Python service is running. Details: ${err.message}`
        )
      );
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Python Resume Service request timed out after 30 seconds'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Extract keywords from raw job description text using local Python NLP
 */
export async function parseJobDescriptionWithPython(jobDescription, targetRole = '') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ jobDescription, targetRole });

    const options = {
      hostname: PYTHON_SERVICE_HOST,
      port: PYTHON_SERVICE_PORT,
      path: '/parse-jd',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`Python parse-jd returned ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}
