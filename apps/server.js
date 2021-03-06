var http = require("http"),
    url = require("url"),
    conf = require("../conf/config"),
    Log = require("./log").Log,
    zlib = require("zlib");

function initialize(){

    if(process.argv[2] == '--help' || process.argv[2] == 'help'){
        console.log('\nnode service.js [[[[port]  debug]  compress]  version]');
        console.log('\nExample\nnode service.js 8000 true true\n');
        return;
    }

    var Response = require("./response").Response,
        Resource = require("./resource").Resource;

    http.createServer(function(request, response){
        var res  = new Response(response),
        resource = new Resource(request, res);

        if(res.faviconFix(request.url)) return;

        var content = resource.getResource();

        // var q = require('querystring');
        // Log.log(q.parse(url.parse(request.url).query).c)

        // 小于 150b 不进行gzip压缩
        if(conf.enableGzip && content.length > 150){
            zlib.gzip(content, function(err, buf){
                if(!err){
                    Log.log('Content gziped')
                    res.setHeader('content-encoding', 'gzip');
                    res.send(buf);
                }else Log.log(err);
            });
        }else{
            Log.log('No gzip')
            res.send(content);
        }

    }).listen(conf.port);
    console.log('Server running at port: ' + conf.port + '.');
}

exports.initialize = initialize;