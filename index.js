var http = require('http');
var fs = require('fs');
var xmldom = require('xmldom');
var csv = require('csv-parse');
var opn = require('opn');

const csvdata = fs.readFileSync('./201830-Subject_Course Timetables - ttbl0010.csv');

// asks user for input and returns it.
function getInput(question) {
	return new Promise (resolve => {
		const readline = require('readline').createInterface({
	  		input: process.stdin,
	  		output: process.stdout
		});
		readline.question(question, (input) => {
	  		readline.close()
	  		resolve(input)
		});
	})
}

// checks the working directory for the filename and returns it
function checkFileExists(filename) {
    return new Promise (resolve => {
        // './'+filename --- put this in instead of hardcoded on next line
        fs.access('./201830-Subject_Course Timetables - ttbl0010.csv', err => {
            if (err) {
                console.log('Could not find the file');
                process.exit()
            } else {
                resolve('201830-Subject_Course Timetables - ttbl0010.csv');
            }
        });
    });
}

async function createXML(dataArr) {
    var xmlFile = fs.readFileSync('./data/test.xml')
    var parser = new xmldom.DOMParser();
    var xmldoc = parser.parseFromString(xmlFile.toString(), 'text/xml');
    xmldoc.getElementsByTagName('Schedule')[0].setAttribute('BLOCK', blockInput);
    var root = xmldoc.documentElement;
    for(var z = 0; z < root.childNodes.length; z++){
        root.removeChild(root.childNodes[z].nodeName)
    }

    for(var i = 0; i <dataArr.length; i++){
    	var block = xmldoc.createElement("CLASS");
        var crn   = xmldoc.createElement("CRN");
        var course =  xmldoc.createElement("COURSE")
        var type = xmldoc.createElement("TYPE");
        var day = xmldoc.createElement("DAY");
        var beginTime = xmldoc.createElement("BEGIN_TIME");
        var endTime = xmldoc.createElement("END_TIME");
        var instructor = xmldoc.createElement("INSTRUCTOR");
        var bldRoom = xmldoc.createElement("BLDG_ROOM");
        var startDate = xmldoc.createElement("START_DATE");
        var endDate = xmldoc.createElement("END_DATE");
        var max = xmldoc.createElement("MAX.");
        var act = xmldoc.createElement("ACT.");
        var hrs = xmldoc.createElement("HRS");
        var spacer =  xmldoc.createTextNode("\n")

        block.setAttribute("BLOCK",dataArr[i][1]);
        crn.textContent = dataArr[i][2];
        course.textContent = dataArr[i][3];
        type.textContent = dataArr[i][4];
        instructor.setAttribute("teacher",dataArr[i][8]);
        day.textContent = dataArr[i][5];
        beginTime.textContent = dataArr[i][6];
        endTime.textContent = dataArr[i][7];
        instructor.textContent = dataArr[i][8];
        bldRoom.textContent = dataArr[i][9];
        startDate.textContent = dataArr[i][10];
        endDate.textContent = dataArr[i][11];
        max.textContent = dataArr[i][12];
        act.textContent = dataArr[i][13];
        hrs.textContent = dataArr[i][14];

        block.appendChild(crn);
        block.appendChild(course);
        block.appendChild(type);
        block.appendChild(day);
        block.appendChild(beginTime);
        block.appendChild(endTime);
        block.appendChild(instructor);
        block.appendChild(bldRoom);
        block.appendChild(startDate);
        block.appendChild(endDate);
        block.appendChild(max);
        block.appendChild(act);
        block.appendChild(hrs);

		root.appendChild(block);
        root.appendChild(spacer);

	}
    fs.writeFileSync('./data/' + fileDate + '-' + blockInput + '.xml',root);
}

