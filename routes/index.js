var express = require('express');
var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.json();
});

router.post('/uploadImage', function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '.png' : tmpPath.substr(extIndex);
        // uuid is for generating unique filenames.
        var fileName = uuid.v4() + extension;
        var destPath = './client/img/' + fileName;

        // Server side file type checker.
        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }

        fs.rename(tmpPath, destPath, function (err) {
            if (err) {
                console.log(err);
                return res.status(401).send('Image is not saved:' + err);
            }
            return res.json(destPath);
        });
    });
});

module.exports = router;
