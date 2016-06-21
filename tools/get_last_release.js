var http = require('https'),
    util = require('util'),
    repoName = 'spbstu/spbstu-admission',
    endpointPath = util.format('/repos/%s/releases/latest', repoName),
    req,
    result = '';

req = http.request({
    hostname: 'api.github.com',
    path: endpointPath,
    headers: {
        'User-Agent': 'Release getter'
    }
}, function(res) {
    res.setEncoding('utf8');

    res.on('data', function (data) {
        result += data;
    });
    res.on('end', function() {
        var data = JSON.parse(result);

        if (data.assets.length > 0) {
            process.stdout.write(data.assets[0]['browser_download_url']);
        } else {
            process.stderr.write("Can't get release url");
            process.exit(1);
        }
    })
});

req.end();
