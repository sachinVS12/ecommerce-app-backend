const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const fielupload = require("express-fielupload");
const doetnv = require("dotenv");
const errorhandler = require("./middleware/error");

//load environemnt varaible
doetnv.config({ path: "./.env" });

// intailalization express