async function createTeacherXML(dataArr) {
    var xmlFile = fs.readFileSync('./data/test.xml')
    var parser = new xmldom.DOMParser();
    var xmldoc = parser.parseFromString(xmlFile.toString(), 'text/xml');
    xmldoc.getElementsByTagName('Schedule')[0].setAttribute('BLOCK', blockInput);
    var root = xmldoc.documentElement;
    for(var z = 0; z < root.childNodes.length; z++){
        root.removeChild(root.childNodes[z].nodeName)
    }

    for(var i = 0; i <dataArr.length; i++){
        var block = xmldoc.createElement("CLASS");
        var crn   = xmldoc.createElement("CRN");
        var course =  xmldoc.createElement("COURSE")
        var type = xmldoc.createElement("TYPE");
        var day = xmldoc.createElement("DAY");
        var beginTime = xmldoc.createElement("BEGIN_TIME");
        var endTime = xmldoc.createElement("END_TIME");
        var instructor = xmldoc.createElement("INSTRUCTOR");
        var bldRoom = xmldoc.createElement("BLDG_ROOM");
        var startDate = xmldoc.createElement("START_DATE");
        var endDate = xmldoc.createElement("END_DATE");
        var max = xmldoc.createElement("MAX.");
        var act = xmldoc.createElement("ACT.");
        var hrs = xmldoc.createElement("HRS");
        var spacer =  xmldoc.createTextNode("\n")

        block.setAttribute("BLOCK",dataArr[i][1]);
        crn.textContent = dataArr[i][2];
        instructor.textContent = dataArr[i][8];
        instructor.setAttribute("teacher",dataArr[i][8]);
        course.textContent = dataArr[i][3];
        type.textContent = dataArr[i][4];
        day.textContent = dataArr[i][5];
        beginTime.textContent = dataArr[i][6];
        endTime.textContent = dataArr[i][7];
        bldRoom.textContent = dataArr[i][9];
        startDate.textContent = dataArr[i][10];
        endDate.textContent = dataArr[i][11];
        max.textContent = dataArr[i][12];
        act.textContent = dataArr[i][13];
        hrs.textContent = dataArr[i][14];

        block.appendChild(crn);
        block.appendChild(instructor);
        block.appendChild(course);
        block.appendChild(type);
        block.appendChild(day);
        block.appendChild(beginTime);
        block.appendChild(endTime);
        block.appendChild(bldRoom);
        block.appendChild(startDate);
        block.appendChild(endDate);
        block.appendChild(max);
        block.appendChild(act);
        block.appendChild(hrs);

        root.appendChild(block);
        root.appendChild(spacer);

    }
    fs.writeFileSync('./data/' + fileDate + '-' + "-acit-instructors" + '.xml',root);
}

function formatData(){
    var data = fs.readFileSync('./data/' + fileDate + '-'+ blockInput +'.xml')
    var parser = new xmldom.DOMParser();
    var xmldoc = parser.parseFromString(data.toString(), 'text/xml');
    var root = xmldoc.documentElement;

    var classesType ='<h1>'+ root.getAttribute("BLOCK") +'</h1>';
    var x = root.childNodes;
    var classDates = [];

    for(var i = 0;  i < x.length; i++){
        if(x[i].nodeName=="CLASS"){
            classDates.indexOf(x[i].getAttribute("BLOCK")) === -1?  classDates.push(x[i].getAttribute("BLOCK")):""
        }
    }

    for(var a = 0; a < classDates.length; a++) {
        classesType+= '<h2>'+ classDates[a]+"</h2>";
        classesType+='<ul>'
        for (var z = 0; z < x.length; z++) {
            if (x[z].nodeName == "CLASS") {
                if(x[z].getAttribute("BLOCK") == classDates[a]){

                    var kidNodes = x[z].childNodes;
                    classesType+=' <li>'
                    for(var p = 0;  p < kidNodes.length;p++){
                        classesType += kidNodes[p].nodeName + ": " + kidNodes[p].textContent+ ""
                    }
                    classesType+= "</li> ";
                }
            }
        classesType+='</ul>';

        }
    }
    fs.writeFileSync('./data/' + fileDate + '-' + blockInput + '.html',classesType);
}


