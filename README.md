# file-browser-backend

+ download-file
  + GET: /download?file_path=path-to-file
+ file-explorer
  + GET: /file-explore/recursive?dir=path-need-to-use
  + GET: /file-explore/shallow?dir=path-need-to-use
+ upload-file
  + POST: /upload    | body is that file
