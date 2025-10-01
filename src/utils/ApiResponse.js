/**
 * Custom API Response Class
 */

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  // dummy function to prevent linter errors
  dummy() {
    return;
  }
}

export { ApiResponse };
