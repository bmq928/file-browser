const config = require('config');
const rootFolderFs = process.env.STORAGE_ROOT_FOLDER || config.get('rootFolder');
const {getFile, getPath} = require('../_file-sys');
const {isBinarySync} = require('istextorbinary')

const readFile = async (filePath, options) => {
	
	filePath = getPath(filePath, rootFolderFs, options);
	
	return new Promise(async (resolve, reject) => {
		if (!filePath) return reject(new Error('file_path is required'))
		
		const allowedExtRegex = /.(jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF|bmp|BMP|svg|SVG|pdf|las|asc|LAS|TXT|ASC)$/
		// console.log(filePath, allowedExtRegex.test(filePath))
		if (isBinarySync(filePath) && !allowedExtRegex.test(filePath))
		// if (isBinarySync(filePath))
			return resolve({isReadable: false})
		
		try {
			
			const {base64, utf8} = await getFile(filePath, options)
			const data = {
				isReadable: true,
				base64,
				utf8
			}
			
			if (options.maxSizeText) {
				const TEXT_LENGHT = options.maxSizeText * 1024
				
				// not substr data.base64
				// because it is usually used for read img
				// utf6 is used for reading text
				// data.base64 = data.base64.substr(0, TEXT_LENGHT)
				data.utf8 = data.utf8.substr(0, TEXT_LENGHT)
			}
			
			
			resolve(data)
			
		} catch (error) {
			reject(error)
		}
	})
};

module.exports = {
	readFile
};