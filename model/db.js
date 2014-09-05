/**
 * Created by andycall on 14-9-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    AppConfig = require('../config'),
    url = 'mongodb://' + AppConfig.username + ':' + AppConfig.password + '@' +  AppConfig.mongoose;

mongoose.connect(u);

var Packages = new Schema({
    package_id: String,
    package_name : String,
    package_version : String,
    package_isCompress : Boolean,
});

exports.Packages = mongoose.model('package', Packages);