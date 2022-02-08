const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3*1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === " application/vnd.ms-excel" 
    ) {
      cb(null, true);
    } else {
      return cb(new Error("INVALID_TYPE"), false);
    }
  },
});

module.exports = upload;