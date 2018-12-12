module.exports = (url, info) => {
	return new Promise(resolve => {
		if (!info) return resolve(url);
		if (url === '/') {
			url = info.company + '/' + info.dir;
			resolve(url);
		} else if (url.indexOf(info.company + '/' + info.dir) === -1) {
			url = info.company + '/' + info.dir + url;
			resolve(url);
		} else {
			resolve(url);
		}
	});
};