function formatTeacherHtmltData(){
    var data = fs.readFileSync('./data/' + fileDate + '-'+ blockInput +'.xml')
    var parser = new xmldom.DOMParser();
    var xmldoc = parser.parseFromString(data.toString(), 'text/xml');
    var root = xmldoc.documentElement;

    var classesType ='<h1>'+ root.getAttribute("BLOCK") +'</h1>';
    var x = root.childNodes;
    var classDates = [];

    for(var i = 0;  i < x.length; i++){
        // going through all of the class objects
        if(x[i].childNodes != null) {
            for (var z = 0; z < x[i].childNodes.length; z++) {
                if (x[i].childNodes[z].nodeName == "INSTRUCTOR") {
                    classDates.indexOf(x[i].childNodes[z].getAttribute("teacher")) === -1 ? classDates.push(x[i].childNodes[z].getAttribute("teacher")) : ""
                }
            }
        }


    }
    for(var a = 0; a < classDates.length; a++) {
        classesType+= '<h2>'+ classDates[a]+"</h2>";
        classesType+='<ul>'
        for (var z = 0; z < x.length; z++) {
            if(x[z].childNodes != null) {
                for (var f = 0; f < x[z].childNodes.length; f++) {
                    console.log(x[z].childNodes[f].nodeName);
                    if (x[z].childNodes[f].nodeName == "INSTRUCTOR") {
                        if(x[z].childNodes[f].getAttribute("teacher") == classDates[a]){

                            var kidNodes = x[z].childNodes;
                            classesType+=' <li>'
                            for(var p = 0;  p < kidNodes.length;p++){
                                classesType += kidNodes[p].nodeName + ": " + kidNodes[p].textContent+ ""
                            }
                            classesType+= "</li> ";
                        }
                    }
                }
                classesType+='</ul>';
            }
        }
    }
    fs.writeFileSync('./data/' + fileDate+" teacher" + '-' + blockInput + '.html',classesType);
}

// Reads a file and cleans it before returning it as an array
async function readData() {
    return new Promise ((resolve, reject) => {
        let rawData = []
         csv(csvdata, {trim: true, skip_empty_lines: false, from_line: 1})
        .on('readable', function() {
            let data;


            while (data = this.read()) {
                for (i=0; i < data.length; i++) {
                    data[i] = data[i].replace('*', '');
                    data[i] = data[i].trimLeft();

                }
                rawData.push(data);
            } 


            // if (rawData.length <= 0) {
            //     console.log('No results found for "' + blockInput + '"');
            //     process.exit();
            // } else {
            //     resolve()
            // }
            //code is syncrohnous so methods are being called way to early

        }).on('end', function() {
             resolve(rawData);
         })
    })
}


// loops through an array and returns filtered student data.

function getStudentData(rawData) {
    return new Promise (resolve => {
        var parsedData = []
        for (i=0; i<rawData.length; i++) {
            if (rawData[i][1].split(" ")[0] === blockInput && rawData[i][0] === "Active") {
                if (["Mon","Tue","Wed","Thu","Fri"].includes(rawData[i][5])) {
                    parsedData.push(rawData[i]);
                }
            }
        }

        if (parsedData.length <= 0) {
            console.log('No Daytime classes found for "' + blockInput + '"');
            process.exit();
        } else {
            resolve(parsedData)
        }
    });
}

// loops through an array to find the teachers for a program then returns all courses those teachers teach.
function getTeacherData() {
    readData()
    .then((rawData) => {
        let teacherList = []
        for (let i=0; i<rawData.length; i++) {
             if (rawData[i][1].split(" ")[0] === blockInput && rawData[i][0] === "Active") {
                if (!teacherList.includes(rawData[i][8]) && rawData[i][8] != ',') {
                    teacherList.push(rawData[i][8]);
                }
            }
        }

        let teacherClasses = []
        for (let i=0; i<rawData.length; i++) {
             if (teacherList.includes(rawData[i][8])) {
                teacherClasses.push(rawData[i]);
            }
        }
    })
}

var fileName = '';
var fileDate = '';
var blockInput = '';

getInput('Enter the name of the file you want to use.\n')
    .then(filenameInput => {
        fileName = checkFileExists(filenameInput)
        fileDate = filenameInput.split("-")[0]
        return getInput('Enter the block you want to know ex(ACIT)\n')
    })
    .then((input) => {
        blockInput = input.toUpperCase()
        return readData()
    })
    .then((rawData) => {
        return getStudentData(rawData);
    })
    .then(studentData => {return createXML(studentData)})
    .then(() => {formatData()})
    .then(() => {getTeacherData()})
    .then(() =>{readData().then((data) =>{ createTeacherXML(data)})
    })
    .then(() =>{
        formatTeacherHtmltData()
    })



