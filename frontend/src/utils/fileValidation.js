/**
 * File validation utility for the Autonomous AI Code Review system.
 * Handles validation of file content, size, binary detection, 
 * and automatic programming language detection for .txt/.md files.
 */

/**
 * Checks if the given text content is binary.
 * A file is considered binary if it contains null bytes (\x00) or
 * a high ratio of non-printable ASCII control characters.
 * 
 * @param {string} text The file content text.
 * @returns {boolean} True if the content appears to be binary, false if text.
 */
export function isBinary(text) {
  // Read up to first 8000 characters to check for binary signature
  const portion = text.slice(0, 8000);
  for (let i = 0; i < portion.length; i++) {
    const charCode = portion.charCodeAt(i);
    // Null byte character or control characters except Tab (9), LF (10), CR (13)
    if (charCode === 0 || (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13)) {
      return true;
    }
  }
  return false;
}

/**
 * Attempts to automatically detect the programming language of a file
 * based on its text content.
 * 
 * @param {string} content The file content text.
 * @param {string} fileName The original name of the file.
 * @returns {string} The detected file extension (e.g. '.js', '.ts', etc.)
 */
export function detectLanguage(content, fileName) {
  const contentLower = content.toLowerCase();
  
  // 1. Detect HTML content
  if (contentLower.includes('<!doctype html>') || contentLower.includes('<html>') || contentLower.includes('</div>') || contentLower.includes('</a>')) {
    return '.html';
  }
  
  // 2. Detect CSS styles
  if (contentLower.includes('body {') || contentLower.includes('html {') || (content.includes('{') && content.includes('}') && (content.includes('margin:') || content.includes('padding:') || content.includes('color:')))) {
    return '.css';
  }
  
  // 3. Detect TypeScript features (interfaces, type definitions, or enums with standard type declarations)
  if (content.match(/\b(interface|type|enum)\b/) && (content.includes(':') || content.includes('<') || content.includes('>'))) {
    return '.ts';
  }
  
  // 4. Detect JavaScript features (standard JS syntax elements)
  if (content.match(/\b(const|let|var|function|import|export)\b/)) {
    return '.js';
  }

  // 5. Detect Python scripts
  if (content.match(/\b(def|import os|import sys|print\()/) && content.includes(':')) {
    return '.py';
  }

  // 6. Detect Java code
  if (content.match(/\b(public class|public static void main|System\.out\.print)/)) {
    return '.java';
  }

  // 7. Detect C/C++ source code
  if (content.includes('#include') || content.includes('int main(')) {
    return '.cpp';
  }

  // Default to the file's original extension if no programming language matched
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex !== -1 ? fileName.substring(dotIndex).toLowerCase() : '.txt';
}

/**
 * Validates a file by reading its contents, checking for emptiness,
 * verifying it's not a binary file, and detecting the programming language
 * to automatically rename .txt/.md files to the correct extension when possible.
 * 
 * @param {File} file The browser File object.
 * @returns {Promise<{valid: boolean, file: File, error?: string}>}
 */
export async function validateAndProcessFile(file) {
  // 1. Empty check (File size is zero bytes)
  if (file.size === 0) {
    return { valid: false, file, error: "This file is empty." };
  }

  try {
    // 2. Read the file contents using standard text reader API
    const content = await file.text();
    
    // Check if the read text is empty or only whitespace
    if (!content.trim()) {
      return { valid: false, file, error: "This file is empty." };
    }

    // 3. Binary detection (reject non-source-code files like images/zips)
    if (isBinary(content)) {
      return { valid: false, file, error: "The uploaded file doesn't appear to contain source code." };
    }

    // 4. Extension validation list
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.txt', '.md'];
    
    if (!allowedExtensions.includes(ext)) {
      return { valid: false, file, error: "Unsupported file type." };
    }

    // 5. If the file is .txt or .md, attempt programming language auto-detection
    let processedFile = file;
    if (ext === '.txt' || ext === '.md') {
      const detectedExt = detectLanguage(content, file.name);
      
      // If we detected a valid code language, rename the extension to trigger proper reviews
      if (detectedExt !== ext) {
        const dotIndex = file.name.lastIndexOf('.');
        const baseName = dotIndex !== -1 ? file.name.slice(0, dotIndex) : file.name;
        const newName = baseName + detectedExt;
        
        // Re-wrap the file with the updated extension name
        processedFile = new File([file], newName, { type: file.type });
      }
    }

    // File passed all validation steps successfully
    return { valid: true, file: processedFile };
  } catch (err) {
    // Catch-all for files that cannot be read due to file permissions or read faults
    return { valid: false, file, error: "The file cannot be read." };
  }
}
