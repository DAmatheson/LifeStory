$(function(){
	startDBInit();
	pageInit();
});

//Displays database errors in a dialog
function errorHandler(transaction, error) {
    alert("SQL error: " + error.message);
}

function startDBInit()
{
	db = window.openDatabase("LifeStory", "1.0",
		"Life Story", 2 * 1024 * 1024);
		
	if (localStorage.getItem("DBState") != "Initialized")
	{
		createTables();
		finishDBInit();
	}
}

function createTables()
{
	createRaceTable();
	createClassTable();
	createCharacterTable();
	createEventNameTable();
	createEventTable();
	createEventDetailTable();
}

function finishDBInit()
{
	insertDefaultRaces();
	insertDefaultClasses();
	localStorage.setItem("DBState", "Initialized");
}

function pageInit()
{
	alert("Database initialized.");
}

function createRaceTable()
{
	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS race " +
			"(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"name VARCHAR(20) NOT NULL);",
			null, null, errorHandler);
	});
}

function createClassTable()
{
	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS class " +
			"(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"name VARCHAR(20) NOT NULL);",
			null, null, errorHandler);
	});
}

function createCharacterTable()
{
	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS character " +
			"(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"name VARCHAR(50) NOT NULL, " +
			"race_id INTEGER, " +
			"class_id INTEGER, " +
			"details TEXT, " +
			"living BOOLEAN NOT NULL);",
			null, null, errorHandler);
	});
}

function createEventNameTable()
{
	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS eventName " +
			"(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"name VARCHAR(60) NOT NULL);",
			null, null, errorHandler);
	});
}

function createEventTable()
{
	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS event " +
			"(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"event_id INTEGER NOT NULL, " +
			"eventName_id INTEGER, " +
			"xp INTEGER, " +
			"numberOfCreatures INTEGER);",
			null, null, errorHandler);
	});
}

function createEventDetailTable()
{
	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS eventDetail " +
			"(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"date DATE NOT NULL, " +
			"numberOfPCs INTEGER, " +
			"description TEXT);",
			null, null, errorHandler);
	});
}

function createCharacterEventTable()
{
	db.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS eventName " +
			"(character_id INTEGER PRIMARY KEY, " +
			"event_id INTEGER PRIMARY KEY);",
			null, null, errorHandler);
	});
}

function insertDefaultRaces()
{
	insertRace("Dwarf");
	insertRace("Human");
	insertRace("Halfling");
	insertRace("Elf");
	insertRace("Half-elf");
	insertRace("Half-orc");
	insertRace("Gnome");
	insertRace("Dragonborn");
	insertRace("Tiefling");
}

function insertRace(raceName)
{
	db.transaction(function (tx) {
		var sql = "INSERT INTO race (name) VALUES (?);";
		tx.executeSql(sql, [raceName], null, errorHandler);
	});
}

function insertDefaultClasses()
{
	insertClass("Barbarian");
	insertClass("Bard");
	insertClass("Cleric");
	insertClass("Druid");
	insertClass("Fighter");
	insertClass("Monk");
	insertClass("Paladin");
	insertClass("Ranger");
	insertClass("Rogue");
	insertClass("Sorcerer");
	insertClass("Warlock");
	insertClass("Wizard");
}

function insertClass(className)
{
	db.transaction(function (tx) {
		var sql = "INSERT INTO class (name) VALUES (?);";
		tx.executeSql(sql, [className], null, errorHandler);
	});
}