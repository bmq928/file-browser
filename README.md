# file-browser-backend

+ name-convention:
  + module start with _ is utils contains shared function
  + rest module contain: controller.js, route.js, index.js that is used in server.js to make apis

+ docs: Có thể xem doc chi tiết ở http://localhost:3000/docs
DOCS:
  + download-file
    - GET: /download?file_path=path-to-file
  + file-explorer
    - GET: /file-explore/recursive?dir=path-need-to-use
    - GET: /file-explore/shallow?dir=path-need-to-use
  + upload-file
    - POST: /upload    | body is that file
