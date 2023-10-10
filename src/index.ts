#!/usr/bin/env node
import { SieCli } from "./cli/index.js";
import { getPrefs } from "./cli/prefs.js";

const prefs = getPrefs();
new SieCli(prefs).start();

//chalk | inquirer | gradient-string | chalk-animation | figlet | nanospinner