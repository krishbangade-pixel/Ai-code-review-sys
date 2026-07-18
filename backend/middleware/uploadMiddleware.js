
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.html', '.css', '.txt', '.md', '.yaml', '.yml',
      '.py', '.java', '.c', '.cpp', '.h', '.cs', '.go', '.rs'
    ];
    const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only supported code and text files are allowed'), false);
    }
  }
});

module.exports = upload;
